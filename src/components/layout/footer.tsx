import Link from 'next/link';
import { Gavel } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-secondary/50">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-2">
              <Gavel className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold text-primary">LegallyAI</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">The future of legal services is here.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
            <Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
            <Link href="/features" className="text-muted-foreground hover:text-primary">Features</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          <p className="mb-2">© {new Date().getFullYear()} LegallyAI. All rights reserved.</p>
          <p>Created by Pushkar Gopal</p>
        </div>
      </div>
    </footer>
  );
}
