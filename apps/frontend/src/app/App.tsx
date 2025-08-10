import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Login } from '../components/Login';
import { HomePage } from '../components/HomePage';
import { Navigation } from '../components/Navigation';
import { Signup } from '../components/Signup';
import { ForgotPassword } from '../components/ForgotPassword';
import { SymptomLogger } from '../components/SymptomLogger';
import { MedicationTracker } from '../components/MedicationTracker';
import { QuestionBuilder } from '../components/QuestionBuilder';
import { Profile } from '../components/Profile';
import { colors } from '../styles/colors';
import { Storage } from '../utils/storage';

type AuthState = 'login' | 'signup' | 'forgot-password';

const MainApp = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [authState, setAuthState] = useState<AuthState>('login');
  const [activeTab, setActiveTab] = useState('home');

  const handleLogin = () => {
    // Firebase auth state will automatically update via useAuth hook
    setAuthState('login');
  };

  const renderPlaceholderScreen = (title: string) => (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>{title}</Text>
      <Text style={styles.placeholderSubtext}>Coming soon...</Text>
    </View>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={setActiveTab} />;
      case 'symptoms':
        return <SymptomLogger />;
      case 'medications':
        return <MedicationTracker />;
      case 'questions':
        return <QuestionBuilder />;
      case 'profile':
        return <Profile />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {!isAuthenticated ? (
        authState === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthState('signup')}
            onForgotPassword={() => setAuthState('forgot-password')}
          />
        ) : authState === 'signup' ? (
          <Signup
            onSignup={handleLogin}
            onSwitchToLogin={() => setAuthState('login')}
          />
        ) : (
          <ForgotPassword
            onBackToLogin={() => setAuthState('login')}
          />
        )
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.content}>
            {renderMainContent()}
          </View>
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.foreground,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
});

const App = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
