import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, User } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-headline">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <div className="flex items-center gap-4">
            <User className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-muted-foreground">Pushkar Gopal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Phone Number</p>
              <p className="text-muted-foreground">+91 8100705705</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">E-mail</p>
              <p className="text-muted-foreground">24210077@iitgn.ac.in</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-muted-foreground">IIT Gandhinagar, Palaj, Gandhinagar, India, 382055.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
