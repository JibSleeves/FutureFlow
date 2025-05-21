import { Gem } from 'lucide-react'; 
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AppLogo() {
  return (
    <Link href="/divination" className="flex items-center gap-2.5 text-2xl font-bold text-primary hover:text-primary/90 transition-colors group">
      <Gem className="h-8 w-8 text-accent group-hover:animate-pulse-glow transform transition-transform duration-300 group-hover:scale-110" />
      <span 
        className={cn(
          "text-foreground tracking-wider animate-psi-glow", 
          "group-hover:animate-psi-glow-hover" // Optional: slightly intensified glow on hover
        )} 
        style={{ fontFamily: 'var(--font-lora)' }}
      >
        Psi-Qux
      </span>
    </Link>
  );
}
