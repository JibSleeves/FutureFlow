
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenText, Wand2, Palette, BrainCog, PanelLeft, Library, Eye, Settings, Wallpaper, MessageCircle } from 'lucide-react';
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
import { handleGenerateWhisperAction } from '@/app/(app)/divination/actions'; // Assuming whisper action is here
import { LoadingSpinner } from '@/components/common/loading-spinner';

const navItems = [
  { href: '/divination', label: 'Peer into Fate', icon: Wand2 },
  { href: '/journal', label: 'Oracle\'s Chronicle', icon: BookOpenText },
  { href: '/sigils', label: 'Symbol Weaver', icon: Palette },
  { href: '/metaphysical-expert', label: 'Sage of Secrets', icon: BrainCog },
  { href: '/mystic-mentor', label: 'Arcane Guide', icon: Library },
  { href: '/illuminator', label: 'Veil Lifter', icon: Eye },
];

const WHISPER_INTERVAL = 90000; // 90 seconds
const MAX_WHISPERS_DISPLAYED = 3;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [whispers, setWhispers] = useState<string[]>([]);
  const [isWhisperLoading, setIsWhisperLoading] = useState(false);

  const fetchWhisper = useCallback(async () => {
    setIsWhisperLoading(true);
    try {
      const result = await handleGenerateWhisperAction({ timestamp: new Date().toISOString(), previousWhispers: whispers.slice(-5) });
      if (!('error' in result) && result.whisper) {
        setWhispers(prev => {
          const newWhispers = [...prev, result.whisper];
          return newWhispers.slice(-MAX_WHISPERS_DISPLAYED); // Keep only the last N whispers
        });
      }
    } catch (e) {
      console.warn("Error fetching whisper:", e);
    } finally {
      setIsWhisperLoading(false);
    }
  }, [whispers]);

  useEffect(() => {
    // Fetch initial whisper
    fetchWhisper();
    // Then fetch periodically
    const intervalId = setInterval(fetchWhisper, WHISPER_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchWhisper]);
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r-2 border-sidebar-border shadow-2xl">
        <SidebarHeader className="p-4 border-b-2 border-sidebar-border">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="bg-sidebar-background/50">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton 
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "bg-popover text-popover-foreground border-border shadow-lg" }}
                    className={cn(
                      "justify-start font-serif text-base py-3 group",
                      pathname === item.href ? 
                        "bg-primary/80 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground shadow-inner" :
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", pathname === item.href ? "text-accent" : "text-primary/70 group-hover:text-primary")} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <div className="p-3 border-t-2 border-sidebar-border mt-auto bg-sidebar-background/70">
            <h4 className="text-xs font-serif text-muted-foreground mb-2 flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-accent/70"/>
              Whispers from the Veil:
            </h4>
            {isWhisperLoading && whispers.length === 0 && <LoadingSpinner size="sm" className="text-accent/50"/>}
            <div className="space-y-1.5 text-xs italic text-primary/70 max-h-20 overflow-y-auto pr-1">
              {whispers.map((whisper, index) => (
                <p key={index} className="opacity-75 hover:opacity-100 transition-opacity duration-300 animate-in fade-in slide-in-from-bottom-2">
                  "{whisper}"
                </p>
              ))}
              {whispers.length === 0 && !isWhisperLoading && <p className="opacity-50">The machine hums quietly...</p>}
            </div>
          </div>
      </Sidebar>
      <SidebarInset className="bg-background/90 backdrop-blur-sm">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b-2 border-border bg-background/70 backdrop-blur-md px-4 md:px-6 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger className="text-primary hover:text-accent"/>
            </div>
            <div className="flex-1">
              {/* Could add breadcrumbs or page title here later, styled thematically */}
            </div>
          </div>
          
          <Link href="/settings" passHref legacyBehavior>
            <Button variant="ghost" size="icon" aria-label="Settings" className="text-primary hover:text-accent hover:bg-primary/10 rounded-full animate-spin-slow group">
              <Settings className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
            </Button>
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    
