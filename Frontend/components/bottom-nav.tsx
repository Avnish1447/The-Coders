
'use client';

import Link from 'next/link';
import { Compass, Home, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/dashboard', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  // TODO: Replace this with a real authentication context
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-2 md:hidden">
      <nav className="flex justify-around">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link href={link.href} key={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  'flex h-auto flex-col items-center justify-center gap-1 p-2',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.href === '/dashboard' && isLoggedIn ? (
                  <Avatar className={cn(
                    "h-6 w-6 border-2",
                    isActive ? "border-primary" : "border-transparent"
                  )}>
                    <AvatarImage src="https://placehold.co/32x32.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ) : (
                  link.icon && <link.icon className="h-6 w-6" />
                )}
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
