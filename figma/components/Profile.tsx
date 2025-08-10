import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  Shield, 
  Download, 
  Trash2, 
  Lock, 
  Globe, 
  Moon, 
  Sun,
  FileText,
  Info,
  Settings,
  Database,
  Eye,
  Smartphone
} from 'lucide-react';

interface ProfileProps {
  onLogout?: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLock, setBiometricLock] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  const dataStats = {
    symptoms: 12,
    medications: 3,
    questions: 8,
    appointments: 2,
    totalSize: '2.4 KB'
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-primary" />
          </div>
          <CardTitle>Welcome Back!</CardTitle>
          <p className="text-muted-foreground">
            PatientPrep SL User
          </p>
          <Badge variant="outline" className="w-fit mx-auto mt-2">
            <Shield className="w-3 h-3 mr-1" />
            Privacy Protected
          </Badge>
        </CardHeader>
      </Card>

      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Your Health Data
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            All data is stored securely on your device
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataStats.symptoms}</div>
              <div className="text-sm text-muted-foreground">Symptoms</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataStats.medications}</div>
              <div className="text-sm text-muted-foreground">Medications</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataStats.questions}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dataStats.appointments}</div>
              <div className="text-sm text-muted-foreground">Appointments</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              <span className="text-sm">Total Storage Used</span>
            </div>
            <Badge variant="outline">{dataStats.totalSize}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium">Biometric Lock</p>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint/face to access app
                </p>
              </div>
            </div>
            <Switch
              checked={biometricLock}
              onCheckedChange={setBiometricLock}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Auto-lock after 5 minutes of inactivity
                </p>
              </div>
            </div>
            <Badge variant="outline">5 min</Badge>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Your privacy is protected
                </p>
                <p className="text-xs text-green-700">
                  All health data is encrypted and stored only on this device. 
                  We never share your personal health information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            App Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-4 h-4 text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-primary" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch to dark theme
                </p>
              </div>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  App language preference
                </p>
              </div>
            </div>
            <Badge variant="outline">English</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              // Export data functionality
              console.log('Exporting data...');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Data (PDF)
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              // Backup functionality
              console.log('Creating backup...');
            }}
          >
            <Database className="w-4 h-4 mr-2" />
            Create Backup File
          </Button>

          <Separator />

          <Button 
            variant="destructive" 
            className="w-full justify-start"
            onClick={() => {
              if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
                console.log('Deleting all data...');
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete All Data
          </Button>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                Data export creates a PDF summary of your health information 
                that you can print or share with healthcare providers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version</span>
            <Badge variant="outline">1.0.0</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Storage Location</span>
            <Badge variant="outline">Local Device</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Compliance</span>
            <Badge variant="outline">PDPA Sri Lanka</Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              Terms of Service
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              Contact Support
            </Button>
            {onLogout && (
              <>
                <Separator className="my-4" />
                <Button 
                  variant="outline"
                  onClick={onLogout}
                  className="w-full justify-start text-sm hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>PatientPrep SL - Healthcare Companion</p>
        <p>Built for patients in Sri Lanka with privacy in mind</p>
      </div>
    </div>
  );
}