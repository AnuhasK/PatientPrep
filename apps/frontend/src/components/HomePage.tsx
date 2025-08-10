import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../styles/colors';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Mock data - in real app this would come from AsyncStorage or API
  const recentSymptoms = [
    { id: 1, symptom: 'Headache', severity: 6, date: '2 hours ago' },
    { id: 2, symptom: 'Fatigue', severity: 4, date: 'Yesterday' }
  ];

  const currentMedications = [
    { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily' },
    { id: 2, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily' }
  ];

  const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Smith', date: 'Tomorrow', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Johnson', date: 'March 15', time: '2:30 PM' }
  ];

  const healthNudges = [
    {
      id: 1,
      title: 'Time for medication',
      message: 'Take your Paracetamol (500mg)',
      icon: 'clock',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Log your symptoms',
      message: 'How are you feeling today?',
      icon: 'heart',
      priority: 'medium'
    }
  ];

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return colors.destructive;
    if (severity >= 4) return colors.warning;
    return colors.success;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subtitle}>Here's your health overview</Text>
      </View>

      {/* Health Nudges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Reminders</Text>
        {healthNudges.map(nudge => (
          <Card key={nudge.id} style={styles.nudgeCard}>
            <CardContent style={styles.nudgeContent}>
              <View style={styles.nudgeMain}>
                <View style={[
                  styles.nudgeIcon,
                  { backgroundColor: nudge.priority === 'high' ? colors.destructive + '20' : colors.primary + '20' }
                ]}>
                  <Feather
                    name={nudge.icon as any}
                    size={16}
                    color={nudge.priority === 'high' ? colors.destructive : colors.primary}
                  />
                </View>
                <View style={styles.nudgeText}>
                  <Text style={styles.nudgeTitle}>{nudge.title}</Text>
                  <Text style={styles.nudgeMessage}>{nudge.message}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.dismissButton}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <View style={styles.statHeader}>
                <Feather name="activity" size={20} color={colors.primary} />
                <Text style={styles.statValue}>8</Text>
              </View>
              <Text style={styles.statLabel}>Symptoms this week</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <View style={styles.statHeader}>
                <Feather name="trending-up" size={20} color={colors.success} />
                <Text style={styles.statValue}>95%</Text>
              </View>
              <Text style={styles.statLabel}>Medication adherence</Text>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* Recent Symptoms */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Symptoms</Text>
          <TouchableOpacity onPress={() => onNavigate('symptoms')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        {recentSymptoms.map(symptom => (
          <Card key={symptom.id} style={styles.listCard}>
            <CardContent style={styles.listContent}>
              <View style={styles.listMain}>
                <Text style={styles.listTitle}>{symptom.symptom}</Text>
                <Text style={styles.listSubtitle}>{symptom.date}</Text>
              </View>
              <View style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(symptom.severity) + '20' }
              ]}>
                <Text style={[
                  styles.severityText,
                  { color: getSeverityColor(symptom.severity) }
                ]}>
                  {symptom.severity}/10
                </Text>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Current Medications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          <TouchableOpacity onPress={() => onNavigate('medications')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        {currentMedications.map(medication => (
          <Card key={medication.id} style={styles.listCard}>
            <CardContent style={styles.listContent}>
              <View style={styles.medicationIcon}>
                <Feather name="package" size={16} color={colors.primary} />
              </View>
              <View style={styles.listMain}>
                <Text style={styles.listTitle}>{medication.name}</Text>
                <Text style={styles.listSubtitle}>
                  {medication.dosage} • {medication.frequency}
                </Text>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <Button
            title="Log Symptoms"
            onPress={() => onNavigate('symptoms')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="View Questions"
            onPress={() => onNavigate('questions')}
            variant="outline"
            style={styles.actionButton}
          />
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
  header: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.foreground,
  },
  viewAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  nudgeCard: {
    marginBottom: spacing.sm,
  },
  nudgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nudgeMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nudgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  nudgeText: {
    flex: 1,
  },
  nudgeTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  nudgeMessage: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  dismissButton: {
    padding: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.foreground,
    marginLeft: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  listCard: {
    marginBottom: spacing.sm,
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  listMain: {
    flex: 1,
  },
  listTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  severityText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});
