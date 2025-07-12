
"use client";
import Link from 'next/link';
import {Menu, Mountain, Search, LogOut, LayoutDashboard, Settings} from 'lucide-react';
import {ThemeToggle} from '@/components/theme-toggle';
import {Button} from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';
import {Input} from '@/components/ui/input';
import * as React from 'react';
import { useSearch } from '@/contexts/search-context';
import { useToast } from '@/hooks/use-toast';

const navLinks: { href: string; label: string }[] = [];

export function MainNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const { setIsSearchFocused } = useSearch();

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, you'd also redirect the user, e.g., router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Mountain className="h-6 w-6" />
            <span className="text-lg font-headline">ReWear</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div
            className="group relative w-full max-w-md"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            >
            <div className="mica-search-bar flex items-center rounded-full group-focus-within:scale-105 group-focus-within:shadow-xl group-focus-within:ring-2 group-focus-within:ring-primary/50">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-transform duration-300 group-focus-within:scale-110" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 bg-transparent border-none rounded-full focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
                />
            </div>
          </div>
        </div>


        {/* Desktop Actions & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
           <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://placehold.co/32x32.png" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">User Profile</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
            )}
           </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-bold">
                      <Mountain className="h-6 w-6" />
                      <span>ReWear</span>
                    </Link>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through the application pages.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <nav className="grid gap-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent',
                            pathname === link.href
                              ? 'bg-accent text-accent-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    {isLoggedIn ? (
                      <SheetClose asChild>
                         <Button variant="ghost" className="justify-start px-3 py-2" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                      </SheetClose>
                    ) : (
                     <SheetClose asChild>
                        <Link
                          href="/login"
                          className='block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-muted-foreground'
                        >
                          Login
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
