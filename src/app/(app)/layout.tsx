
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpenText, Wand2, Palette, BrainCog, PanelLeft, Library } from 'lucide-react'; // Added Library icon
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

const navItems = [
  { href: '/divination', label: 'AI Divination', icon: Wand2 },
  { href: '/journal', label: 'Future Journal', icon: BookOpenText },
  { href: '/sigils', label: 'Sigil Generator', icon: Palette },
  { href: '/metaphysical-expert', label: 'Meta-Physical Expert', icon: BrainCog },
  { href: '/mystic-mentor', label: 'Mystic Mentor', icon: Library }, // New nav item
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton 
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "bg-popover text-popover-foreground border-border" }}
                    className={cn(
                      "justify-start",
                      pathname === item.href ? 
                        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" :
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
          <div className="flex-1">
            {/* Optional: Breadcrumbs or page title here */}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

