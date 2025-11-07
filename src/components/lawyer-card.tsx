import Image from 'next/image';
import Link from 'next/link';
import { Star, MessageSquare, Phone, ShieldCheck, Award } from 'lucide-react';
import type { Lawyer } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type LawyerCardProps = {
  lawyer: Lawyer;
  isRecommended?: boolean;
};

export function LawyerCard({ lawyer, isRecommended = false }: LawyerCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      {isRecommended && (
        <div className="flex items-center gap-2 bg-accent p-2 text-accent-foreground">
          <Award className="h-5 w-5" />
          <p className="text-sm font-semibold">AI Top Recommendation</p>
        </div>
      )}
       <Link href={`/lawyer/${lawyer.id}`} className="flex flex-col flex-grow">
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarImage src={lawyer.avatarUrl} alt={lawyer.name} />
            <AvatarFallback>{lawyer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="font-headline text-2xl">{lawyer.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">{lawyer.firm}</CardDescription>
            <div className="flex items-center pt-1">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-bold text-foreground">{lawyer.rating?.toFixed(1)}</span>
              <span className="ml-2 text-sm text-muted-foreground">({lawyer.reviews} reviews)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="flex flex-wrap gap-2">
            {lawyer.expertise?.map((exp) => (
              <Badge key={exp} variant="secondary">{exp}</Badge>))}
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground line-clamp-3">{lawyer.bio}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex-col items-stretch gap-2 bg-secondary/50 p-4">
        <div className="flex w-full gap-2">
          <Button className="w-full" variant="outline">
            <MessageSquare className="mr-2" /> Text Consult
          </Button>
          <Button className="w-full" variant="outline">
            <Phone className="mr-2" /> Voice Consult
          </Button>
        </div>
        <Button className="w-full" asChild>
           <Link href={`/lawyer/${lawyer.id}#engagement`}>
            <ShieldCheck className="mr-2" /> Engage Securely
           </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
