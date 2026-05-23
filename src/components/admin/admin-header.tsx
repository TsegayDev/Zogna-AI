
'use client';

import * as React from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '../common/user-nav';
import type { AppUser } from '@/lib/types';
import { useAdminSidebar } from '@/context/sidebar-provider';
import { Link } from 'react-router-dom';

export default function AdminHeader() {
  const { isOpen, toggle } = useAdminSidebar();

  const mockUser: AppUser = {
    displayName: 'Admin User',
    email: 'admin@example.com',
    photoURL: 'https://placehold.co/100x100.png',
    plan: 'Unlimited',
    tokens: Infinity,
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-2 sm:px-4 backdrop-blur-sm flex-shrink-0">
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" onClick={toggle}>
          {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button asChild variant="outline">
            <Link to="/">Exit Admin</Link>
        </Button>
        <UserNav user={mockUser} onSignOut={() => alert('Signing out...')} />
      </div>
    </header>
  );
}
