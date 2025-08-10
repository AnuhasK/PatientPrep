import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ForgotPassword } from './components/ForgotPassword';
import { HomePage } from './components/HomePage';
import { SymptomLogger } from './components/SymptomLogger';
import { MedicationTracker } from './components/MedicationTracker';
import { QuestionBuilder } from './components/QuestionBuilder';
import { Profile } from './components/Profile';
import { Card, CardContent } from './components/ui/card';
import { Calendar, Clock, User, FileText } from 'lucide-react';

type AuthState = 'login' | 'signup' | 'forgot-password';
type AppState = 'auth' | 'onboarding' | 'main';

export default function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [authState, setAuthState] = useState<AuthState>('login');
  const [activeTab, setActiveTab] = useState('home');

  // Check authentication status on app load
  useEffect(() => {
    const user = localStorage.getItem('patientprep_user');
    const hasOnboarded = localStorage.getItem('patientprep_onboarded');
    
    if (user) {
      if (hasOnboarded === 'true') {
        setAppState('main');
      } else {
        setAppState('onboarding');
      }
    } else {
      setAppState('auth');
    }
  }, []);

  const handleLogin = () => {
    const hasOnboarded = localStorage.getItem('patientprep_onboarded');
    if (hasOnboarded === 'true') {
      setAppState('main');
    } else {
      setAppState('onboarding');
    }
  };

  const handleSignup = () => {
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('patientprep_onboarded', 'true');
    setAppState('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('patientprep_user');
    setAppState('auth');
    setAuthState('login');
    setActiveTab('home');
  };

  // Simple placeholder component for appointments
  const AppointmentPlanner = () => (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2>Appointment Planner</h2>
        <p className="text-muted-foreground">
          Keep track of your medical appointments and prepare for each visit
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4>Dr. Silva - Cardiology</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Tomorrow at 2:00 PM
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">Ready to prepare</p>
                <p className="text-xs text-muted-foreground">3 questions saved</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center py-8">
        <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
        <h4 className="mb-2">Preparation Checklist</h4>
        <p className="text-muted-foreground mb-4">
          Make sure you're ready for your next appointment
        </p>
        <div className="space-y-2 text-left max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm">Review recent symptoms</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm">Update medication list</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/30"></div>
            <span className="text-sm">Prepare questions</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-muted-foreground/30"></div>
            <span className="text-sm">Bring required documents</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'symptoms':
        return <SymptomLogger />;
      case 'medications':
        return <MedicationTracker />;
      case 'questions':
        return <QuestionBuilder />;
      case 'appointments':
        return <AppointmentPlanner />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  // Render authentication screens
  if (appState === 'auth') {
    switch (authState) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthState('signup')}
            onForgotPassword={() => setAuthState('forgot-password')}
          />
        );
      case 'signup':
        return (
          <Signup
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthState('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onBackToLogin={() => setAuthState('login')}
          />
        );
    }
  }

  // Render onboarding
  if (appState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Render main app
  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab}>
        {renderActiveTab()}
      </Navigation>
    </div>
  );
}