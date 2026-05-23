'use client';

import { Lightbulb, Book, Code, HelpCircle, FileText } from 'lucide-react';
import { Logo } from '../icons';
import { useChat } from '@/hooks/use-chat';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const SUGGESTED_PROMPTS = [
  {
    icon: <Code className="text-primary" size={20} />,
    title: "Code Help",
    prompt: "Can you help me write a Python function to sort a list of dictionaries by a specific key?"
  },
  {
    icon: <Lightbulb className="text-yellow-500" size={20} />,
    title: "Creative Ideas",
    prompt: "Generate 5 creative marketing ideas for a sustainable clothing brand"
  },
  {
    icon: <FileText className="text-secondary-foreground" size={20} />,
    title: "Writing",
    prompt: "Help me write a professional email to request a meeting with a potential client"
  },
  {
    icon: <HelpCircle className="text-accent-foreground" size={20} />,
    title: "Explanation",
    prompt: "Explain quantum computing in simple terms that anyone can understand"
  }
];

export default function ChatWelcome() {
  const { addMessageToChat, activeChatId, createNewChat, getChatById } = useChat();

  const handlePromptClick = (promptText: string) => {
    let chatId = activeChatId;
    if (!chatId || getChatById(chatId)?.messages?.length > 0) {
        chatId = createNewChat();
    }
    
    if(chatId) {
        addMessageToChat(chatId, promptText);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-2xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto w-full py-8"
          >
            <div className="mb-8">
              <div className="p-3 bg-gradient-to-br from-brand-blue to-brand-purple rounded-2xl inline-block mb-4">
                  <Logo className="w-16 h-16 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground dark:text-white mb-2 font-headline">
                Welcome to Zogna
              </h1>
              <p className="text-muted-foreground dark:text-gray-400 text-lg">
                Your intelligent assistant for coding, writing, creative ideas, and more. Choose a prompt below or start typing your own question.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePromptClick(prompt.prompt)}
                  className="p-4 bg-card border rounded-xl hover:border-primary/30 dark:hover:border-primary/60 hover:shadow-md transition-all duration-200 text-left"
                  aria-label={`Use prompt: ${prompt.title}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0" aria-hidden="true">
                      {prompt.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground dark:text-white mb-1">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed">
                        {prompt.prompt}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  );
}
