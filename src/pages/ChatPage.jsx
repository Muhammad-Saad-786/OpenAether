// src/pages/ChatPage.jsx
import { useState, useEffect, useRef, memo, useCallback } from 'react';
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
  { id: 'auto', name: 'Auto Select', model: null, provider: null },
  { id: 'or-gpt4o', name: 'GPT-4o Mini', model: 'openai/gpt-4o-mini', provider: 'openrouter' },
  {
    id: 'or-gemma-26b',
    name: 'Gemma 26B',
    model: 'google/gemma-4-26b-a4b-it:free',
    provider: 'openrouter',
  },
  {
    id: 'or-gemma-31b',
    name: 'Gemma 31B',
    model: 'google/gemma-4-31b-it:free',
    provider: 'openrouter',
  },
  { id: 'or-glm', name: 'GLM 5.2', model: 'z-ai/glm-5.2:free', provider: 'openrouter' },
  {
    id: 'or-minimax',
    name: 'MiniMax M3',
    model: 'minimax/minimax-m3:free',
    provider: 'openrouter',
  },
  { id: 'groq-gptoss20', name: 'GPT-OSS 20B ⚡', model: 'openai/gpt-oss-20b', provider: 'groq' },
  { id: 'groq-gptoss120', name: 'GPT-OSS 120B 🧠', model: 'openai/gpt-oss-120b', provider: 'groq' },
  { id: 'groq-compound', name: 'Groq Compound 🤖', model: 'groq/compound', provider: 'groq' },
  {
    id: 'groq-compound-mini',
    name: 'Compound Mini ⚡',
    model: 'groq/compound-mini',
    provider: 'groq',
  },
  { id: 'groq-qwen36', name: 'Qwen 3.6 27B', model: 'qwen/qwen3.6-27b', provider: 'groq' },
  { id: 'groq-qwen38', name: 'Qwen 3.8 27B', model: 'qwen/qwen3.8-27b', provider: 'groq' },
  {
    id: 'groq-orpheus',
    name: 'Orpheus English',
    model: 'canopylabs/orpheus-v1-english',
    provider: 'groq',
  },
];

const MemoizedMessageBubble = memo(MessageBubble);

