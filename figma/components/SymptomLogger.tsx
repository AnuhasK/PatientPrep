import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  TrendingUp,
  Bot,
  User,
  CheckCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface SymptomData {
  symptom: string;
  severity: number;
  duration: string;
  triggers: string;
  onset: string;
}

export function SymptomLogger() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you track your symptoms. What are you experiencing today?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState<Partial<SymptomData>>({});
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [severity, setSeverity] = useState([5]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (!isCollecting) {
      // Start symptom collection
      setCurrentSymptom({ symptom: input });
      setIsCollecting(true);
      setCurrentQuestion('severity');
      
      setTimeout(() => {
        addMessage(
          `I understand you're experiencing ${input}. On a scale of 1-10, how severe would you rate this symptom? Use the slider below.`,
          'bot'
        );
      }, 1000);
    } else {
      // Continue collecting based on current question
      handleSymptomCollection(input);
    }
  };

  const handleSymptomCollection = (input: string) => {
    switch (currentQuestion) {
      case 'severity':
        setCurrentSymptom(prev => ({ ...prev, severity: severity[0] }));
        setCurrentQuestion('duration');
        setTimeout(() => {
          addMessage(
            'How long have you been experiencing this symptom? (e.g., "2 hours", "since yesterday", "for 3 days")',
            'bot'
          );
        }, 1000);
        break;
        
      case 'duration':
        setCurrentSymptom(prev => ({ ...prev, duration: input }));
        setCurrentQuestion('onset');
        setTimeout(() => {
          addMessage(
            'When did this symptom start? Was it sudden or gradual?',
            'bot'
          );
        }, 1000);
        break;
        
      case 'onset':
        setCurrentSymptom(prev => ({ ...prev, onset: input }));
        setCurrentQuestion('triggers');
        setTimeout(() => {
          addMessage(
            'Have you noticed any triggers that make this symptom worse? (e.g., food, activities, stress) Or type "none" if unsure.',
            'bot'
          );
        }, 1000);
        break;
        
      case 'triggers':
        const finalSymptom = {
          ...currentSymptom,
          triggers: input,
          severity: severity[0]
        };
        
        // Save symptom and show confirmation
        setTimeout(() => {
          addMessage(
            `Thank you! I've recorded your ${finalSymptom.symptom} with severity ${finalSymptom.severity}/10. This information will be helpful for your doctor. Would you like to log another symptom or ask a question about this one?`,
            'bot'
          );
          showSymptomSummary(finalSymptom as SymptomData);
        }, 1000);
        
        // Reset for next symptom
        setIsCollecting(false);
        setCurrentSymptom({});
        setCurrentQuestion('');
        setSeverity([5]);
        break;
    }
  };

  const showSymptomSummary = (symptom: SymptomData) => {
    // This would save to local storage in a real app
    console.log('Saving symptom:', symptom);
  };

  const handleSeverityChange = () => {
    if (currentQuestion === 'severity') {
      addMessage(`Severity level: ${severity[0]}/10`, 'user');
      handleSymptomCollection(severity[0].toString());
    }
  };

  const savedSymptoms = [
    { 
      id: 1, 
      symptom: 'Headache', 
      severity: 7, 
      date: new Date().toLocaleDateString(),
      time: '2 hours ago'
    },
    { 
      id: 2, 
      symptom: 'Fatigue', 
      severity: 4, 
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      time: 'Yesterday'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2>Symptom Tracker</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Describe your symptoms in your own words
        </p>
      </div>

      {/* Saved symptoms summary */}
      {savedSymptoms.length > 0 && (
        <div className="px-4 py-3 bg-muted/30">
          <h4 className="mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Recent Symptoms
          </h4>
          <div className="flex gap-2 overflow-x-auto">
            {savedSymptoms.map((symptom) => (
              <Badge key={symptom.id} variant="outline" className="flex-shrink-0">
                {symptom.symptom} ({symptom.severity}/10) - {symptom.time}
              </Badge>
            ))}
          </div>
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

        {/* Severity slider for symptom rating */}
        {currentQuestion === 'severity' && (
          <Card className="mx-4 border-primary/20">
            <CardContent className="p-4">
              <h4 className="mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Rate your symptom severity
              </h4>
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={severity}
                    onValueChange={setSeverity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 - Mild</span>
                  <span className="font-medium text-primary">{severity[0]}/10</span>
                  <span>10 - Severe</span>
                </div>
                <Button onClick={handleSeverityChange} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Severity: {severity[0]}/10
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-card border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentQuestion === 'severity' 
                ? 'Use the slider above to rate severity...'
                : isCollecting
                ? 'Please answer the question above...'
                : 'Describe your symptoms...'
            }
            className="flex-1"
            disabled={currentQuestion === 'severity'}
          />
          <Button 
            type="submit" 
            size="sm" 
            className="px-3"
            disabled={!inputValue.trim() || currentQuestion === 'severity'}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Your symptoms are stored privately on your device
        </p>
      </div>
    </div>
  );
}