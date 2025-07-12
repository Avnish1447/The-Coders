import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {LoginForm} from './login-form';

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