export function ChatPage() {
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('auto');
  const [isSending, setIsSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const {
    conversations,
    currentConversation,
    messages,
    loadConversations,
    createConversation,
    setCurrentConversation,
    sendMessage,
    deleteConversation,
    deleteMessage,
    updateMessage,
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

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isSending, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  }, []);

  const resetChat = useCallback(() => {
    setCurrentConversation(null);
    setVisibleCount(15);
    setSidebarOpen(false);
  }, [setCurrentConversation]);

  const handleNewChat = useCallback(() => {
    if (!currentConversation) {
      setSidebarOpen(false);
      return;
    }
    if (messages.length === 0) {
      setSidebarOpen(false);
      return;
    }
    resetChat();
  }, [currentConversation, messages.length, resetChat]);

  const handleSelectConversation = useCallback(
    (conversation) => {
      setCurrentConversation(conversation);
      setVisibleCount(15);
      setSidebarOpen(false);
    },
    [setCurrentConversation],
  );

  const handleDeleteConversation = useCallback(
    async (conversationId, e) => {
      e.stopPropagation();
      try {
        await deleteConversation(conversationId);
        toast.success('Conversation deleted');
      } catch (error) {
        toast.error('Failed to delete conversation');
      }
    },
    [deleteConversation],
  );

  const getModelConfig = useCallback((modelId) => {
    return sampleModels.find((m) => m.id === modelId) || null;
  }, []);

  const handleSend = useCallback(async () => {
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
      if (!conversation) {
        conversation = await createConversation(null, selectedModel, null, userMessage);
      }

      await sendMessage(userMessage, 'user', selectedModel);

      const conversationMessages = useChatStore.getState().messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const modelConfig = getModelConfig(selectedModel);

      // FIRST RESPONSE
      const response = await providerManager.smartChat(conversationMessages, {
        model: modelConfig?.model || null,
        provider: modelConfig?.provider || null,
        maxTokens: 5000,
        temperature: 0.5,
      });

      // Save first response and get the saved message
      const savedMessage = await sendMessage(
        response.content,
        'assistant',
        response.model || selectedModel,
      );

      // CHECK IF RESPONSE IS INCOMPLETE
      const trimmed = response.content.trim();
      const endsWithComplete = ['.', '!', '?', '```', '}', ';', ')', ':', '"', "'"].some((end) =>
        trimmed.endsWith(end),
      );

      // Also check if it looks like code was cut off
      const looksCutOff = trimmed.includes('=>') && !trimmed.includes('}');

      if (!endsWithComplete || looksCutOff) {
        toast.info('Continuing response...');

        // CONTINUE WITH CONTEXT
        const continueMessages = [
          ...conversationMessages,
          { role: 'assistant', content: response.content },
          {
            role: 'user',
            content:
              'Continue exactly from where you stopped. Do not repeat anything. Complete the code/explanation.',
          },
        ];

        const continuation = await providerManager.smartChat(continueMessages, {
          model: modelConfig?.model || null,
          provider: modelConfig?.provider || null,
          maxTokens: 800,
          temperature: 0.5,
        });

        if (continuation.content && continuation.content.trim()) {
          // Update the SAME message with combined content
          const fullContent = response.content + '\n' + continuation.content;
          await updateMessage(savedMessage.id, fullContent);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to get AI response');
    } finally {
      setIsSending(false);
    }
  }, [
    input,
    isSending,
    currentConversation,
    selectedModel,
    createConversation,
    sendMessage,
    updateMessage,
    getModelConfig,
  ]);

  const handleEditMessage = useCallback(
    async (messageId, newContent) => {
      try {
        await updateMessage(messageId, newContent);
        const messageIndex = messages.findIndex((m) => m.id === messageId);
        const messagesToDelete = messages.slice(messageIndex + 1);

        for (const msg of messagesToDelete) {
          if (msg.role === 'assistant') {
            await deleteMessage(msg.id);
          }
        }

        setIsSending(true);
        const user = useAuthStore.getState().user;
        await providerManager.initializeProviders(user.id);

        const updatedMessages = useChatStore
          .getState()
          .messages.slice(0, messageIndex + 1)
          .map((m) => ({ role: m.role, content: m.content }));

        const modelConfig = getModelConfig(selectedModel);

        const response = await providerManager.smartChat(updatedMessages, {
          model: modelConfig?.model || null,
          provider: modelConfig?.provider || null,
          maxTokens: 5000,
          temperature: 0.5,
        });

        await sendMessage(response.content, 'assistant', response.model || selectedModel);
        toast.success('Message updated');
        return true;
      } catch (error) {
        console.error('Edit failed:', error);
        toast.error('Failed to update message');
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [messages, updateMessage, deleteMessage, selectedModel, sendMessage, getModelConfig],
  );

  const handleDeleteMessage = useCallback(
    async (messageId) => {
      try {
        await deleteMessage(messageId);
        toast.success('Message deleted');
      } catch (error) {
        toast.error('Failed to delete message');
      }
    },
    [deleteMessage],
  );

  const handleRegenerate = useCallback(
    async (messageId) => {
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

        const modelConfig = getModelConfig(selectedModel);

        const response = await providerManager.smartChat(conversationMessages, {
          model: modelConfig?.model || null,
          provider: modelConfig?.provider || null,
          maxTokens: 5000,
          temperature: 0.5,
        });

        await updateMessage(messageId, response.content);
        toast.success('Response regenerated');
      } catch (error) {
        toast.error('Failed to regenerate');
      } finally {
        setIsSending(false);
      }
    },
    [messages, selectedModel, updateMessage, getModelConfig],
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleTextareaChange = useCallback((e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  }, []);

  const visibleMessages = messages.slice(-visibleCount);
  const hiddenCount = messages.length - visibleCount;

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
                      : 'text-black hover:bg-accent hover:text-foreground',
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

      {/* Mobile Overlay */}
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

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4"
        >
          {messages.length === 0 && !isSending ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl font-bold tracking-tight">How can I help you today?</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Start a conversation with OpenAether.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-4">
              {hiddenCount > 0 && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 15)}
                  className="w-full text-center text-xs text-aether-500 hover:underline py-2"
                >
                  ↑ Show {Math.min(15, hiddenCount)} earlier messages
                </button>
              )}

              {visibleMessages.map((message) => (
                <MemoizedMessageBubble
                  key={message.id}
                  message={message}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  onRegenerate={handleRegenerate}
                />
              ))}

              {isSending && <TypingIndicator />}
              {/* Manual Continue Button - shows if last message seems incomplete */}
              {!isSending &&
                messages.length > 0 &&
                (() => {
                  const lastMessage = messages[messages.length - 1];
                  if (lastMessage?.role !== 'assistant') return null;

                  const trimmed = lastMessage.content.trim();
                  const isIncomplete = !['.', '!', '?', '```', '}', ';', ')', ':', '"'].some(
                    (end) => trimmed.endsWith(end),
                  );

                  if (!isIncomplete) return null;

                  return (
                    <div className="flex justify-center my-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setIsSending(true);
                          try {
                            const user = useAuthStore.getState().user;
                            await providerManager.initializeProviders(user.id);

                            const conversationMessages = messages.map((m) => ({
                              role: m.role,
                              content: m.content,
                            }));

                            const modelConfig = getModelConfig(selectedModel);

                            const continuation = await providerManager.smartChat(
                              [
                                ...conversationMessages,
                                {
                                  role: 'user',
                                  content:
                                    'Continue exactly from where you stopped. Do not repeat.',
                                },
                              ],
                              {
                                model: modelConfig?.model || null,
                                provider: modelConfig?.provider || null,
                                maxTokens: 800,
                                temperature: 0.5,
                              },
                            );

                            if (continuation.content && continuation.content.trim()) {
                              await sendMessage(
                                continuation.content,
                                'assistant',
                                continuation.model || selectedModel,
                              );
                            }
                          } catch (error) {
                            toast.error('Failed to continue');
                          } finally {
                            setIsSending(false);
                          }
                        }}
                      >
                        <ArrowDown className="size-3 mr-1" />
                        Continue Response
                      </Button>
                    </div>
                  );
                })()}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-8 rounded-full bg-background p-2.5 shadow-xl hover:bg-accent transition-all"
          >
            <ArrowDown className="size-4" />
          </button>
        )}

        {/* Input */}
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
