import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '../utils/storage';

// Colors
const colors = {
  primary: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  yellow: {
    50: '#FFFBEB',
    200: '#FDE68A',
    600: '#D97706',
    700: '#B45309',
  },
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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  active: boolean;
  sideEffects?: string;
}

const { width } = Dimensions.get('window');

export const MedicationTracker: React.FC = () => {
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
  const [medications, setMedications] = useState<Medication[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      const storedMeds = await Storage.getItem('medications');
      if (storedMeds) {
        setMedications(JSON.parse(storedMeds));
      } else {
        // Add sample medications if none exist
        const sampleMeds: Medication[] = [
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
        ];
        setMedications(sampleMeds);
        await Storage.setItem('medications', JSON.stringify(sampleMeds));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
    }
  };

  const saveMedications = async (newMedications: Medication[]) => {
    try {
      await Storage.setItem('medications', JSON.stringify(newMedications));
      setMedications(newMedications);
    } catch (error) {
      console.error('Error saving medications:', error);
      Alert.alert('Error', 'Failed to save medication data');
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
        
        const updatedMedications = [...medications, finalMedication];
        saveMedications(updatedMedications);
        
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
    const updatedMedications = medications.map(med => 
      med.id === id ? { ...med, active: !med.active } : med
    );
    saveMedications(updatedMedications);
  };

  const activeMedicationsCount = medications.filter(m => m.active).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTitle}>
            <Ionicons name="medical" size={20} color={colors.primary} />
            <Text style={styles.headerTitleText}>Medication Tracker</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Manage your medications and dosages
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={startAddingMedication}>
          <Ionicons name="add" size={16} color={colors.white} />
          <Text style={styles.addButtonText}>Add Med</Text>
        </TouchableOpacity>
      </View>

      {/* Current Medications */}
      {medications.length > 0 && (
        <View style={styles.medicationsContainer}>
          <View style={styles.medicationsHeader}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.medicationsTitle}>
              Your Medications ({activeMedicationsCount} active)
            </Text>
          </View>
          
          <ScrollView style={styles.medicationsList} showsVerticalScrollIndicator={false}>
            {medications.map((med) => (
              <View key={med.id} style={styles.medicationCard}>
                <View style={styles.medicationInfo}>
                  <View style={styles.medicationNameRow}>
                    <Text style={[
                      styles.medicationName,
                      !med.active && styles.inactiveMedication
                    ]}>
                      {med.name}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      med.active ? styles.activeBadge : styles.inactiveBadge
                    ]}>
                      <Text style={[
                        styles.statusBadgeText,
                        med.active ? styles.activeBadgeText : styles.inactiveBadgeText
                      ]}>
                        {med.active ? 'Active' : 'Stopped'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.medicationDetails,
                    !med.active && styles.inactiveMedication
                  ]}>
                    {med.dosage} • {med.frequency}
                  </Text>
                </View>
                <View style={styles.medicationActions}>
                  <Switch
                    value={med.active}
                    onValueChange={() => toggleMedication(med.id)}
                    trackColor={{
                      false: colors.gray[300],
                      true: colors.primary + '80'
                    }}
                    thumbColor={med.active ? colors.primary : colors.gray[400]}
                  />
                  <TouchableOpacity style={styles.editButton}>
                    <Ionicons name="create-outline" size={16} color={colors.gray[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {activeMedicationsCount > 0 && (
            <View style={styles.warningContainer}>
              <Ionicons name="warning-outline" size={16} color={colors.yellow[600]} />
              <Text style={styles.warningText}>
                Remember to take medications as prescribed and discuss any concerns with your doctor.
              </Text>
            </View>
          )}
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

      {/* Quick actions */}
      <View style={styles.quickActionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => processUserInput('add new medication')}
            >
              <Text style={styles.quickActionText}>Add Medication</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => addMessage('Show me all my active medications', 'user')}
            >
              <Text style={styles.quickActionText}>View Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => addMessage('I have side effects to report', 'user')}
            >
              <Text style={styles.quickActionText}>Report Side Effects</Text>
            </TouchableOpacity>
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
            placeholder={
              isCollecting
                ? 'Please answer the question above...'
                : 'Tell me about your medications...'
            }
            placeholderTextColor={colors.gray[400]}
            multiline
            onSubmitEditing={handleSubmit}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !inputValue.trim() && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
          >
            <Ionicons name="send" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.privacyText}>
          Medication data is stored securely on your device
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  medicationsContainer: {
    backgroundColor: colors.gray[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 300,
  },
  medicationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  medicationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  medicationsList: {
    maxHeight: 200,
  },
  medicationCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
  },
  medicationDetails: {
    fontSize: 12,
    color: colors.gray[600],
  },
  inactiveMedication: {
    opacity: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: colors.primary,
  },
  inactiveBadge: {
    backgroundColor: colors.gray[300],
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: colors.white,
  },
  inactiveBadgeText: {
    color: colors.gray[700],
  },
  medicationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  warningContainer: {
    backgroundColor: colors.yellow[50],
    borderWidth: 1,
    borderColor: colors.yellow[200],
    borderRadius: 8,
    padding: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: colors.yellow[700],
    lineHeight: 16,
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
  quickActionsContainer: {
    backgroundColor: colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickActionText: {
    fontSize: 12,
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
