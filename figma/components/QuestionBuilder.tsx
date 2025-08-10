import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Send, 
  HelpCircle, 
  Bot,
  User,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Lightbulb
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Question {
  id: string;
  question: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  order: number;
}

export function QuestionBuilder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I can help you prepare questions for your doctor visit. What would you like to ask or discuss with your healthcare provider?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'Should I be concerned about my recent headaches?',
      priority: 'high',
      category: 'Symptoms',
      order: 1
    },
    {
      id: '2',
      question: 'Are there any side effects I should watch for with my current medications?',
      priority: 'medium',
      category: 'Medications',
      order: 2
    },
    {
      id: '3',
      question: 'What lifestyle changes could help improve my overall health?',
      priority: 'low',
      category: 'Prevention',
      order: 3
    }
  ]);

  const suggestedQuestions = [
    'How often should I take this medication?',
    'What are the warning signs I should watch for?',
    'When should I schedule my next check-up?',
    'Are there any foods or activities I should avoid?',
    'What tests or screenings do I need?',
    'How can I manage my symptoms better?'
  ];

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
    // Simple AI-like processing to convert input to structured question
    const questionText = input.endsWith('?') ? input : `${input}?`;
    
    // Determine priority based on keywords
    let priority: 'high' | 'medium' | 'low' = 'medium';
    const highPriorityKeywords = ['pain', 'severe', 'urgent', 'emergency', 'serious', 'worried', 'concern'];
    const lowPriorityKeywords = ['prevent', 'general', 'lifestyle', 'tips', 'advice'];
    
    if (highPriorityKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
      priority = 'high';
    } else if (lowPriorityKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
      priority = 'low';
    }

    // Determine category
    let category = 'General';
    if (input.toLowerCase().includes('medication') || input.toLowerCase().includes('drug')) {
      category = 'Medications';
    } else if (input.toLowerCase().includes('symptom') || input.toLowerCase().includes('pain')) {
      category = 'Symptoms';
    } else if (input.toLowerCase().includes('test') || input.toLowerCase().includes('screening')) {
      category = 'Tests';
    } else if (input.toLowerCase().includes('lifestyle') || input.toLowerCase().includes('diet')) {
      category = 'Prevention';
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      question: questionText,
      priority,
      category,
      order: questions.length + 1
    };

    setQuestions(prev => [...prev, newQuestion]);

    setTimeout(() => {
      addMessage(
        `Great question! I've added "${questionText}" to your list with ${priority} priority under ${category}. This will help ensure you get the information you need from your doctor.`,
        'bot'
      );
      
      // Provide related suggestions
      setTimeout(() => {
        addMessage(
          'Would you like me to suggest some related questions, or do you have another concern you\'d like to discuss?',
          'bot'
        );
      }, 1500);
    }, 1000);
  };

  const updateQuestionPriority = (id: string, newPriority: 'high' | 'medium' | 'low') => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, priority: newPriority } : q)
    );
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newQuestions[currentIndex], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[currentIndex]];

    // Update order numbers
    newQuestions.forEach((q, index) => {
      q.order = index + 1;
    });

    setQuestions(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const addSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h2>Question Builder</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Prepare thoughtful questions for your doctor
        </p>
      </div>

      {/* Prepared Questions */}
      {questions.length > 0 && (
        <div className="px-4 py-3 bg-muted/30 max-h-64 overflow-y-auto">
          <h4 className="mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Your Questions ({questions.length})
          </h4>
          <div className="space-y-2">
            {sortedQuestions.map((question, index) => (
              <Card key={question.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Badge variant={getPriorityColor(question.priority) as any}>
                        {question.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                    </div>
                    <p className="text-sm">{question.question}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(question.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveQuestion(question.id, 'down')}
                      disabled={index === sortedQuestions.length - 1}
                    >
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
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

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-muted/30 border-t">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h4 className="text-sm">Quick suggestions:</h4>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {suggestedQuestions.map((suggestion, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm"
              onClick={() => addSuggestedQuestion(suggestion)}
              className="flex-shrink-0 text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="bg-card border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What would you like to ask your doctor?"
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
          Questions are prioritized and organized for your visit
        </p>
      </div>
    </div>
  );
}