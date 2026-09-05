// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  Cpu,
  Square,
  ArrowDown,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useChatStore } from '@/stores/chatStore';
import { useAuthStore } from '@/stores/authStore';
import { providerManager } from '@/lib/providers/provider-manager';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { toast } from 'sonner';

const sampleModels = [
  { id: 'auto', name: 'Auto Select', description: 'Smart model rotation', model: null },
  { id: 'gpt4o', name: 'GPT-4o Mini', model: 'openai/gpt-4o-mini' },
  { id: 'gemma-26b', name: 'Gemma 4 26B', model: 'google/gemma-4-26b-a4b-it:free' },
  { id: 'gemma-31b', name: 'Gemma 4 31B', model: 'google/gemma-4-31b-it:free' },
  { id: 'glm', name: 'GLM 5.2', model: 'z-ai/glm-5.2:free' },
  { id: 'minimax', name: 'MiniMax M3', model: 'minimax/minimax-m3:free' },
];

export function ChatPage() {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const {
    conversations,
    currentConversation,
    messages,
    loading: chatLoading,
    loadConversations,
    createConversation,
    setCurrentConversation,
    sendMessage,
    deleteConversation,
    deleteMessage,
    updateMessage,
    clearMessages,
  } = useChatStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loading, navigate, loadConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const handleNewChat = () => {
    setSidebarOpen(false);

    if (!currentConversation) {
      return;
    }

    if (messages.length === 0) {
      return;
    }
    setCurrentConversation(null);
  };
  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    try {
      await deleteConversation(conversationId);
      toast.success('Conversation deleted');
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const user = useAuthStore.getState().user;
    if (!user) {
      toast.error('Please login first');
      return;
    }

    setIsSending(true);
    const userMessage = input;
    setInput('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await providerManager.initializeProviders(user.id);

      let conversation = currentConversation;

      // If no conversation exists, create one with auto-generated title
      if (!conversation) {
        conversation = await createConversation(
          null, // No explicit title
          selectedModel, // Provider
          null, // Model
          userMessage, // First message for title generation
        );
      }

      await sendMessage(userMessage, 'user', selectedModel);

      const conversationMessages = useChatStore.getState().messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const selectedModelData = sampleModels.find((m) => m.id === selectedModel);
      const modelName = selectedModelData?.model || null;

      const response = await providerManager.smartChat(conversationMessages, {
        model: modelName,
      });

      await sendMessage(response.content, 'assistant', response.model || selectedModel);
      toast.success(`Response from ${response.model}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to get AI response');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    console.log('🔄 Editing message:', messageId, 'New content:', newContent);

    try {
      // 1. Update the user message
      await updateMessage(messageId, newContent);

      // 2. Find the message index
      const messageIndex = messages.findIndex((m) => m.id === messageId);

      // 3. Delete all messages after the edited message (AI responses)
      const messagesToDelete = messages.slice(messageIndex + 1);
      for (const msg of messagesToDelete) {
        if (msg.role === 'assistant') {
          await deleteMessage(msg.id);
        }
      }

      // 4. Resend to AI with updated context
      setIsSending(true);

      try {
        const user = useAuthStore.getState().user;
        await providerManager.initializeProviders(user.id);

        // Get updated conversation messages up to the edited message
        const updatedMessages = useChatStore
          .getState()
          .messages.slice(0, messageIndex + 1)
          .map((m) => ({ role: m.role, content: m.content }));

        const selectedModelData = sampleModels.find((m) => m.id === selectedModel);
        const modelName = selectedModelData?.model || null;

        // Get new AI response
        const response = await providerManager.smartChat(updatedMessages, {
          model: modelName,
        });

        // Save new AI response
        await sendMessage(response.content, 'assistant', response.model || selectedModel);

        toast.success('Message updated and response regenerated');
      } catch (error) {
        console.error('Error regenerating response:', error);
        toast.error('Message updated but failed to regenerate response');
      } finally {
        setIsSending(false);
      }

      return true;
    } catch (error) {
      console.error('❌ Edit failed:', error);
      toast.error('Failed to update message');
      return false;
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleRegenerate = async (messageId) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    const userMessage = messages[messageIndex - 1];

    if (!userMessage || userMessage.role !== 'user') {
      toast.error('Cannot regenerate this message');
      return;
    }

    setIsSending(true);

    try {
      const user = useAuthStore.getState().user;
      await providerManager.initializeProviders(user.id);

      const conversationMessages = messages
        .slice(0, messageIndex)
        .map((m) => ({ role: m.role, content: m.content }));

      const selectedModelData = sampleModels.find((m) => m.id === selectedModel);
      const modelName = selectedModelData?.model || null;

      const response = await providerManager.smartChat(conversationMessages, {
        model: modelName,
      });

      await updateMessage(messageId, response.content);
      toast.success('Response regenerated');
    } catch (error) {
      toast.error('Failed to regenerate response');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform bg-muted/20 transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={handleNewChat}
            >
              <Plus className="size-4" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {conversations.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No conversations yet
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={cn(
                    'group mb-1 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    currentConversation?.id === conv.id
                      ? 'bg-aether-500/10 text-aether-500 font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <div className="flex-1 truncate">
                    <div className="truncate">{conv.title || 'New Conversation'}</div>
                    <div className="text-[11px] text-muted-foreground/80">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-3">
          <button
            className="absolute left-4 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="text-sm font-medium text-foreground/90 truncate max-w-[60%]">
            {currentConversation?.title || 'New Chat'}
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4"
        >
          {messages.length === 0 && !isSending ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-aether-500 to-aether-400 shadow-md">
                <span className="text-2xl font-bold text-white">O</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Start a conversation with OpenAether. Your messages are saved automatically.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {/* Typing Indicator - Shows when AI is thinking */}
              {isSending && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-8 rounded-full bg-background p-2.5 shadow-xl hover:bg-accent transition-all"
          >
            <ArrowDown className="size-4" />
          </button>
        )}

        {/* Input Area */}
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border bg-background shadow-md transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Message OpenAether..."
                className="w-full resize-none bg-transparent px-4 pt-3 pb-2 text-sm outline-none placeholder:text-muted-foreground"
                rows={1}
                style={{ maxHeight: '200px', boxShadow: 'none' }}
              />

              <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
                <div className="relative flex items-center">
                  <Cpu className="pointer-events-none absolute left-3 size-3.5 text-aether-500" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none cursor-pointer rounded-full bg-muted/50 hover:bg-muted pl-8 pr-7 py-1.5 text-xs font-medium text-foreground outline-none transition-colors"
                  >
                    {sampleModels.map((model) => (
                      <option
                        key={model.id}
                        value={model.id}
                        className="bg-background text-foreground"
                      >
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
                </div>

                {isSending ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsSending(false)}
                    className="size-8 rounded-full shrink-0"
                  >
                    <Square className="size-3.5 fill-current" />
                  </Button>
                ) : (
                  <Button
                    variant="gradient"
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="size-8 rounded-full shrink-0 shadow-sm"
                  >
                    <Send className="size-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
