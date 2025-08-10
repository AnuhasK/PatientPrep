import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Fingerprint,
  AlertCircle,
  Loader2,
  CheckCircle,
  User
} from 'lucide-react';

interface SignupProps {
  onSignup: () => void;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!agreedToTerms) {
      setError('Please accept the Privacy Policy and Terms of Service');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful signup
      setSuccess('Account created successfully!');
      localStorage.setItem('patientprep_user', JSON.stringify({ 
        email, 
        signupTime: Date.now(),
        biometricEnabled: false 
      }));
      
      // Show biometric setup
      setShowBiometricSetup(true);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.setItem('patientprep_user', JSON.stringify({ 
        email: 'user@gmail.com', 
        provider: 'google', 
        signupTime: Date.now(),
        biometricEnabled: false
      }));
      setShowBiometricSetup(true);
    } catch (err) {
      setError('Google signup failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleBiometricSetup = async (enable: boolean) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (enable) {
        const userData = JSON.parse(localStorage.getItem('patientprep_user') || '{}');
        userData.biometricEnabled = true;
        localStorage.setItem('patientprep_user', JSON.stringify(userData));
      }
      
      onSignup();
    } catch (err) {
      // Continue anyway
      onSignup();
    }
  };

  if (showBiometricSetup) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
        <div className="max-w-sm mx-auto w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Fingerprint className="w-10 h-10 text-primary" />
          </div>
          
          <h2 className="mb-4">Enable Biometric Login</h2>
          <p className="text-muted-foreground mb-8">
            Would you like to use Touch ID, Face ID, or Fingerprint to quickly and securely access your account?
          </p>

          <Card className="border-border/50 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Secure & Convenient</p>
                    <p className="text-sm text-muted-foreground">
                      Your biometric data stays on your device
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => handleBiometricSetup(true)}
                    className="w-full h-12 touch-target"
                  >
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Enable Biometric Login
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleBiometricSetup(false)}
                    className="w-full h-12 touch-target"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            You can enable or disable this feature anytime in your profile settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-6 py-8">
      <div className="max-w-sm mx-auto w-full">
        {/* App Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="mb-2">PatientPrep SL</h1>
          <h2 className="text-primary mb-4">Create Your Account</h2>
          <p className="text-muted-foreground">
            Join thousands of patients preparing better for healthcare visits
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

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Signup Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <h3 className="text-center">Sign Up</h3>
            <p className="text-sm text-muted-foreground text-center">
              Create your secure healthcare companion account
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 bg-input-background border-border focus:border-primary focus:ring-primary touch-target"
                    autoComplete="email"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min. 6 characters)"
                    className="pl-10 pr-12 h-12 bg-input-background border-border focus:border-primary focus:ring-primary touch-target"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="pl-10 pr-12 h-12 bg-input-background border-border focus:border-primary focus:ring-primary touch-target"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Button variant="link" className="p-0 h-auto text-primary underline text-sm">
                        Privacy Policy
                      </Button>{' '}
                      and{' '}
                      <Button variant="link" className="p-0 h-auto text-primary underline text-sm">
                        Terms of Service
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-700">
                      <strong>Medical Disclaimer:</strong> This app is for preparation purposes only. 
                      Always consult qualified healthcare professionals for medical advice.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full h-12 touch-target"
                disabled={isLoading || !email || !password || !confirmPassword || !agreedToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignup}
              className="w-full h-12 touch-target border-border hover:border-primary"
              disabled={isLoading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285f4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34a853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#fbbc05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#ea4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Reminder */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>Your health data stays private on your device</span>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              disabled={isLoading}
            >
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}