'use client';

import { useContext } from 'react';
import { ModelContext } from '@/context/model-context';

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};
