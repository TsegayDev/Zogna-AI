
'use client';

import { useContext } from 'react';
import { AiSettingsContext } from '@/context/ai-settings-context';

export const useAiSettings = () => {
  const context = useContext(AiSettingsContext);
  if (context === undefined) {
    throw new Error('useAiSettings must be used within an AiSettingsProvider');
  }
  return context;
};
