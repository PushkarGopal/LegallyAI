import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, ShieldCheck, Briefcase, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Lawyer Matching',
    description: 'Describe your legal needs, and our advanced AI algorithm will analyze your case to recommend the most qualified lawyer from our vetted network. We save you time by connecting you with experts who have the right experience for your specific situation.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Browse & Filter Detailed Profiles',
    description: 'Take control of your search. Our extensive directory allows you to browse detailed lawyer profiles, filter by area of expertise, location, and user ratings to find the perfect legal professional on your own terms.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Direct & Secure Communication',
    description: 'Once you connect with a lawyer, our platform provides a secure and private channel for all your communications. Ask questions, share documents, and discuss your case with confidence and privacy.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Streamlined Engagement Process',
    description: 'Ready to move forward? Our platform simplifies the formal engagement process. Securely manage agreements, track milestones, and handle payments all in one place for a transparent and hassle-free experience.',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-secondary/50">
      <div className="container mx-auto max-w-screen-xl px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Our Services
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            We offer a suite of services designed to make finding and working with legal professionals simple, transparent, and efficient.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col text-center items-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-5 rounded-full bg-accent/20 p-4">
                {service.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="font-headline text-3xl font-bold text-primary">Ready to Get Started?</h2>
          <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
            Find the right legal expert for your needs today.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/#find-lawyer">
              Find a Lawyer <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
