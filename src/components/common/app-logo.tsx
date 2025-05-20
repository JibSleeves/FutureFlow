import { Sparkles, Gem } from 'lucide-react'; // Using Gem for a more antique feel
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/divination" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
      <Gem className="h-7 w-7 text-accent animate-pulse" /> {/* Accent color for the gem, pulsing light */}
      <span className="text-foreground" style={{ fontFamily: 'var(--font-lora)'}}>FutureFlow</span>
    </Link>
  );
}
