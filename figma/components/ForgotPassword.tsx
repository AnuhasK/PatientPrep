import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Heart, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="mb-4">Check Your Email</h2>
          <p className="text-muted-foreground mb-8">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>

          <Card className="border-border/50 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Alert className="border-primary/20 bg-primary/5">
                  <Mail className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary">
                    Password reset link sent successfully! Check your email and follow the instructions.
                  </AlertDescription>
                </Alert>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• Check your spam/junk folder if you don't see the email</p>
                  <p>• The reset link will expire in 24 hours</p>
                  <p>• Contact support if you need additional help</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="w-full h-12 touch-target"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
      <div className="max-w-sm mx-auto w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBackToLogin}
          className="mb-6 p-0 h-auto text-primary hover:text-primary/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>

        {/* App Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Reset Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <h3 className="text-center">Forgot Password</h3>
            <p className="text-sm text-muted-foreground text-center">
              We'll help you get back into your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetRequest} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="reset-email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10 h-12 bg-input-background border-border focus:border-primary focus:ring-primary touch-target"
                    autoComplete="email"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Reset Button */}
              <Button
                type="submit"
                className="w-full h-12 touch-target"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Need help?</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Make sure you're using the same email you signed up with</p>
                <p>• Check your spam folder for the reset email</p>
                <p>• If you still can't access your account, contact our support team</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Your account security is important to us. The reset link will expire in 24 hours for your protection.
          </p>
        </div>
      </div>
    </div>
  );
}