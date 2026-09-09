// src/components/chat/MarkdownRenderer.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useMemo, useState } from 'react';

const TINY_CODE_MAX_LENGTH = 60;

function getFenceContent(code, indent) {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  if (lines.length !== 1) return null;

  const line = lines[0].startsWith(indent) ? lines[0].slice(indent.length) : lines[0];
  if (!line || /^\s/.test(line) || line.length > TINY_CODE_MAX_LENGTH) return null;
  if (line.includes('`') || /[{}]/.test(line)) return null;

  return line;
}

/** Convert only genuinely tiny fenced fragments to inline Markdown code. */
export function preprocessMarkdown(markdown) {
  if (!markdown || !markdown.includes('```')) return markdown || '';

  return markdown.replace(
    /^(?<indent>[ \t]*)```[^\r\n`]*\r?\n(?<code>[\s\S]*?)\r?\n\k<indent>```[ \t]*(?=\r?$)/gm,
    (match, indent, code, _offset, _source, groups) => {
      const inlineCode = getFenceContent(code, indent);
      if (!inlineCode) return match;
      return `${groups.indent}\`${inlineCode}\``;
    },
  );
}

export function MarkdownRenderer({ content }) {
  const [copiedCode, setCopiedCode] = useState(null);
  const isDark = document.documentElement.classList.contains('dark');
  const preparedContent = useMemo(() => preprocessMarkdown(content), [content]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="markdown-content min-w-0 max-w-full wrap-break-word">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks - Fix: Don't wrap in div inside p
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <div className="relative group my-4 max-w-full overflow-x-auto">
                  <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-b-0">
                    <span className="text-xs font-medium text-muted-foreground">{match[1]}</span>
                    <button
                      onClick={() => handleCopyCode(codeString)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedCode === codeString ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {copiedCode === codeString ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      maxWidth: '100%',
                      overflowX: 'auto',
                      borderRadius: '0 0 8px 8px',
                      fontSize: '14px',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            if (!inline) {
              return (
                <div className="relative group my-4 max-w-full overflow-x-auto">
                  <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border border-b-0">
                    <span className="text-xs font-medium text-muted-foreground">Code</span>
                    <button
                      onClick={() => handleCopyCode(codeString)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copiedCode === codeString ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {copiedCode === codeString ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={isDark ? oneDark : oneLight}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      maxWidth: '100%',
                      overflowX: 'auto',
                      borderRadius: '0 0 8px 8px',
                      fontSize: '14px',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Inline code - Fix: Don't use div
            return (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          // Headers
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
          // Paragraph - Fix: Ensure no div inside
          p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
          // Lists
          ul: ({ children }) => <ul className="list-disc pl-6 my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-aether-500 hover:underline"
            >
              {children}
            </a>
          ),
          // Blockquote - Fix: Don't use div inside
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-aether-500/30 pl-4 my-2 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border px-4 py-2 bg-muted font-semibold text-left">{children}</th>
          ),
          td: ({ children }) => <td className="border px-4 py-2">{children}</td>,
          // Strong
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          // Emphasis
          em: ({ children }) => <em className="italic">{children}</em>,
          // Horizontal rule
          hr: () => <hr className="my-4 border-border" />,
        }}
      >
        {preparedContent}
      </ReactMarkdown>
    </div>
  );
}
