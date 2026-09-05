// src/components/chat/ModelSelector.jsx
import { useState } from 'react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  { id: 'auto', name: 'Auto Select', description: 'Smart routing based on task', free: true },
  { id: 'groq-llama2', name: 'Llama 2 70B', provider: 'Groq', contextWindow: '8K', free: true },
  { id: 'groq-mixtral', name: 'Mixtral 8x7B', provider: 'Groq', contextWindow: '32K', free: true },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', contextWindow: '32K', free: true },
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', contextWindow: '1M', free: true },
  {
    id: 'openrouter-mistral',
    name: 'Mistral 7B',
    provider: 'OpenRouter',
    contextWindow: '8K',
    free: true,
  },
];

export function ModelSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(models[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border bg-background hover:bg-accent transition-colors"
      >
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{selected.name}</span>
        {selected.free && (
          <span className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full">
            FREE
          </span>
        )}
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-20 mt-2 w-80 rounded-xl border bg-card shadow-lg"
            >
              <div className="p-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelected(model);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{model.name}</span>
                        {model.free && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                      {model.description && (
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      )}
                      {model.provider && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">{model.provider}</span>
                          {model.contextWindow && (
                            <span className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
                              {model.contextWindow} context
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {selected.id === model.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
