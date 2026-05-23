import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './app/globals.css'; // Will be moved later
import './app/loader.css';
import './app/loader-pulse.css';

import { ThemeProvider } from '@/components/theme-provider';
import { ChatProvider } from '@/context/chat-context';
import { ModelProvider } from '@/context/model-context';
import { SidebarProvider } from '@/context/sidebar-provider';
import { AppInitializer } from '@/components/app-initializer';
import { Toaster } from 'react-hot-toast';
import { AiSettingsProvider } from '@/context/ai-settings-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AppInitializer />
      <SidebarProvider>
        <ModelProvider>
          <AiSettingsProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </AiSettingsProvider>
        </ModelProvider>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
