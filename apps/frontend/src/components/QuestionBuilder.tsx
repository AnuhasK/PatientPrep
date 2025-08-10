import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '../utils/storage';

// Colors
const colors = {
  primary: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  destructive: '#EF4444',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

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

const { width } = Dimensions.get('window');

export const QuestionBuilder: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I can help you prepare questions for your doctor visit. What would you like to ask or discuss with your healthcare provider?",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const suggestedQuestions = [
    'How often should I take this medication?',
    'What are the warning signs I should watch for?',
    'When should I schedule my next check-up?',
    'Are there any foods or activities I should avoid?',
    'What tests or screenings do I need?',
    'How can I manage my symptoms better?'
  ];

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const storedQuestions = await Storage.getItem('doctor_questions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        // Add sample questions if none exist
        const sampleQuestions: Question[] = [
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
        ];
        setQuestions(sampleQuestions);
        await Storage.setItem('doctor_questions', JSON.stringify(sampleQuestions));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const saveQuestions = async (newQuestions: Question[]) => {
    try {
      await Storage.setItem('doctor_questions', JSON.stringify(newQuestions));
      setQuestions(newQuestions);
    } catch (error) {
      console.error('Error saving questions:', error);
      Alert.alert('Error', 'Failed to save question data');
    }
  };

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = () => {
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

    const updatedQuestions = [...questions, newQuestion];
    saveQuestions(updatedQuestions);

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

    saveQuestions(newQuestions);
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    saveQuestions(updatedQuestions);
  };

  const addSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.destructive;
      case 'medium': return colors.primary;
      case 'low': return colors.gray[500];
      default: return colors.primary;
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>Question Builder</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Prepare thoughtful questions for your doctor
        </Text>
      </View>

      {/* Prepared Questions */}
      {questions.length > 0 && (
        <View style={styles.questionsContainer}>
          <View style={styles.questionsHeader}>
            <Ionicons name="star-outline" size={16} color={colors.primary} />
            <Text style={styles.questionsTitle}>
              Your Questions ({questions.length})
            </Text>
          </View>
          
          <ScrollView style={styles.questionsList} showsVerticalScrollIndicator={false}>
            {sortedQuestions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.questionContent}>
                  <View style={styles.questionBadges}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>#{index + 1}</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(question.priority) }]}>
                      <Text style={styles.priorityBadgeText}>{question.priority}</Text>
                    </View>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{question.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.questionText}>{question.question}</Text>
                </View>
                <View style={styles.questionActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, index === 0 && styles.disabledButton]}
                    onPress={() => moveQuestion(question.id, 'up')}
                    disabled={index === 0}
                  >
                    <Ionicons name="chevron-up" size={16} color={index === 0 ? colors.gray[400] : colors.gray[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, index === sortedQuestions.length - 1 && styles.disabledButton]}
                    onPress={() => moveQuestion(question.id, 'down')}
                    disabled={index === sortedQuestions.length - 1}
                  >
                    <Ionicons name="chevron-down" size={16} color={index === sortedQuestions.length - 1 ? colors.gray[400] : colors.gray[600]} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteQuestion(question.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'user' ? styles.userMessageContainer : styles.botMessageContainer
            ]}
          >
            <View style={[
              styles.avatarContainer,
              message.type === 'user' ? styles.userAvatar : styles.botAvatar
            ]}>
              <Ionicons 
                name={message.type === 'user' ? 'person' : 'chatbox-outline'} 
                size={16} 
                color={message.type === 'user' ? colors.white : colors.gray[600]} 
              />
            </View>
            <View style={[
              styles.messageBubble,
              message.type === 'user' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.type === 'user' ? styles.userMessageText : styles.botMessageText
              ]}>
                {message.content}
              </Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Suggested Questions */}
      <View style={styles.suggestionsContainer}>
        <View style={styles.suggestionsHeader}>
          <Ionicons name="bulb-outline" size={16} color={colors.primary} />
          <Text style={styles.suggestionsTitle}>Quick suggestions:</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.suggestions}>
            {suggestedQuestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.suggestionButton}
                onPress={() => addSuggestedQuestion(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="What would you like to ask your doctor?"
            placeholderTextColor={colors.gray[400]}
            multiline
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputValue.trim() && styles.disabledSendButton
            ]}
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
          >
            <Ionicons name="send" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          Questions are prioritized and organized for your visit
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 4,
  },
  questionsContainer: {
    backgroundColor: colors.gray[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
  },
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  questionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  questionsList: {
    maxHeight: 250,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  questionContent: {
    flex: 1,
  },
  questionBadges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  orderBadge: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  orderBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.gray[700],
  },
  priorityBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.white,
  },
  categoryBadge: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.gray[700],
  },
  questionText: {
    fontSize: 14,
    color: colors.gray[900],
    lineHeight: 20,
  },
  questionActions: {
    alignItems: 'center',
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    flexDirection: 'row-reverse',
  },
  botMessageContainer: {
    flexDirection: 'row',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: colors.primary,
  },
  botAvatar: {
    backgroundColor: colors.gray[200],
  },
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: colors.gray[100],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.white,
  },
  botMessageText: {
    color: colors.gray[900],
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
  suggestionsContainer: {
    backgroundColor: colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray[700],
  },
  suggestions: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 11,
    color: colors.gray[700],
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: colors.white,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: colors.gray[300],
  },
  privacyText: {
    fontSize: 11,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
});
