import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/colors';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Feather name="check-circle" size={60} color={colors.primary} />
          </View>
          
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We've sent password reset instructions to{' '}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <Card style={styles.instructionsCard}>
            <CardContent>
              <View style={styles.alertContainer}>
                <Feather name="mail" size={16} color={colors.primary} />
                <Text style={styles.alertText}>
                  Password reset link sent successfully! Check your email and follow the instructions.
                </Text>
              </View>
              
              <View style={styles.instructionsList}>
                <Text style={styles.instructionItem}>
                  • Check your spam/junk folder if you don't see the email
                </Text>
                <Text style={styles.instructionItem}>
                  • The reset link will expire in 24 hours
                </Text>
                <Text style={styles.instructionItem}>
                  • Contact support if you need additional help
                </Text>
              </View>
            </CardContent>
          </Card>

          <Button
            title="Back to Login"
            onPress={onBackToLogin}
            variant="outline"
            style={styles.backButton}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backIcon} onPress={onBackToLogin}>
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Feather name="heart" size={48} color={colors.primary} />
          </View>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        <Card style={styles.resetCard}>
          <CardContent>
            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={colors.destructive} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Send Reset Link"
                onPress={handleResetRequest}
                loading={isLoading}
                style={styles.resetButton}
              />
            </View>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Remember your password?{' '}
                <Text style={styles.linkText} onPress={onBackToLogin}>
                  Back to Sign In
                </Text>
              </Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  successContainer: {
    flexGrow: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  resetCard: {
    marginBottom: spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.destructive + '20',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.destructive,
    fontSize: fontSize.sm,
    marginLeft: spacing.xs,
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    marginBottom: spacing.lg,
  },
  resetButton: {
    width: '100%',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Success screen styles
  successIconContainer: {
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emailText: {
    fontWeight: '600',
    color: colors.foreground,
  },
  instructionsCard: {
    marginBottom: spacing.xl,
    width: '100%',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  alertText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },
  instructionsList: {
    gap: spacing.xs,
  },
  instructionItem: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  backButton: {
    width: '100%',
  },
});
