
'use client';

import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart,
  Settings,
  LifeBuoy,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons';
import { useAdminSidebar } from '@/context/sidebar-provider';
import {
  SidebarPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

const mainNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

const secondaryNav = [
    { name: 'Help', href: '#', icon: LifeBuoy },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { isMobile, toggle, isOpen, setIsOpen } = useAdminSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      toggle();
    }
  };

  return (
    <SidebarPrimitive isOpen={isOpen} isMobile={isMobile} setIsOpen={setIsOpen}>
      <SidebarHeader className="p-0">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-brand-blue to-brand-purple rounded-lg">
                <Logo className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-headline text-foreground/90 whitespace-nowrap">
                  Admin Panel
                </h1>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={toggle}
            >
              <X />
            </Button>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col p-2">
        <nav className="grid gap-1">
          {mainNav.map((item) => (
            <Link key={item.name} to={item.href} onClick={handleLinkClick}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <nav className="grid gap-1">
            {secondaryNav.map((item) => (
                <Link key={item.name} to={item.href}>
                    <Button variant="ghost" className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                    </Button>
                </Link>
            ))}
        </nav>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
