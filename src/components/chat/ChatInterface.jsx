// src/components/chat/ChatInterface.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Settings, MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ModelSelector } from './ModelSelector';

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          'This is a sample AI response. The actual implementation will connect to your chosen provider.',
        timestamp: new Date(),
        provider: 'Groq',
        model: 'Llama 2 70B',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="glass border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ModelSelector />
            <div className="text-sm text-muted-foreground">{messages.length} messages</div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-aether-500 to-aether-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">O</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome to OpenAether</h2>
                <p className="text-muted-foreground">Start a conversation with any AI model</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>

            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="glass border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2 bg-background rounded-xl border p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="flex-1 bg-transparent resize-none outline-none px-2 py-2 max-h-32"
                rows={1}
                style={{ height: 'auto' }}
              />
              <Button variant="ghost" size="icon">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="gradient" size="icon" onClick={handleSend} disabled={!input.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
