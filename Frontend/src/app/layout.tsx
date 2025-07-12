
"use client";

import './globals.css';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {BottomNav} from '@/components/bottom-nav';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { SearchContextProvider, useSearch } from '@/contexts/search-context';
import { MainNav } from '@/components/main-nav';
import { AuthProvider } from '@/contexts/AuthContext';


function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSearchFocused } = useSearch();

  return (
    <div className="relative flex flex-col flex-1">
      <MainNav />
      <main className={cn("flex-grow transition-all duration-300", isSearchFocused ? "blur-sm" : "blur-none")}>
        {children}
      </main>
       {isSearchFocused && (
          <div 
              className="absolute inset-0 z-40 bg-background/80"
              onClick={() => document.querySelector<HTMLInputElement>('input[placeholder="Search..."]')?.blur()}
          />
      )}
      <Toaster />
      <BottomNav />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SearchContextProvider>
              <AppLayout>{children}</AppLayout>
            </SearchContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
