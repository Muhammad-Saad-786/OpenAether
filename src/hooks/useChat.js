// src/hooks/useChat.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase/client';
import { useAuthStore } from '../stores/authStore';
import { RateLimiter } from '../lib/security/rate-limiter';

const rateLimiter = new RateLimiter();

export function useChat() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async ({ message, provider, conversationId }) => {
      // Check rate limit
      await rateLimiter.checkLimit(user.id, 'chat');

      // Save message to database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          user_id: user.id,
          content: message,
          role: 'user',
          provider,
        })
        .select()
        .single();

      if (error) throw error;

      // Call AI provider through Supabase function
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
        'chat-completion',
        {
          body: {
            message,
            provider,
            conversationId,
          },
        },
      );

      if (aiError) throw aiError;

      return aiResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['messages', data.conversation_id]);
    },
  });

  return {
    sendMessage,
    isLoading: sendMessage.isLoading,
    error: sendMessage.error,
  };
}
