import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../services/authService';
import { Storage } from '../utils/storage';

// Colors
const colors = {
  primary: '#3B82F6',
  background: '#F8FAFC',
  white: '#FFFFFF',
  destructive: '#EF4444',
  green: {
    50: '#F0FDF4',
    200: '#BBF7D0',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
  },
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

interface ProfileProps {
  // No props needed - Firebase auth state handles everything
}

export const Profile: React.FC<ProfileProps> = () => {
  const { user, forceLogout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [biometricLock, setBiometricLock] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [dataStats, setDataStats] = useState({
    symptoms: 0,
    medications: 0,
    questions: 0,
    appointments: 0,
    totalSize: '0 KB'
  });

  useEffect(() => {
    loadDataStats();
  }, []);

  const handleLogout = async () => {
    console.log('Logout button pressed');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              
              // Clear local storage first
              console.log('Clearing local storage...');
              await Storage.removeItem('patientprep_user');
              console.log('Local storage cleared');
              
              // Sign out from Firebase
              console.log('Calling signOutUser...');
              await signOutUser();
              console.log('Firebase signOut completed');
              
              // For browser environments, manually force auth state reset
              if (typeof window !== 'undefined') {
                console.log('Browser detected, forcing auth state reset...');
                forceLogout();
              }
              
              console.log('Logout completed successfully');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const loadDataStats = async () => {
    try {
      const symptoms = await Storage.getItem('symptoms');
      const medications = await Storage.getItem('medications');
      const questions = await Storage.getItem('doctor_questions');
      
      const symptomsData = symptoms ? JSON.parse(symptoms) : [];
      const medicationsData = medications ? JSON.parse(medications) : [];
      const questionsData = questions ? JSON.parse(questions) : [];
      
      // Calculate approximate storage size
      const totalData = JSON.stringify({ symptomsData, medicationsData, questionsData });
      const sizeInBytes = new Blob([totalData]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(1);
      
      setDataStats({
        symptoms: symptomsData.length,
        medications: medicationsData.length,
        questions: questionsData.length,
        appointments: 2, // Placeholder
        totalSize: `${sizeInKB} KB`
      });
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will export your health data as a PDF file that you can share with healthcare providers.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') }
      ]
    );
  };

  const handleCreateBackup = () => {
    Alert.alert(
      'Create Backup',
      'This will create a backup file of all your health data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: () => console.log('Creating backup...') }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your health data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await Storage.clear();
              Alert.alert('Success', 'All data has been deleted.');
              setDataStats({
                symptoms: 0,
                medications: 0,
                questions: 0,
                appointments: 0,
                totalSize: '0 KB'
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data.');
            }
          }
        }
      ]
    );
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy-policy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms-of-service');
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@patientprep.lk');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.userType}>PatientPrep SL User</Text>
            <View style={styles.privacyBadge}>
              <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
              <Text style={styles.privacyBadgeText}>Privacy Protected</Text>
            </View>
          </View>
        </View>

        {/* Data Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="server-outline" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Your Health Data</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            All data is stored securely on your device
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{dataStats.symptoms}</Text>
              <Text style={styles.statLabel}>Symptoms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{dataStats.medications}</Text>
              <Text style={styles.statLabel}>Medications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{dataStats.questions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{dataStats.appointments}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
          </View>
          
          <View style={styles.storageInfo}>
            <View style={styles.storageInfoLeft}>
              <Ionicons name="phone-portrait" size={16} color={colors.primary} />
              <Text style={styles.storageInfoText}>Total Storage Used</Text>
            </View>
            <View style={styles.storageBadge}>
              <Text style={styles.storageBadgeText}>{dataStats.totalSize}</Text>
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Privacy & Security</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed" size={16} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Biometric Lock</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint/face to access app
                </Text>
              </View>
            </View>
            {/* Note: Switch component would go here in a real implementation */}
            <TouchableOpacity 
              style={[styles.switch, biometricLock && styles.switchActive]}
              onPress={() => setBiometricLock(!biometricLock)}
            >
              <View style={[styles.switchThumb, biometricLock && styles.switchThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye" size={16} color={colors.primary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Session Timeout</Text>
                <Text style={styles.settingDescription}>
                  Auto-lock after 5 minutes of inactivity
                </Text>
              </View>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>5 min</Text>
            </View>
          </View>

          <View style={styles.privacyNotice}>
            <Ionicons name="shield-checkmark" size={16} color={colors.green[600]} />
            <View style={styles.privacyNoticeContent}>
              <Text style={styles.privacyNoticeTitle}>
                Your privacy is protected
              </Text>
              <Text style={styles.privacyNoticeText}>
                All health data is encrypted and stored only on this device. 
                We never share your personal health information.
              </Text>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Ionicons name="download" size={16} color={colors.gray[700]} />
            <Text style={styles.actionButtonText}>Export All Data (PDF)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCreateBackup}>
            <Ionicons name="server" size={16} color={colors.gray[700]} />
            <Text style={styles.actionButtonText}>Create Backup File</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={[styles.actionButton, styles.destructiveButton]} onPress={handleDeleteAllData}>
            <Ionicons name="trash" size={16} color={colors.destructive} />
            <Text style={[styles.actionButtonText, styles.destructiveText]}>Delete All Data</Text>
          </TouchableOpacity>

          <View style={styles.warningNotice}>
            <Ionicons name="information-circle" size={16} color={colors.yellow[600]} />
            <Text style={styles.warningNoticeText}>
              Data export creates a PDF summary of your health information 
              that you can print or share with healthcare providers.
            </Text>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>App Information</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>1.0.0</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Storage Location</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Local Device</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Compliance</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PDPA Sri Lanka</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.linkButton} onPress={openPrivacyPolicy}>
            <Text style={styles.linkButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={openTermsOfService}>
            <Text style={styles.linkButtonText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={contactSupport}>
            <Text style={styles.linkButtonText}>Contact Support</Text>
          </TouchableOpacity>

          {/* Always show logout button for authenticated users */}
          <>
            <View style={styles.separator} />
            <TouchableOpacity style={[styles.linkButton, styles.logoutButton]} onPress={handleLogout}>
              <Text style={[styles.linkButtonText, styles.logoutText]}>Sign Out</Text>
            </TouchableOpacity>
          </>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PatientPrep SL - Healthcare Companion</Text>
          <Text style={styles.footerText}>Built for patients in Sri Lanka with privacy in mind</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary + '10',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 8,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  privacyBadgeText: {
    fontSize: 10,
    color: colors.gray[700],
    fontWeight: '500',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  cardSubtitle: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    padding: 12,
    borderRadius: 8,
  },
  storageInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storageInfoText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  storageBadge: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  storageBadgeText: {
    fontSize: 10,
    color: colors.gray[700],
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.gray[600],
  },
  switch: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[300],
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 16,
  },
  badge: {
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    color: colors.gray[700],
    fontWeight: '500',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.green[50],
    borderWidth: 1,
    borderColor: colors.green[200],
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  privacyNoticeContent: {
    flex: 1,
  },
  privacyNoticeTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.green[800],
    marginBottom: 2,
  },
  privacyNoticeText: {
    fontSize: 10,
    color: colors.green[700],
    lineHeight: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.gray[700],
    fontWeight: '500',
  },
  destructiveButton: {
    borderColor: colors.destructive + '20',
    backgroundColor: colors.destructive + '05',
  },
  destructiveText: {
    color: colors.destructive,
  },
  warningNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.yellow[50],
    borderWidth: 1,
    borderColor: colors.yellow[200],
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningNoticeText: {
    fontSize: 10,
    color: colors.yellow[700],
    lineHeight: 14,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkButtonText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  logoutButton: {
    marginTop: 8,
  },
  logoutText: {
    color: colors.destructive,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 10,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 2,
  },
});
