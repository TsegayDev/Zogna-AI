'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import {
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  User,
  MoreVertical,
  Check,
  Bot,
  Trash2,
  Edit,
} from 'lucide-react';
import type { Message } from '@/lib/types';
import toast from 'react-hot-toast';
import { useChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface MessageBubbleProps {
  message: Message;
}

// Preserving the original LoadingIndicator as requested
const LoadingIndicator = () => (
  <div className="loader-container">
    <div className="loader-dot"></div>
    <div className="loader-dot"></div>
    <div className="loader-dot"></div>
    <div className="loader-dot"></div>
  </div>
);

const TypingCursor = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 1.2, repeat: Infinity }}
    className="inline-block w-2 h-4 bg-primary rounded-full ml-1"
  />
);

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { theme } = useTheme();
  const { retryLastMessage, activeChatId, deleteMessage } = useChat();
  const [copiedText, setCopiedText] = React.useState('');
  const isUser = message.role === 'user';
  const isLoading = message.status === 'loading';
  const isStreaming = message.status === 'streaming';
  const isFailed = message.status === 'failed';

  const handleCopy = async (text: string, type: string = 'Text') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(`${type} copied to clipboard`);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      toast.error(`Failed to copy ${type.toLowerCase()}`);
    }
  };

  const handleLike = (liked: boolean) => {
    toast.success(liked ? 'Message liked' : 'Feedback submitted');
  };

  const handleRetry = () => {
    if (activeChatId) {
      retryLastMessage(activeChatId);
    }
  };

  const handleDelete = () => {
    if (activeChatId) {
      deleteMessage(activeChatId, message.id);
      toast.success("Message deleted.");
    }
  };

  const formatContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.every(item => item.title && item.description)) {
        return parsed.map(item => `### ${item.title}\n${item.description}`).join('\n\n');
      }
    } catch (e) { /* Not JSON */ }
    return content;
  };

  const formattedContent = React.useMemo(() => formatContent(message.content), [message.content]);
  const timestamp = new Date(message.timestamp);

  const bubbleClasses = cn(
    "message-bubble rounded-2xl shadow-md w-full overflow-hidden flex flex-col transition-all duration-200",
    isUser
      ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/50"
      : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700"
  );

  const headerClasses = cn(
    "message-header flex items-center px-4 py-3 border-b",
    isUser ? "border-blue-100 dark:border-blue-800/50" : "border-slate-200 dark:border-slate-700"
  );

  const footerClasses = cn(
    "message-footer flex items-center justify-between px-4 py-2 border-t",
    isUser ? "border-blue-100 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20" : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
  );

  const actionButtonClasses = cn(
    "footer-action text-xs px-2.5 py-1.5 h-auto rounded-md transition-all duration-200",
    isUser 
      ? "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50" 
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn('message flex w-full mb-5', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn(bubbleClasses, 'max-w-3xl')}>
        {/* Header */}
        <div className={headerClasses}>
          {isUser ? (
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm opacity-70"></div>
                <Avatar className="w-8 h-8 relative border-2 border-white dark:border-slate-800">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="message-sender font-semibold text-sm text-blue-700 dark:text-blue-300">
                You
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-purple rounded-full blur-sm opacity-70"></div>
                <Avatar className="w-8 h-8 relative border-2 border-white dark:border-slate-800">
                  <AvatarFallback className="bg-gradient-to-br from-brand-blue to-brand-purple text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="message-sender font-semibold text-sm text-brand-blue dark:text-brand-purple">
                Zogna AI
              </span>
            </div>
          )}
          <div className="message-actions flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "w-7 h-7 rounded-full transition-all duration-200", 
                    isUser 
                      ? "text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  )}
                >
                  <MoreVertical className="w-4 h-4"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onSelect={() => handleCopy(formattedContent)}
                  className="flex items-center cursor-pointer"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Raw Text</span>
                </DropdownMenuItem>
                {!isUser && (
                  <DropdownMenuItem 
                    onSelect={handleRetry}
                    className="flex items-center cursor-pointer"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Retry</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onSelect={handleDelete} 
                  className="flex items-center cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Body */}
        <div className={cn(
          "message-body px-4 py-3 break-words w-full",
          "prose prose-sm dark:prose-invert max-w-none",
          "prose-p:my-2.5 prose-p:leading-relaxed",
          "prose-headings:my-3 prose-headings:font-semibold",
          "prose-ul:my-2 prose-ol:my-2 prose-li:my-1",
          "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:bg-primary/5",
          "prose-code:before:hidden prose-code:after:hidden",
          "prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-2",
          "prose-table:border-collapse prose-table:w-full prose-table:my-3",
          "prose-th:border prose-th:px-3 prose-th:py-2 prose-th:bg-accent/50",
          "prose-td:border prose-td:px-3 prose-td:py-2",
          "prose-hr:my-4 prose-hr:border-t prose-hr:border-border"
        )}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    return <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{children}</p>;
                  },
                  pre({ children }) {
                    return <div className="my-3 w-full">{children}</div>;
                  },
                  code({node, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    const syntaxTheme = theme === 'dark' ? oneDark : oneLight;
                    const isCopied = copiedText === codeString;
                    const isFenced = className || (node.children.length > 0 && 'value' in node.children[0] && node.children[0].value.includes('\n'));
                    const isPlainTextBlock = isFenced && !match;
                    
                    if (isFenced) {
                      return (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm w-full">
                          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              {match ? match[1] : 'text'}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700" 
                              onClick={() => handleCopy(codeString, isPlainTextBlock ? 'Text' : 'Code')}
                            >
                              {isCopied ? <Check className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                            </Button>
                          </div>
                          {match ? (
                            <SyntaxHighlighter
                              style={syntaxTheme}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                padding: '1.25rem',
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                                width: '100%',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-mono)',
                                borderRadius: '0'
                              }}
                              codeTagProps={{
                                style: {
                                  whiteSpace: 'pre-wrap',
                                  backgroundColor: 'transparent',
                                  wordBreak: 'break-word',
                                  fontSize: '0.875rem',
                                  fontFamily: 'var(--font-mono)',
                                },
                              }}
                              wrapLongLines={true}
                              {...props}
                            >
                              {codeString}
                            </SyntaxHighlighter>
                          ) : (
                            <pre style={{
                              margin: 0,
                              padding: '1.25rem',
                              backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              width: '100%',
                              fontSize: '0.875rem',
                              fontFamily: 'var(--font-mono)',
                              borderRadius: '0'
                            }}>
                              <code {...props} style={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                backgroundColor: 'transparent',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-mono)',
                              }} className="text-slate-700 dark:text-slate-300">
                                {children}
                              </code>
                            </pre>
                          )}
                        </div>
                      )
                    }
                    
                    // Inline code
                    return <code className="font-code text-sm font-normal bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-1.5 py-0.5" {...props}>{children}</code>
                  },
                  table({ children }) {
                    return <div className="overflow-x-auto w-full my-4"><table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">{children}</table></div>;
                  },
                  a({ children, href }) {
                    return <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>;
                  },
                  img({ src, alt }) {
                    return (
                      <div className="my-4 flex justify-center w-full">
                        <img 
                          src={src} 
                          alt={alt || ''} 
                          className="max-h-80 max-w-full rounded-lg border border-slate-200 dark:border-slate-700 shadow-md object-contain" 
                          loading="lazy"
                        />
                      </div>
                    );
                  }
                }}
              >
                {formattedContent}
              </ReactMarkdown>
              {isStreaming && <TypingCursor />}
            </>
          )}
        </div>
        
        {/* Footer */}
        {!isLoading && !isStreaming && (
          <div className={footerClasses}>
            <span className={cn("timestamp text-xs", isUser ? "text-blue-600 dark:text-blue-300" : "text-slate-500 dark:text-slate-400")}>
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="footer-actions flex items-center gap-1.5">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleCopy(formattedContent)} 
                className={actionButtonClasses} 
                title="Copy"
              >
                {copiedText === formattedContent ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              {!isUser && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleLike(true)} 
                    className={actionButtonClasses} 
                    title="Like"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleLike(false)} 
                    className={actionButtonClasses} 
                    title="Dislike"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  {isFailed && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRetry} 
                      className={cn(actionButtonClasses, "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30")} 
                      title="Retry"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}