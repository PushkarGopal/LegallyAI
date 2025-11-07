'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Lawyer } from '@/lib/types';
import {
  Award,
  BadgeCheck,
  Briefcase,
  Calendar,
  ChevronRight,
  ClipboardList,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function LawyerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const lawyerRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'lawyers', id) : null),
    [firestore, id]
  );
  const {
    data: lawyer,
    isLoading,
    error,
  } = useDoc<Lawyer>(lawyerRef);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-8 w-48 mt-4" />
                <Skeleton className="h-6 w-32 mt-2" />
                <Skeleton className="h-10 w-full mt-6" />
                <Skeleton className="h-10 w-full mt-2" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-12 text-red-500">
        Error loading lawyer profile. Please try again.
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container text-center py-12 text-muted-foreground">
        Lawyer not found.
      </div>
    );
  }

  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto max-w-screen-xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6 sticky top-24">
            <Card className="overflow-hidden">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={lawyer.avatarUrl} alt={lawyer.name} />
                  <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="font-headline text-3xl font-bold mt-4">
                  {lawyer.name}
                </h1>
                <p className="text-muted-foreground text-lg">{lawyer.firm}</p>
                <div className="flex items-center pt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1.5 font-bold text-lg text-foreground">
                    {lawyer.rating.toFixed(1)}
                  </span>
                  <span className="ml-2 text-base text-muted-foreground">
                    ({lawyer.reviews} reviews)
                  </span>
                </div>
              </CardContent>
              <div className="bg-background/50 p-4 space-y-2">
                <Button className="w-full" size="lg">
                  <MessageSquare className="mr-2" /> Text Consult
                </Button>
                <Button className="w-full" size="lg" variant="outline">
                  <Phone className="mr-2" /> Voice Consult
                </Button>
              </div>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{`Email is private until engagement`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{lawyer.location}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About {lawyer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {lawyer.bio}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {lawyer.expertise.map(exp => (
                  <Badge key={exp} variant="secondary" className="text-base px-3 py-1">
                    {exp}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card id="engagement">
              <CardHeader>
                <CardTitle>Start an Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ready to work with {lawyer.name}? Securely start a formal engagement to handle your legal needs.
                </p>
                <Button size="lg" className="w-full">
                  <ShieldCheck className="mr-2" /> Engage Securely
                </Button>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className='flex items-center'><BadgeCheck className="mr-2 h-4 w-4 text-green-500" /> Secure document sharing</li>
                    <li className='flex items-center'><BadgeCheck className="mr-2 h-4 w-4 text-green-500" /> Private communication channel</li>
                    <li className='flex items-center'><BadgeCheck className="mr-2 h-4 w-4 text-green-500" /> Milestone tracking and payments</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
