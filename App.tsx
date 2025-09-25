import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { WorkoutSession } from './types';
import { usePersistentStorage } from './hooks/usePersistentStorage';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutForm from './components/WorkoutForm';

type View = 'history' | 'logging';

const App: React.FC = () => {
  const [workouts, setWorkouts, isHydrated] = usePersistentStorage<WorkoutSession[]>(
    'workouts',
    []
  );
  const [currentView, setCurrentView] = useState<View>('history');
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const handleSaveWorkout = useCallback(
    (workout: WorkoutSession) => {
      setWorkouts((previous) => {
        const existingIndex = previous.findIndex((item) => item.id === workout.id);
        if (existingIndex >= 0) {
          const updated = [...previous];
          updated[existingIndex] = workout;
          return updated;
        }
        return [workout, ...previous];
      });
      setCurrentView('history');
      setEditingWorkout(null);
    },
    [setWorkouts]
  );

  const handleStartNewWorkout = useCallback(() => {
    setEditingWorkout(null);
    setCurrentView('logging');
  }, []);

  const handleEditWorkout = useCallback((workout: WorkoutSession) => {
    setEditingWorkout(workout);
    setCurrentView('logging');
  }, []);

  const handleDeleteWorkout = useCallback(
    (workoutId: string) => {
      Alert.alert('Delete workout', 'Are you sure you want to delete this workout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWorkouts((previous) => previous.filter((workout) => workout.id !== workoutId));
          },
        },
      ]);
    },
    [setWorkouts]
  );

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={styles.loadingText}>Loading your sessions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="barbell" size={28} color="#60a5fa" />
            <Text style={styles.headerTitle}>Gym Tracker</Text>
          </View>
          {currentView === 'logging' && (
            <TouchableOpacity
              onPress={() => setCurrentView('history')}
              style={styles.headerButton}
            >
              <Ionicons name="time-outline" size={18} color="#f9fafb" />
              <Text style={styles.headerButtonText}>History</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          {currentView === 'history' ? (
            <WorkoutHistory workouts={workouts} onEdit={handleEditWorkout} onDelete={handleDeleteWorkout} />
          ) : (
            <WorkoutForm
              onSave={handleSaveWorkout}
              onCancel={() => {
                setCurrentView('history');
                setEditingWorkout(null);
              }}
              existingWorkout={editingWorkout}
            />
          )}
        </View>

        {currentView === 'history' && (
          <TouchableOpacity
            style={styles.fab}
            onPress={handleStartNewWorkout}
            accessibilityRole="button"
            accessibilityLabel="Start new workout"
          >
            <Ionicons name="add" size={30} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111c33',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1f2a44',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginLeft: 12,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  headerButtonText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: '#cbd5f5',
    fontSize: 16,
    marginTop: 12,
  },
});

export default App;
