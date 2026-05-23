'use client';

import type { AIModel } from '@/lib/types';
import React, { createContext, useState, ReactNode } from 'react';
import { aiModels } from '@/components/common/model-selector';

interface ModelContextType {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
}

export const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0]);

  const value = {
    selectedModel,
    setSelectedModel,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};
