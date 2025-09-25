import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Exercise, WorkoutSession } from '../types';
import ExerciseForm from './ExerciseForm';
import { PlusIcon } from './icons/Icons';

interface WorkoutFormProps {
  onSave: (workout: WorkoutSession) => void;
  onCancel: () => void;
  existingWorkout: WorkoutSession | null;
}

const createEmptyWorkout = (): WorkoutSession => ({
  id: Date.now().toString(),
  date: new Date().toISOString(),
  name: `Workout ${new Date().toLocaleDateString()}`,
  exercises: [],
});

const cloneWorkout = (session: WorkoutSession): WorkoutSession => ({
  ...session,
  exercises: session.exercises.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set })),
  })),
});

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onCancel, existingWorkout }) => {
  const [workout, setWorkout] = useState<WorkoutSession>(
    existingWorkout ? cloneWorkout(existingWorkout) : createEmptyWorkout()
  );

  useEffect(() => {
    if (existingWorkout) {
      setWorkout(cloneWorkout(existingWorkout));
    } else {
      setWorkout(createEmptyWorkout());
    }
  }, [existingWorkout]);

  const title = useMemo(() => (existingWorkout ? 'Edit Workout' : 'Log New Workout'), [existingWorkout]);

  const handleExerciseChange = (updatedExercise: Exercise) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      ),
    }));
  };

  const addExercise = () => {
    const timestamp = Date.now().toString();
    const newExercise: Exercise = {
      id: `${timestamp}-${Math.random()}`,
      name: '',
      sets: [
        {
          id: `${timestamp}-set-1`,
          reps: 8,
          weight: 0,
        },
      ],
    };
    setWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const handleSave = () => {
    const cleanedExercises = workout.exercises.filter((exercise) => exercise.name.trim().length > 0);

    if (cleanedExercises.length === 0) {
      Alert.alert('Add an exercise', 'Please add at least one exercise before saving.');
      return;
    }

    onSave({
      ...workout,
      exercises: cleanedExercises,
    });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Name (e.g., Push Day)"
        placeholderTextColor="#94a3b8"
        value={workout.name ?? ''}
        onChangeText={(text) => setWorkout((prev) => ({ ...prev, name: text }))}
      />

      <View>
        {workout.exercises.map((exercise, index) => (
          <ExerciseForm
            key={exercise.id}
            exercise={exercise}
            onChange={handleExerciseChange}
            onRemove={() => removeExercise(exercise.id)}
            exerciseNumber={index + 1}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
        <PlusIcon size={18} color="#38bdf8" />
        <Text style={styles.addExerciseText}>Add Exercise</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>{existingWorkout ? 'Update Workout' : 'Save Workout'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1f2a44',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  addExerciseText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#38bdf8',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#475569',
    marginRight: 12,
  },
  cancelText: {
    color: '#e2e8f0',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default WorkoutForm;
