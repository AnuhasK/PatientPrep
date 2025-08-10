import { ReactNode } from 'react';
import { 
  Home, 
  MessageSquare, 
  Pill, 
  HelpCircle, 
  Calendar, 
  User,
  Shield 
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export function Navigation({ activeTab, onTabChange, children }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'symptoms', label: 'Symptoms', icon: MessageSquare },
    { id: 'medications', label: 'Meds', icon: Pill },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'appointments', label: 'Visits', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Privacy reminder banner */}
      <div className="bg-secondary/30 px-4 py-2 border-t border-border/50">
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <Shield className="w-3 h-3 mr-1 text-primary" />
          Your data stays secure on this device
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="bg-card border-t border-border px-2 py-2 safe-area-pb">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors touch-target ${
                  isActive
                    ? 'text-primary bg-secondary/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}