// src/components/chat/MessageBubble.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  Pencil,
  Trash2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  User,
  Bot,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';

export function MessageBubble({ message, onEdit, onDelete, onRegenerate, isStreaming = false }) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = () => {
    setEditedContent(message.content);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

    setIsSaving(true);
    try {
      await onEdit(message.id, editedContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update message:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    }
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group flex gap-3 px-4 py-2 hover:bg-muted/20 rounded-lg transition-colors',
        message.role === 'user' ? 'flex-row-reverse' : '',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg mt-1',
          message.role === 'user' ? 'bg-gradient-to-br from-aether-500 to-aether-400' : 'bg-muted',
        )}
      >
        {message.role === 'user' ? (
          <User className="size-4 text-white" />
        ) : (
          <Bot className="size-4 text-aether-500" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'min-w-0 max-w-[80%] overflow-hidden wrap-break-word',
          message.role === 'user' ? 'text-right' : 'text-left',
        )}
      >
        {isEditing ? (
          /* Edit Mode - Clean, no border */
          <div className="w-full text-left">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-w-[300px] resize-none bg-muted/50 rounded-2xl px-4 py-3 text-sm outline-none focus:outline-none"
              rows={Math.min(editedContent.split('\n').length, 6)}
              autoFocus
              placeholder="Edit your message..."
            />

            {/* Action Buttons Only */}
            <div className="flex items-center gap-1 mt-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={handleCancelEdit}
                title="Cancel"
              >
                <X className="size-3" />
              </Button>
              <Button
                variant="gradient"
                size="icon"
                className="size-7"
                onClick={handleSaveEdit}
                disabled={isSaving || !editedContent.trim()}
                title="Save"
              >
                {isSaving ? (
                  <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="size-3" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Display */
          <div
            className={cn(
              'inline-block max-w-full rounded-2xl px-4 py-3 text-left',
              message.role === 'user'
                ? 'bg-gradient-to-r from-aether-500 to-aether-400 text-white'
                : 'bg-card border',
            )}
          >
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : message.content && isStreaming ? (
              <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
            ) : message.content ? (
              <MarkdownRenderer content={message.content} />
            ) : (
              <span className="inline-block size-2.5 animate-pulse rounded-full bg-aether-500" />
            )}
            {isStreaming && message.content && (
              <span className="ml-1 inline-block size-2 align-middle animate-pulse rounded-full bg-aether-500" />
            )}
          </div>
        )}

        {/* Actions - Only show when not editing */}
        {!isEditing && (
          <div
            className={cn(
              'flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            {message.role === 'user' ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleStartEdit}
                  title="Edit message"
                >
                  <Pencil className="size-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={handleCopy}
                  title="Copy message"
                >
                  {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onRegenerate(message.id)}
                  title="Regenerate response"
                >
                  <RefreshCw className="size-3" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" title="Like">
                  <ThumbsUp className="size-3" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7" title="Dislike">
                  <ThumbsDown className="size-3" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Timestamp & Model */}
        {!isEditing && (
          <div
            className={cn(
              'flex items-center gap-2 mt-1 text-xs text-muted-foreground',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            <span>{formatTime(message.created_at || message.timestamp)}</span>
            {message.model && (
              <span className="px-2 py-0.5 bg-aether-500/10 text-aether-500 rounded-full">
                {message.model}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
