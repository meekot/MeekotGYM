import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { WorkoutSession } from '../types';
import WorkoutCard from './WorkoutCard';

interface WorkoutHistoryProps {
  workouts: WorkoutSession[];
  onEdit: (workout: WorkoutSession) => void;
  onDelete: (workoutId: string) => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts, onEdit, onDelete }) => {
  if (workouts.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={64} color="#64748b" />
        <Text style={styles.emptyTitle}>No Workouts Logged</Text>
        <Text style={styles.emptySubtitle}>
          Tap the plus button to log your first session and start your fitness journey!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    >
      <Text style={styles.title}>Workout History</Text>
      {workouts.map((workout) => (
        <WorkoutCard key={workout.id} workout={workout} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#cbd5f5',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 96,
    paddingTop: 8,
  },
  scroll: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 12,
  },
});

export default WorkoutHistory;
