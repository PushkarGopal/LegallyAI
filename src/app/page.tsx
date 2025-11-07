
'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AiRecommendationForm from '@/components/ai-recommendation-form';
import { LawyerCard } from '@/components/lawyer-card';
import { SearchBar } from '@/components/search-bar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bot, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Lawyer } from '@/lib/types';
import Link from 'next/link';
import AiLawSuggestForm from '@/components/ai-law-suggest-form';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  const firestore = useFirestore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const lawyersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = query(collection(firestore, 'lawyers'));
    if (selectedExpertise) {
      q = query(q, where('expertise', 'array-contains', selectedExpertise));
    }
    if (selectedLocation) {
      q = query(q, where('location', '==', selectedLocation));
    }
    return q;
  }, [firestore, selectedExpertise, selectedLocation]);

  const {
    data: lawyers,
    isLoading: lawyersLoading,
    error: lawyersError,
  } = useCollection<Lawyer>(lawyersQuery);
  
  const filteredLawyers = useMemo(() => {
    if (!lawyers) return [];
    if (!searchTerm) return lawyers;

    const lowercasedTerm = searchTerm.toLowerCase();
    return lawyers.filter(lawyer =>
      lawyer.name.toLowerCase().includes(lowercasedTerm) ||
      lawyer.firm.toLowerCase().includes(lowercasedTerm)
    );
  }, [lawyers, searchTerm]);


  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: 'AI-Assisted Recommendations',
      description: 'Our AI matches you with the perfect lawyer for your needs.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: 'Real-time Consultation',
      description: 'Connect instantly with lawyers via text or voice chat.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Secure Engagement',
      description: 'Finalize agreements and payments securely on our platform.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative w-full bg-secondary py-24 md:py-32">
        <div className="container mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
          <div className="flex flex-col items-start space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Smarter Legal Solutions, Simplified.
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              LegallyAI connects you with expert lawyers using the power of AI.
              Get instant recommendations, consult in real-time, and hire with
              confidence.
            </p>
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <a href="#find-lawyer">Find a Lawyer</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#for-lawyers">I am a Lawyer</a>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl md:h-96">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-28">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Why Choose LegallyAI?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We streamline the process of finding and hiring legal experts.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col items-center p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4 rounded-full bg-accent p-4">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="find-lawyer"
        className="w-full bg-secondary py-20 md:py-28 scroll-mt-20"
      >
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Get an AI-Powered Lawyer Recommendation
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Describe your legal needs, and our AI will find the best-matched
              lawyer from our network of experts.
            </p>
          </div>
          <AiRecommendationForm />
        </div>
      </section>

      <section
        id="suggest-law"
        className="w-full bg-background py-20 md:py-28 scroll-mt-20"
      >
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Understand Your Legal Standing
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Describe your legal dispute, and our AI will suggest relevant Indian laws that may apply to your case.
            </p>
          </div>
          <AiLawSuggestForm />
        </div>
      </section>

      <section className="py-20 md:py-28 bg-secondary">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Find Your Legal Expert
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Search for lawyers by name, expertise, or location.
            </p>
          </div>
          <SearchBar
            searchTerm={searchTerm}
            selectedExpertise={selectedExpertise}
            selectedLocation={selectedLocation}
            onSearchTermChange={setSearchTerm}
            onExpertiseChange={setSelectedExpertise}
            onLocationChange={setSelectedLocation}
          />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {lawyersLoading && (
              <div className="col-span-full flex justify-center items-center h-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            )}
            {!lawyersLoading && lawyersError && (
              <div className="col-span-full text-center text-red-500">
                Error loading lawyers. Please try again later.
              </div>
            )}
            {!lawyersLoading && !lawyersError && filteredLawyers?.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground">
                No lawyers found matching your criteria.
              </div>
            )}
            {filteredLawyers?.map(lawyer => (
              <LawyerCard key={lawyer.id} lawyer={lawyer} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="for-lawyers"
        className="w-full bg-primary text-primary-foreground py-20 md:py-28 scroll-mt-20"
      >
        <div className="container mx-auto max-w-screen-2xl px-4 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Network of Elite Lawyers
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
            Expand your practice, connect with new clients, and streamline your
            workflow on our modern platform.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Create Your Profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
