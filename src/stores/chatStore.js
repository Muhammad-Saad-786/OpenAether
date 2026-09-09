// src/stores/chatStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

// Helper function to generate title from user prompt
function generateSmartTitle(prompt) {
  // Clean the prompt
  const cleanPrompt = prompt.trim().replace(/\s+/g, ' ');

  // If prompt is short, use it directly
  if (cleanPrompt.length <= 30) {
    return cleanPrompt;
  }

  // Take first 30 characters and add ellipsis
  return cleanPrompt.slice(0, 30) + '...';
}

export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  messagesByConversation: {},
  loading: false,
  preloadPromise: null,

  // Load all conversations for current user
  loadConversations: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ conversations: data || [] });
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      set({ loading: false });
    }
  },

  preloadAllData: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const existingPromise = get().preloadPromise;
    if (existingPromise) return existingPromise;

    const preloadPromise = (async () => {
      set({ loading: true });
      try {
        const [
          { data: conversations, error: conversationsError },
          { data: allMessages, error: messagesError },
        ] = await Promise.all([
          supabase
            .from('conversations')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false }),
          supabase
            .from('messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true }),
        ]);

        if (conversationsError) throw conversationsError;
        if (messagesError) throw messagesError;

        const messagesByConversation = (allMessages || []).reduce((cache, message) => {
          if (!cache[message.conversation_id]) cache[message.conversation_id] = [];
          cache[message.conversation_id].push(message);
          return cache;
        }, {});

        set({
          conversations: conversations || [],
          messagesByConversation,
          loading: false,
        });
      } catch (error) {
        console.error('Error preloading chat data:', error);
        set({ loading: false });
      } finally {
        set({ preloadPromise: null });
      }
    })();

    set({ preloadPromise });
    return preloadPromise;
  },

  // Create new conversation with auto-generated title
  createConversation: async (title = null, provider = null, model = null, firstMessage = null) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    // Generate title
    let conversationTitle;
    if (title) {
      conversationTitle = title;
    } else if (firstMessage) {
      conversationTitle = generateSmartTitle(firstMessage);
    } else {
      conversationTitle = 'New Conversation';
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title: conversationTitle,
        provider,
        model,
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      conversations: [data, ...state.conversations],
      currentConversation: data,
      messages: [],
    }));

    return data;
  },

  // Update conversation title
  updateConversationTitle: async (conversationId, newTitle) => {
    const { data, error } = await supabase
      .from('conversations')
      .update({ title: newTitle, updated_at: new Date() })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === conversationId ? data : c)),
      currentConversation:
        state.currentConversation?.id === conversationId ? data : state.currentConversation,
    }));

    return data;
  },

  // Set current conversation
  setCurrentConversation: (conversation) => {
    const cachedMessages = conversation?.id ? get().messagesByConversation[conversation.id] : null;
    set({
      currentConversation: conversation,
      messages: cachedMessages || [],
    });

    // Fetch only when this conversation was not included in the preload cache.
    if (conversation?.id && !cachedMessages) {
      get().loadMessages(conversation.id);
    }
  },

  // Load messages for a conversation
  loadMessages: async (conversationId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set((state) => ({
        messages: data || [],
        messagesByConversation: {
          ...state.messagesByConversation,
          [conversationId]: data || [],
        },
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      set({ loading: false });
    }
  },

  // Send message
  sendMessage: async (content, role = 'user', provider = null, model = null) => {
    const user = useAuthStore.getState().user;
    const { currentConversation } = get();

    if (!user) throw new Error('User not authenticated');
    if (!currentConversation) throw new Error('No active conversation');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        user_id: user.id,
        role,
        content,
        provider,
        model,
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      messages: [...state.messages, data],
      messagesByConversation: {
        ...state.messagesByConversation,
        [currentConversation.id]: [
          ...(state.messagesByConversation[currentConversation.id] || []),
          data,
        ],
      },
    }));

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date() })
      .eq('id', currentConversation.id);

    return data;
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId);

    if (error) throw error;

    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
      currentConversation: null,
      messages: [],
    }));
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const { error } = await supabase.from('messages').delete().eq('id', messageId);

    if (error) throw error;

    set((state) => ({
      messages: state.messages.filter((m) => m.id !== messageId),
      messagesByConversation: Object.fromEntries(
        Object.entries(state.messagesByConversation).map(([conversationId, cachedMessages]) => [
          conversationId,
          cachedMessages.filter((message) => message.id !== messageId),
        ]),
      ),
    }));
  },

  // Update message
  updateMessageLocal: (messageId, newContent) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === messageId ? { ...message, content: newContent } : message,
      ),
    }));
  },

  updateMessage: async (messageId, newContent) => {
    console.log('📝 Updating message:', messageId, 'with:', newContent);

    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ content: newContent })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }

      console.log('✅ Message updated:', data);

      set((state) => ({
        messages: state.messages.map((m) => (m.id === messageId ? data : m)),
        messagesByConversation: Object.fromEntries(
          Object.entries(state.messagesByConversation).map(([conversationId, cachedMessages]) => [
            conversationId,
            cachedMessages.map((message) => (message.id === messageId ? data : message)),
          ]),
        ),
      }));

      return data;
    } catch (error) {
      console.error('❌ Failed to update message:', error);
      throw error;
    }
  },

  // Clear all messages in current conversation
  clearMessages: () => {
    set({ messages: [] });
  },
}));
