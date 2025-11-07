
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2 } from 'lucide-react';
import { recommendLawyer } from '@/ai/flows/ai-assisted-lawyer-recommendation';
import type { AIAssistedLawyerRecommendationOutput } from '@/ai/flows/ai-assisted-lawyer-recommendation';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import type { Lawyer } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LawyerCard } from './lawyer-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const industries = ["Technology", "Healthcare", "Finance", "Real Estate", "Retail", "Manufacturing", "Other"];

const formSchema = z.object({
  legalNeeds: z.string().min(10, { message: "Please describe your legal needs in at least 10 characters." }),
  industry: z.string().min(1, { message: "Please select your industry." }),
  otherRelevantFactors: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AiRecommendationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIAssistedLawyerRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();

  const isPlaceholderRecommendation = recommendation?.lawyerName === 'No Specific Expert Found';

  const lawyerQuery = useMemoFirebase(
    () => (firestore && recommendation?.lawyerName && !isPlaceholderRecommendation ? query(collection(firestore, 'lawyers'), where('name', '==', recommendation.lawyerName)) : null),
    [firestore, recommendation?.lawyerName, isPlaceholderRecommendation]
  );
  
  const { data: recommendedLawyerData, isLoading: isLawyerLoading } = useCollection<Lawyer>(lawyerQuery);
  const recommendedLawyerProfile = recommendedLawyerData?.[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalNeeds: "",
      industry: "",
      otherRelevantFactors: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    setError(null);
    try {
      const result = await recommendLawyer(values);
      setRecommendation(result);
    } catch (e) {
      setError("An error occurred while getting your recommendation. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
      <Card className="bg-background/50">
        <CardHeader>
          <CardTitle>Describe Your Case</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="legalNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Needs</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'I need to draft a partnership agreement for my tech startup.'" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherRelevantFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Factors (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Budget constraints, timeline'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full !mt-8">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting Recommendation...</>
                ) : (
                  <><Bot className="mr-2 h-4 w-4" /> Get AI Recommendation</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="sticky top-24">
        {(isLoading || isLawyerLoading) && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <h3 className="font-headline text-xl font-semibold">Analyzing your needs...</h3>
              <p className="text-muted-foreground">Our AI is finding the best lawyer for you. This may take a moment.</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !isLawyerLoading && !error && !recommendation && (
          <Card className="flex items-center justify-center min-h-[300px]">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
              <Bot className="h-16 w-16 text-primary/50" />
              <h3 className="font-headline text-xl font-semibold text-muted-foreground">Your Recommendation Appears Here</h3>
              <p className="text-muted-foreground/80">Fill out the form to get started.</p>
            </CardContent>
          </Card>
        )}
        {recommendation && (
          <Card className="bg-accent/10 border-accent animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">AI-Powered Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-background">
                <Bot className="h-4 w-4" />
                <AlertTitle className="font-semibold">{isPlaceholderRecommendation ? "Suggestion" : "Why this lawyer?"}</AlertTitle>
                <AlertDescription>{recommendation.summary}</AlertDescription>
              </Alert>
              {!isPlaceholderRecommendation && recommendedLawyerProfile && <LawyerCard lawyer={recommendedLawyerProfile} isRecommended />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
