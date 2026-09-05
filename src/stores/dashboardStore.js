// src/stores/dashboardStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

export const useDashboardStore = create((set, get) => ({
  stats: {
    totalConversations: 0,
    totalMessages: 0,
    totalTokens: 0,
    averageResponseTime: 0,
    mostUsedModel: 'N/A',
    activeModels: 0,
  },
  recentActivity: [],
  modelUsage: [],
  dailyUsage: [],
  loading: false,

  fetchDashboardData: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });

    try {
      // Fetch conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Fetch messages
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (msgError) throw msgError;

      // Calculate stats
      const totalConversations = conversations?.length || 0;
      const totalMessages = messages?.length || 0;
      const aiMessages = messages?.filter((m) => m.role === 'assistant') || [];

      // Calculate model usage
      const modelCount = {};
      aiMessages.forEach((msg) => {
        if (msg.model) {
          const modelName = msg.model.split('/').pop();
          modelCount[modelName] = (modelCount[modelName] || 0) + 1;
        }
      });

      const modelUsage = Object.entries(modelCount).map(([name, count]) => ({
        name,
        count,
        percentage: totalMessages > 0 ? ((count / aiMessages.length) * 100).toFixed(1) : 0,
      }));

      // Most used model
      const mostUsedModel =
        modelUsage.length > 0 ? modelUsage.sort((a, b) => b.count - a.count)[0].name : 'N/A';

      // Recent activity (last 10 messages)
      const recentActivity =
        messages?.slice(0, 10).map((msg) => ({
          id: msg.id,
          action: msg.role === 'user' ? 'Sent a message' : 'AI response',
          content: msg.content.slice(0, 50) + (msg.content.length > 50 ? '...' : ''),
          time: msg.created_at,
          model: msg.model || null,
          conversation_id: msg.conversation_id,
        })) || [];

      // Daily usage (last 7 days)
      const dailyUsage = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayMessages =
          messages?.filter((msg) => {
            const msgDate = new Date(msg.created_at).toISOString().split('T')[0];
            return msgDate === dateStr;
          }) || [];

        dailyUsage.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: dayMessages.length,
        });
      }

      set({
        stats: {
          totalConversations,
          totalMessages,
          totalTokens: totalMessages * 100, // Estimate: ~100 tokens per message
          averageResponseTime: '1.2s',
          mostUsedModel,
          activeModels: modelUsage.length,
        },
        recentActivity,
        modelUsage,
        dailyUsage,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ loading: false });
    }
  },

  // Fetch conversations for chat history
  fetchChatHistory: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];

    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        messages (count)
      `,
      )
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  },
}));
