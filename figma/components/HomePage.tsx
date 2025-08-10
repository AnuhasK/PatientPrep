import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Pill, 
  Calendar, 
  MessageSquare, 
  HelpCircle,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  // Mock data - in real app this would come from local storage
  const recentSymptoms = [
    { id: 1, symptom: 'Headache', severity: 6, date: '2 hours ago' },
    { id: 2, symptom: 'Fatigue', severity: 4, date: 'Yesterday' }
  ];

  const currentMedications = [
    { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily' },
    { id: 2, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily' }
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Silva', date: 'Tomorrow 2:00 PM', type: 'Follow-up' }
  ];

  const aiNudges = [
    {
      id: 1,
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Have you taken your evening Paracetamol? It\'s been 8 hours since your last dose.',
      icon: Pill,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 2,
      type: 'preparation',
      title: 'Appointment Prep',
      message: 'Your appointment with Dr. Silva is tomorrow. Consider reviewing your recent symptoms.',
      icon: Calendar,
      color: 'text-green-600 bg-green-50'
    }
  ];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome header */}
      <div className="text-center mb-6">
        <h1 className="mb-2">Good Evening! 👋</h1>
        <p className="text-muted-foreground">
          Ready to prepare for better healthcare conversations?
        </p>
      </div>

      {/* AI Nudges */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Gentle Reminders
        </h3>
        {aiNudges.map((nudge) => {
          const Icon = nudge.icon;
          return (
            <Card key={nudge.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${nudge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-1">{nudge.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {nudge.message}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4>{recentSymptoms.length}</h4>
            <p className="text-sm text-muted-foreground">Recent Symptoms</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Pill className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4>{currentMedications.length}</h4>
            <p className="text-sm text-muted-foreground">Active Meds</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3>Recent Activity</h3>
        
        {/* Recent Symptoms */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Latest Symptoms
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('symptoms')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSymptoms.length > 0 ? (
              <div className="space-y-3">
                {recentSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center justify-between">
                    <div>
                      <p>{symptom.symptom}</p>
                      <p className="text-sm text-muted-foreground">
                        Severity: {symptom.severity}/10 • {symptom.date}
                      </p>
                    </div>
                    <Badge 
                      variant={symptom.severity > 6 ? "destructive" : symptom.severity > 3 ? "default" : "secondary"}
                    >
                      {symptom.severity}/10
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No symptoms logged yet</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('symptoms')}
                  className="mt-2"
                >
                  Start tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-primary" />
                Current Medications
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('medications')}
              >
                Manage
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentMedications.length > 0 ? (
              <div className="space-y-3">
                {currentMedications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between">
                    <div>
                      <p>{med.name} - {med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Pill className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No medications added</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('medications')}
                  className="mt-2"
                >
                  Add medications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Upcoming Visits
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('appointments')}
              >
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between">
                    <div>
                      <p>{apt.doctor}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} • {apt.type}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Prepare
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground">No appointments scheduled</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('appointments')}
                  className="mt-2"
                >
                  Add appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button 
          className="h-auto p-4 flex flex-col items-center space-y-2"
          onClick={() => onNavigate('symptoms')}
        >
          <MessageSquare className="w-6 h-6" />
          <span>Log Symptoms</span>
        </Button>
        <Button 
          variant="outline"
          className="h-auto p-4 flex flex-col items-center space-y-2"
          onClick={() => onNavigate('questions')}
        >
          <HelpCircle className="w-6 h-6" />
          <span>Ask Questions</span>
        </Button>
      </div>
    </div>
  );
}