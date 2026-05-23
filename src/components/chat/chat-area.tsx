
'use client';

import * as React from 'react';
import { useChat } from '@/hooks/use-chat';
import MessageBubble from './message-bubble';
import ChatWelcome from './chat-welcome';
import { ScrollArea } from '../ui/scroll-area';

export default function ChatArea() {
  const { activeChatId, getChatById } = useChat();
  const chat = getChatById(activeChatId);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = React.useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  React.useEffect(() => {
    if (!userHasScrolled) {
      scrollToBottom();
    }
  }, [chat?.messages, userHasScrolled]);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 1;
    setUserHasScrolled(!isAtBottom);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1" onScroll={handleScroll}>
        <div className="p-3 md:p-12 lg:p-20 w-full">
          {chat && chat.messages.length > 0 ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {chat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
               <div ref={messagesEndRef} className="h-px" />
            </div>
          ) : (
            <ChatWelcome />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
