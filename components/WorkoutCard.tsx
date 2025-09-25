import React, { useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WorkoutSession } from '../types';
import { ChevronDownIcon, EditIcon, TrashIcon } from './icons/Icons';

interface WorkoutCardProps {
  workout: WorkoutSession;
  onEdit: (workout: WorkoutSession) => void;
  onDelete: (workoutId: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = useMemo(() => {
    const date = new Date(workout.date);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [workout.date]);

  const totalSets = useMemo(
    () => workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0),
    [workout.exercises]
  );

  const totalVolume = useMemo(
    () =>
      workout.exercises.reduce(
        (acc, exercise) =>
          acc + exercise.sets.reduce((setAcc, set) => setAcc + set.reps * set.weight, 0),
        0
      ),
    [workout.exercises]
  );

  const toggleExpanded = () => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setIsExpanded((previous) => !previous);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardDate}>{formattedDate}</Text>
          <Text style={styles.cardTitle}>{workout.name || 'Untitled Workout'}</Text>
          <Text style={styles.cardMeta}>
            {workout.exercises.length} Exercises • {totalSets} Sets • {Math.round(totalVolume)} kg Volume
          </Text>
        </View>
        <View style={[styles.iconContainer, isExpanded && styles.iconRotated]}>
          <ChevronDownIcon size={20} color="#cbd5f5" />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.cardBody}>
          {workout.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              {exercise.sets.map((set, index) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setLabel}>Set {index + 1}</Text>
                  <Text style={styles.setValue}>
                    {set.weight} kg × {set.reps} reps
                  </Text>
                </View>
              ))}
            </View>
          ))}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(workout)}>
              <EditIcon size={20} color="#60a5fa" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(workout.id)}>
              <TrashIcon size={20} color="#f87171" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111c33',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#1f2a44',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardHeaderText: {
    flex: 1,
    marginRight: 12,
  },
  cardDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38bdf8',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: '#cbd5f5',
    marginTop: 6,
  },
  iconContainer: {
    transform: [{ rotate: '0deg' }],
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  cardBody: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1f2a44',
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  exerciseContainer: {
    marginTop: 18,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1f2a44',
  },
  setLabel: {
    fontSize: 14,
    color: '#cbd5f5',
  },
  setValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5f5',
  },
});

export default WorkoutCard;
