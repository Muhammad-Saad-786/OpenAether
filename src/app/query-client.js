// src/app/query-client.js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});
