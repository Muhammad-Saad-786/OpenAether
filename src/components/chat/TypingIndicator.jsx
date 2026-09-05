// src/components/chat/TypingIndicator.jsx
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2">
      {/* AI Avatar */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-1">
        <Bot className="size-4 text-aether-500" />
      </div>

      {/* Typing Dots */}
      <div className="flex-1 max-w-[80%]">
        <div className="inline-block rounded-2xl border bg-card px-4 py-3">
          <div className="flex items-center gap-1.5">
            <motion.span
              className="size-2 rounded-full bg-aether-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="size-2 rounded-full bg-aether-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="size-2 rounded-full bg-aether-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">Thinking...</div>
      </div>
    </div>
  );
}
