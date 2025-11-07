import Link from 'next/link';
import { Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Gavel className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">LegallyAI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#find-lawyer" className="text-muted-foreground transition-colors hover:text-primary">
            Find a Lawyer
          </Link>
          <Link href="#for-lawyers" className="text-muted-foreground transition-colors hover:text-primary">
            For Lawyers
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
