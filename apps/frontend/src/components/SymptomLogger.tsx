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

interface SymptomData {
  symptom: string;
  severity: number;
  duration: string;
  triggers: string;
  onset: string;
  timestamp: Date;
}

const { width } = Dimensions.get('window');

export const SymptomLogger: React.FC = () => {
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
  const [severity, setSeverity] = useState(5);
  const [savedSymptoms, setSavedSymptoms] = useState<SymptomData[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSavedSymptoms();
  }, []);

  const loadSavedSymptoms = async () => {
    try {
      const symptoms = await Storage.getItem('symptoms');
      if (symptoms) {
        setSavedSymptoms(JSON.parse(symptoms));
      }
    } catch (error) {
      console.error('Error loading symptoms:', error);
    }
  };

  const saveSymptom = async (symptom: SymptomData) => {
    try {
      const updatedSymptoms = [...savedSymptoms, symptom];
      await Storage.setItem('symptoms', JSON.stringify(updatedSymptoms));
      setSavedSymptoms(updatedSymptoms);
    } catch (error) {
      console.error('Error saving symptom:', error);
      Alert.alert('Error', 'Failed to save symptom data');
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
        setCurrentSymptom(prev => ({ ...prev, severity }));
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
        const finalSymptom: SymptomData = {
          ...currentSymptom,
          triggers: input,
          severity,
          timestamp: new Date()
        } as SymptomData;
        
        // Save symptom and show confirmation
        saveSymptom(finalSymptom);
        setTimeout(() => {
          addMessage(
            `Thank you! I've recorded your ${finalSymptom.symptom} with severity ${finalSymptom.severity}/10. This information will be helpful for your doctor. Would you like to log another symptom or ask a question about this one?`,
            'bot'
          );
        }, 1000);
        
        // Reset for next symptom
        setIsCollecting(false);
        setCurrentSymptom({});
        setCurrentQuestion('');
        setSeverity(5);
        break;
    }
  };

  const handleSeverityConfirm = () => {
    if (currentQuestion === 'severity') {
      addMessage(`Severity level: ${severity}/10`, 'user');
      handleSymptomCollection(severity.toString());
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
          <Text style={styles.headerTitle}>Symptom Tracker</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Describe your symptoms in your own words
        </Text>
      </View>

      {/* Saved symptoms summary */}
      {savedSymptoms.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.summaryTitle}>Recent Symptoms</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.symptomBadges}>
              {savedSymptoms.slice(-3).map((symptom, index) => (
                <View key={index} style={styles.symptomBadge}>
                  <Text style={styles.symptomBadgeText}>
                    {symptom.symptom} ({symptom.severity}/10) - {formatTimeAgo(symptom.timestamp)}
                  </Text>
                </View>
              ))}
            </View>
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

        {/* Severity slider for symptom rating */}
        {currentQuestion === 'severity' && (
          <View style={styles.severityContainer}>
            <View style={styles.severityCard}>
              <View style={styles.severityHeader}>
                <Ionicons name="trending-up" size={16} color={colors.primary} />
                <Text style={styles.severityTitle}>Rate your symptom severity</Text>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.severityButtons}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.severityButton,
                        severity === level && styles.severityButtonActive
                      ]}
                      onPress={() => setSeverity(level)}
                    >
                      <Text style={[
                        styles.severityButtonText,
                        severity === level && styles.severityButtonTextActive
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1 - Mild</Text>
                  <Text style={styles.sliderValue}>{severity}/10</Text>
                  <Text style={styles.sliderLabel}>10 - Severe</Text>
                </View>
                <TouchableOpacity style={styles.confirmButton} onPress={handleSeverityConfirm}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.white} />
                  <Text style={styles.confirmButtonText}>Confirm Severity: {severity}/10</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.textInput,
              currentQuestion === 'severity' && styles.disabledInput
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={
              currentQuestion === 'severity' 
                ? 'Use the slider above to rate severity...'
                : isCollecting
                ? 'Please answer the question above...'
                : 'Describe your symptoms...'
            }
            placeholderTextColor={colors.gray[400]}
            multiline
            editable={currentQuestion !== 'severity'}
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!inputValue.trim() || currentQuestion === 'severity') && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!inputValue.trim() || currentQuestion === 'severity'}
          >
            <Ionicons name="send" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          Your symptoms are stored privately on your device
        </Text>
      </View>
    </View>
  );
}

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
  summaryContainer: {
    backgroundColor: colors.gray[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  symptomBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  symptomBadge: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  symptomBadgeText: {
    fontSize: 12,
    color: colors.gray[700],
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
  severityContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  severityCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  severityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[900],
  },
  sliderContainer: {
    gap: 16,
  },
  severityButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  severityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[700],
  },
  severityButtonTextActive: {
    color: colors.white,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
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
  disabledInput: {
    backgroundColor: colors.gray[50],
    color: colors.gray[400],
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
  },
  privacyText: {
    fontSize: 11,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: 8,
  },
});
