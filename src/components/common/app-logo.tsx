import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/divination" className="flex items-center gap-2 text-xl font-semibold text-primary hover:text-primary/90 transition-colors">
      <Sparkles className="h-7 w-7 text-accent" />
      <span className="text-foreground">FutureFlow</span>
    </Link>
  );
}
