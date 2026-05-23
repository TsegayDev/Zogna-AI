
'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface AiSettingsContextType {
  isStreamingEnabled: boolean;
  setIsStreamingEnabled: (value: boolean) => void;
  showTokens: boolean;
  setShowTokens: (value: boolean) => void;
  isThinkingEnabled: boolean;
  setIsThinkingEnabled: (value: boolean) => void;
  thinkingBudget: number;
  setThinkingBudget: (value: number) => void;
  temperature: number;
  setTemperature: (value: number) => void;
}

export const AiSettingsContext = createContext<AiSettingsContextType | undefined>(undefined);

export const AiSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [isStreamingEnabled, setIsStreamingEnabled] = useState(true);
  const [showTokens, setShowTokens] = useState(false);
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(true);
  const [thinkingBudget, setThinkingBudget] = useState(4000);
  const [temperature, setTemperature] = useState(0.7);

  const value = {
    isStreamingEnabled,
    setIsStreamingEnabled,
    showTokens,
    setShowTokens,
    isThinkingEnabled,
    setIsThinkingEnabled,
    thinkingBudget,
    setThinkingBudget,
    temperature,
    setTemperature,
  };

  return <AiSettingsContext.Provider value={value}>{children}</AiSettingsContext.Provider>;
};
