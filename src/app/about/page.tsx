import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-headline">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg text-center">
          <p className="text-muted-foreground pt-4">
            I am Pushkar Gopal and this is my submission for the application of Product Designer at Smartsense Consulting Solutions Pvt Ltd.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
