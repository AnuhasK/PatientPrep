import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { Login } from '../components/Login';
import { HomePage } from '../components/HomePage';
import { Navigation } from '../components/Navigation';
import { colors } from '../styles/colors';
import { Storage } from '../utils/storage';

type AuthState = 'login' | 'signup' | 'forgot-password';
type AppState = 'auth' | 'main';

const App = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [authState, setAuthState] = useState<AuthState>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await Storage.getItem('patientprep_user');
      if (user) {
        setAppState('main');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setAppState('main');
  };

  const handleLogout = async () => {
    try {
      await Storage.clear();
      setAppState('auth');
      setActiveTab('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
        return renderPlaceholderScreen('Symptom Logger');
      case 'medications':
        return renderPlaceholderScreen('Medication Tracker');
      case 'questions':
        return renderPlaceholderScreen('Question Builder');
      case 'profile':
        return renderPlaceholderScreen('Profile');
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  if (isLoading) {
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
      
      {appState === 'auth' ? (
        authState === 'login' ? (
          <Login
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthState('signup')}
            onForgotPassword={() => setAuthState('forgot-password')}
          />
        ) : (
          // Placeholder for other auth screens
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {authState === 'signup' ? 'Sign Up' : 'Forgot Password'}
            </Text>
            <Text style={styles.placeholderSubtext}>Coming soon...</Text>
          </View>
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

export default App;
