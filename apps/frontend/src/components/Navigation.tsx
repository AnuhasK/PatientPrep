import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSize } from '../styles/colors';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'symptoms', label: 'Symptoms', icon: 'activity' },
  { id: 'medications', label: 'Medications', icon: 'package' },
  { id: 'questions', label: 'Questions', icon: 'help-circle' },
  { id: 'profile', label: 'Profile', icon: 'user' },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={styles.tab}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Feather
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.id ? colors.primary : colors.mutedForeground}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === tab.id ? colors.primary : colors.mutedForeground }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
    textAlign: 'center',
  },
});
