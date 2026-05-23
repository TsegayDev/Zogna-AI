
'use client';

import type { Chat, Message } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useModel } from '@/hooks/use-model';
// Direct genkit flow imports removed—Vite app must call API via REST
import toast from 'react-hot-toast';
import { useAiSettings } from '@/hooks/use-ai-settings';


interface ChatContextType {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  setActiveChatId: (id: string | null) => void;
  getChatById: (id: string | null) => Chat | undefined;
  addMessageToChat: (chatId: string, content: string) => void;
  createNewChat: () => string;
  deleteChat: (chatId: string) => void;
  deleteAllChats: () => void;
  renameChat: (chatId: string, newTitle: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  retryLastMessage: (chatId: string) => void;
  cancelResponse: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedModel } = useModel();
  const { temperature } = useAiSettings();

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateNewChat = useCallback((): Chat => ({
    id: `chat-${Date.now()}`,
    title: `New Chat`,
    messages: [],
    createdAt: new Date().toISOString(),
    model: selectedModel.name,
  }), [selectedModel.name]);

  useEffect(() => {
    try {
      const storedChats = localStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
        const storedActiveId = localStorage.getItem('activeChatId');
        setActiveChatId(storedActiveId ? JSON.parse(storedActiveId) : null);
      } else {
        const initialChat = generateNewChat();
        setChats([initialChat]);
        setActiveChatId(initialChat.id);
      }
    } catch (error) {
      console.error('Failed to load chats from localStorage', error);
      const initialChat = generateNewChat();
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
    }
  }, [generateNewChat]);

  useEffect(() => {
    try {
      // Filter out chats that are empty and not the active one
      const filteredChats = chats.filter(chat => chat.messages.length > 0 || chat.id === activeChatId);
      if (filteredChats.length < chats.length) {
        setChats(filteredChats);
      }
      localStorage.setItem('chats', JSON.stringify(filteredChats));

      if (activeChatId) {
        localStorage.setItem('activeChatId', JSON.stringify(activeChatId));
      } else {
        localStorage.removeItem('activeChatId');
      }
    } catch (error) {
      console.error('Failed to save chats to localStorage', error);
    }
  }, [chats, activeChatId]);


  const getChatById = (id: string | null) => {
    if (!id) return undefined;
    return chats.find((chat) => chat.id === id);
  };

  const createNewChat = () => {
    const activeChat = getChatById(activeChatId);
    // If the current active chat is empty, just reuse it.
    if (activeChat && activeChat.messages.length === 0) {
      renameChat(activeChat.id, 'New Chat');
      return activeChat.id;
    }

    const newChat = generateNewChat();
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id;
  };

  const addMessageToChat = async (chatId: string, content: string, isRetry = false) => {
    if (isLoading) return;

    let currentChat = getChatById(chatId);
    let historyForApi: Message[] = [];

    if (!isRetry) {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        status: 'success'
      };

      historyForApi = (currentChat?.messages || [])
        .filter(m => (m.role === 'user' || m.role === 'assistant') && m.status === 'success');

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            const isFirstMessage = chat.messages.length === 0;
            const newTitle = isFirstMessage
              ? content.split(' ').slice(0, 7).join(' ')
              : chat.title;

            return {
              ...chat,
              title: newTitle,
              model: selectedModel.name,
              messages: [...chat.messages, userMessage]
            };
          }
          return chat;
        })
      );
    } else {
      historyForApi = (currentChat?.messages.slice(0, -1) || [])
        .filter(m => (m.role === 'user' || m.role === 'assistant') && m.status === 'success');
    }

    setIsLoading(true);

    const assistantMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      status: 'loading',
      timestamp: new Date().toISOString(),
    };

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [...chat.messages, assistantMessage] } : chat
      )
    );

    try {
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/chatFlow` 
        : '/api/chatFlow';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            history: historyForApi,
            prompt: content,
            temperature: temperature
          }
        }),
        signal: abortControllerRef.current?.signal // In case abort is wired up later
      });

      if (!res.ok) {
        throw new Error(`Chat API failed with status ${res.status}`);
      }

      const data = await res.json();
      const response = data.result;

      setChats(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            const newMessages = chat.messages.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: response.content, status: 'success' as const }
                : msg
            );
            return { ...chat, messages: newMessages };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("Error calling chat API:", error);
      toast.error("An error occurred while fetching the response.");
      setChats(prev =>
        prev.map(chat => {
          if (chat.id === chatId) {
            const newMessages = chat.messages.map(msg =>
              msg.id === assistantMessage.id ? { ...msg, status: 'failed' as const, content: "Sorry, I couldn't get a response." } : msg
            );
            return { ...chat, messages: newMessages };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setChats(prev =>
      prev.map(chat => {
        const lastMessage = chat.messages[chat.messages.length - 1];
        if (lastMessage && (lastMessage.status === 'loading' || lastMessage.status === 'streaming')) {
          const newMessages = chat.messages.slice(0, -1);
          return { ...chat, messages: newMessages };
        }
        return chat;
      })
    );

    setIsLoading(false);
  };

  const retryLastMessage = (chatId: string) => {
    const chat = getChatById(chatId);
    if (!chat || chat.messages.length < 2) return;

    const lastUserMessage = chat.messages.filter(m => m.role === 'user').pop();
    const lastAiMessage = chat.messages[chat.messages.length - 1];

    if (lastUserMessage && lastAiMessage.role === 'assistant' && lastAiMessage.status === 'failed') {
      // Remove the failed AI response
      setChats(prev =>
        prev.map(c =>
          c.id === chatId
            ? { ...c, messages: c.messages.slice(0, -1) }
            : c
        )
      );
      // Resend the last user message
      addMessageToChat(chatId, lastUserMessage.content, true);
    } else {
      toast.error("No failed message to retry.");
    }
  };

  const deleteChat = (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        const sortedChats = [...updatedChats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setActiveChatId(sortedChats[0].id);
      } else {
        const newChat = generateNewChat();
        setChats([newChat]);
        setActiveChatId(newChat.id);
      }
    }
  };

  const deleteAllChats = () => {
    const newChat = generateNewChat();
    setChats([newChat]);
    setActiveChatId(newChat.id);
  };

  const renameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat))
  };

  const deleteMessage = (chatId: string, messageId: string) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: chat.messages.filter(m => m.id !== messageId) }
          : chat
      )
    );
  };

  const value = {
    chats,
    activeChatId,
    isLoading,
    setActiveChatId,
    getChatById,
    addMessageToChat,
    createNewChat,
    deleteChat,
    deleteAllChats,
    renameChat,
    deleteMessage,
    retryLastMessage,
    cancelResponse
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
