import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  Send, 
  Pill, 
  Clock, 
  Bot,
  User,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  active: boolean;
  sideEffects?: string;
}

export function MedicationTracker() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I can help you track your medications. Are you taking any medications currently, or would you like to add a new one?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-01-15',
      active: true
    },
    {
      id: '2',
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Once daily',
      startDate: '2024-01-10',
      active: true
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    processUserInput(inputValue);
    setInputValue('');
  };

  const processUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('add') || lowerInput.includes('new') || lowerInput.includes('start')) {
      startAddingMedication();
    } else if (!isCollecting) {
      // Assume they're mentioning a medication name
      setCurrentMedication({ name: input });
      setIsCollecting(true);
      setCurrentQuestion('dosage');
      
      setTimeout(() => {
        addMessage(
          `Great! I'll help you add ${input} to your medication list. What's the dosage? (e.g., "500mg", "1 tablet", "5ml")`,
          'bot'
        );
      }, 1000);
    } else {
      handleMedicationCollection(input);
    }
  };

  const startAddingMedication = () => {
    setIsCollecting(true);
    setCurrentQuestion('name');
    setTimeout(() => {
      addMessage(
        'What medication would you like to add? Please tell me the name.',
        'bot'
      );
    }, 1000);
  };

  const handleMedicationCollection = (input: string) => {
    switch (currentQuestion) {
      case 'name':
        setCurrentMedication({ name: input });
        setCurrentQuestion('dosage');
        setTimeout(() => {
          addMessage(
            `Thanks! What's the dosage for ${input}? (e.g., "500mg", "1 tablet", "5ml")`,
            'bot'
          );
        }, 1000);
        break;
        
      case 'dosage':
        setCurrentMedication(prev => ({ ...prev, dosage: input }));
        setCurrentQuestion('frequency');
        setTimeout(() => {
          addMessage(
            'How often do you take this medication? (e.g., "once daily", "twice daily", "every 6 hours")',
            'bot'
          );
        }, 1000);
        break;
        
      case 'frequency':
        const finalMedication: Medication = {
          id: Date.now().toString(),
          name: currentMedication.name || '',
          dosage: currentMedication.dosage || '',
          frequency: input,
          startDate: new Date().toISOString().split('T')[0],
          active: true
        };
        
        setMedications(prev => [...prev, finalMedication]);
        
        setTimeout(() => {
          addMessage(
            `Perfect! I've added ${finalMedication.name} (${finalMedication.dosage}) to your medication list. You'll take it ${input}. Is there anything else you'd like to add?`,
            'bot'
          );
          
          // Check for interactions
          if (medications.length > 0) {
            setTimeout(() => {
              addMessage(
                'I notice you have other medications. Remember to discuss potential interactions with your healthcare provider.',
                'bot'
              );
            }, 2000);
          }
        }, 1000);
        
        // Reset for next medication
        setIsCollecting(false);
        setCurrentMedication({});
        setCurrentQuestion('');
        break;
    }
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id ? { ...med, active: !med.active } : med
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-primary" />
              <h2>Medication Tracker</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your medications and dosages
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={startAddingMedication}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Med
          </Button>
        </div>
      </div>

      {/* Current Medications */}
      {medications.length > 0 && (
        <div className="px-4 py-3 bg-muted/30">
          <h4 className="mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Your Medications ({medications.filter(m => m.active).length} active)
          </h4>
          <div className="space-y-2">
            {medications.map((med) => (
              <Card key={med.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${!med.active ? 'opacity-50' : ''}`}>
                        {med.name}
                      </h4>
                      <Badge variant={med.active ? "default" : "secondary"}>
                        {med.active ? 'Active' : 'Stopped'}
                      </Badge>
                    </div>
                    <p className={`text-xs text-muted-foreground ${!med.active ? 'opacity-50' : ''}`}>
                      {med.dosage} • {med.frequency}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={med.active}
                      onCheckedChange={() => toggleMedication(med.id)}
                    />
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {medications.some(m => m.active) && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Remember to take medications as prescribed and discuss any concerns with your doctor.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'user'
                ? 'chat-bubble-user ml-auto'
                : 'chat-bubble-app'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 py-2 bg-muted/30 border-t">
        <div className="flex gap-2 overflow-x-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => processUserInput('add new medication')}
            className="flex-shrink-0"
          >
            Add Medication
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addMessage('Show me all my active medications', 'user')}
            className="flex-shrink-0"
          >
            View Active
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => addMessage('I have side effects to report', 'user')}
            className="flex-shrink-0"
          >
            Report Side Effects
          </Button>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-card border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isCollecting
                ? 'Please answer the question above...'
                : 'Tell me about your medications...'
            }
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="px-3"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Medication data is stored securely on your device
        </p>
      </div>
    </div>
  );
}