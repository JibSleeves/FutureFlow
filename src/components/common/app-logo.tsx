import { Gem } from 'lucide-react'; 
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/divination" className="flex items-center gap-2.5 text-2xl font-bold text-primary hover:text-primary/90 transition-colors group">
      <Gem className="h-8 w-8 text-accent group-hover:animate-pulse-glow transform transition-transform duration-300 group-hover:scale-110" />
      <span className="text-foreground tracking-wider" style={{ fontFamily: 'var(--font-lora)'}}>FutureFlow</span>
    </Link>
  );
}
