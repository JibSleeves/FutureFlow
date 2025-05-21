
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenText, Wand2, Palette, BrainCog, PanelLeft, Library, Eye, Settings, Wallpaper, MessageSquareText, Bot } from 'lucide-react'; // Changed MessageCircle to MessageSquareText, Bot
import React, { useEffect, useState, useCallback } from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/common/app-logo';
import { cn } from '@/lib/utils';
import { handleGenerateWhisperAction } from '@/app/(app)/divination/actions'; 
import { LoadingSpinner } from '@/components/common/loading-spinner';

const navItems = [
  { href: '/divination', label: 'Peer into Fate', icon: Wand2 },
  { href: '/journal', label: 'Oracle\'s Chronicle', icon: BookOpenText },
  { href: '/sigils', label: 'Symbol Weaver', icon: Palette },
  { href: '/metaphysical-expert', label: 'Sage of Secrets', icon: BrainCog },
  { href: '/mystic-mentor', label: 'Arcane Guide', icon: Library },
  { href: '/illuminator', label: 'Veil Lifter', icon: Eye },
];

const WHISPER_INTERVAL = 75000; // 75 seconds
const MAX_WHISPERS_DISPLAYED = 3;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [whispers, setWhispers] = useState<string[]>([]);
  const [isWhisperLoading, setIsWhisperLoading] = useState(true);

  const fetchWhisper = useCallback(async () => {
    if(!isWhisperLoading) setIsWhisperLoading(true);
    try {
      const result = await handleGenerateWhisperAction({ timestamp: new Date().toISOString(), previousWhispers: whispers.slice(-5) });
      if (!('error' in result) && result.whisper) {
        setWhispers(prev => {
          const newWhispers = [...prev, result.whisper];
          return newWhispers.slice(-MAX_WHISPERS_DISPLAYED); 
        });
      }
    } catch (e) {
      console.warn("Error fetching whisper:", e);
    } finally {
      setIsWhisperLoading(false);
    }
  }, [whispers, isWhisperLoading]); // Added isWhisperLoading to dependencies

  useEffect(() => {
    fetchWhisper();
    const intervalId = setInterval(fetchWhisper, WHISPER_INTERVAL);
    return () => clearInterval(intervalId);
  }, []); // Removed fetchWhisper from dependency array to avoid re-triggering interval on whisper state change
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r-2 border-sidebar-border shadow-2xl bg-sidebar-background/80 backdrop-blur-sm">
        <SidebarHeader className="p-4 border-b-2 border-sidebar-border/70">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="bg-sidebar-background/30">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton 
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "bg-popover text-popover-foreground border-border shadow-lg rounded-md font-serif" }}
                    className={cn(
                      "justify-start font-serif text-base py-3.5 group rounded-lg mx-2 my-1 transition-all duration-200 ease-in-out transform hover:scale-[1.02]",
                      pathname === item.href ? 
                        "bg-primary/90 text-primary-foreground hover:bg-primary shadow-inner-deep ring-2 ring-ring/70" :
                        "hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground text-sidebar-foreground/80 hover:text-sidebar-foreground shadow-md hover:shadow-lg"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-hover:animate-pulse-glow", pathname === item.href ? "text-accent" : "text-primary/70 group-hover:text-accent")} />
                    <span className="tracking-wide">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <div className="p-4 border-t-2 border-sidebar-border/70 mt-auto bg-sidebar-background/50 text-xs">
            <h4 className="font-lora text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
              <MessageSquareText className="h-4 w-4 text-accent/80 animate-subtle-flicker" />
              Veiled Whispers:
            </h4>
            {isWhisperLoading && whispers.length === 0 && <LoadingSpinner size="sm" className="text-accent/60 mx-auto my-2"/>}
            <div className="space-y-2 text-muted-foreground/80 max-h-24 overflow-y-auto pr-1 font-serif italic">
              {whispers.map((whisper, index) => (
                <p key={index} className="opacity-80 hover:opacity-100 transition-opacity duration-300 animate-in fade-in slide-in-from-bottom-3 text-flicker">
                  "{whisper}"
                </p>
              ))}
              {whispers.length === 0 && !isWhisperLoading && <p className="opacity-60">The æther hums quietly...</p>}
            </div>
          </div>
      </Sidebar>
      <SidebarInset className="bg-background/95 backdrop-blur-sm">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-2 border-border/50 bg-background/80 backdrop-blur-md px-4 md:px-6 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger className="text-primary hover:text-accent rounded-md p-1.5 hover:bg-primary/10"/>
            </div>
            <div className="flex-1">
              {/* Page title could be dynamically inserted here */}
              <h2 className="font-lora text-xl text-primary/90 tracking-wider hidden md:block">
                {navItems.find(item => item.href === pathname)?.label || "FutureFlow Oracle"}
              </h2>
            </div>
          </div>
          
          <Link href="/settings" passHref legacyBehavior>
            <Button variant="ghost" size="icon" aria-label="Settings" className="text-primary hover:text-accent hover:bg-primary/10 rounded-full group">
              <Settings className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[120deg] group-hover:scale-110" />
            </Button>
          </Link>
        </header>
        <main className="flex-1 p-3 md:p-5 lg:p-6 overflow-y-auto h-[calc(100vh-4rem)]"> {/* Adjusted for header height */}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
