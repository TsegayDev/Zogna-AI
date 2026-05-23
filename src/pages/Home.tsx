'use client';
import * as React from 'react';
import Header from '@/components/layout/header';
import ChatArea from '@/components/chat/chat-area';
import Sidebar from '@/components/layout/sidebar';
import { InputBox } from '@/components/chat/input-box';
import { useAppSidebar } from '@/context/sidebar-provider';

export default function Home() {
  const { isOpen } = useAppSidebar();
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        {/* The main content area now has a flex-1 and a relative position */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* ChatArea is now the scrollable element */}
          <div className="flex-1 overflow-y-auto">
            <ChatArea />
          </div>
          {/* InputBox remains at the bottom of the flex container */}
          <InputBox />
        </main>
      </div>
    </div>
  );
}