'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Loader2, Scale, AlertTriangle } from 'lucide-react';
import { suggestLaw } from '@/ai/flows/suggest-indian-law-flow';
import type { SuggestIndianLawOutput } from '@/ai/flows/suggest-indian-law-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from './ui/separator';

const formSchema = z.object({
  disputeDescription: z.string().min(20, { message: "Please describe your dispute in at least 20 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AiLawSuggestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestIndianLawOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeDescription: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await suggestLaw(values);
      setResult(response);
    } catch (e) {
      setError("An error occurred while getting suggestions. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start">
      <Card className="bg-background/50">
        <CardHeader>
          <CardTitle>Describe Your Dispute</CardTitle>
          <CardDescription>Provide details about your situation for the AI to analyze.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="disputeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 'My tenant has not paid rent for three months and is refusing to vacate the property...'" {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full !mt-8">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Bot className="mr-2 h-4 w-4" /> Get AI Suggestions</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="sticky top-24">
        {isLoading && !error && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <h3 className="font-headline text-xl font-semibold">Analyzing your dispute...</h3>
              <p className="text-muted-foreground">Our AI is searching through Indian law to find relevant information. This may take a moment.</p>
            </CardContent>
          </Card>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && !result && (
          <Card className="flex items-center justify-center min-h-[300px]">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4 pt-6">
              <Scale className="h-16 w-16 text-primary/50" />
              <h3 className="font-headline text-xl font-semibold text-muted-foreground">Relevant Laws Appear Here</h3>
              <p className="text-muted-foreground/80">Fill out the form to get started.</p>
            </CardContent>
          </Card>
        )}
        {result && (
          <Card className="bg-accent/10 border-accent animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">AI-Powered Legal Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index}>
                    <div className="font-semibold text-primary">{suggestion.law}{suggestion.section && `, Section ${suggestion.section}`}</div>
                    <p className="text-sm text-muted-foreground">{suggestion.explanation}</p>
                    {index < result.suggestions.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
              <Alert variant="destructive" className="bg-yellow-100/50 border-yellow-300 text-yellow-800">
                <AlertTriangle className="h-4 w-4 !text-yellow-800" />
                <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
                <AlertDescription>{result.disclaimer}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
