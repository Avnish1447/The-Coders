import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {ContactForm} from './contact-form';

export default function ContactPage() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Contact Us</CardTitle>
          <CardDescription>
            Have a question or want to work with us? Fill out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
