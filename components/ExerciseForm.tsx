import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Exercise, SetData } from '../types';
import { PlusIcon, SparklesIcon, TrashIcon } from './icons/Icons';
import { getExerciseSuggestion } from '../services/geminiService';

interface ExerciseFormProps {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onRemove: () => void;
  exerciseNumber: number;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onChange, onRemove, exerciseNumber }) => {
  const [muscleGroup, setMuscleGroup] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleNameChange = (text: string) => {
    onChange({ ...exercise, name: text });
  };

  const handleSetChange = (setId: string, field: 'reps' | 'weight', value: string) => {
    const numericValue = Number(value.replace(/[^0-9.]/g, ''));
    const safeValue = Number.isNaN(numericValue) ? 0 : numericValue;

    const updatedSets = exercise.sets.map((set) =>
      set.id === setId
        ? {
            ...set,
            [field]: field === 'reps' ? Math.round(Math.max(0, safeValue)) : Math.max(0, safeValue),
          }
        : set
    );

    onChange({ ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1] ?? { reps: 8, weight: 0 };
    const timestamp = Date.now().toString();
    const newSet: SetData = {
      id: `${timestamp}-set-${exercise.sets.length + 1}`,
      reps: lastSet.reps,
      weight: lastSet.weight,
    };

    onChange({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const removeSet = (setId: string) => {
    if (exercise.sets.length <= 1) {
      return;
    }

    onChange({ ...exercise, sets: exercise.sets.filter((set) => set.id !== setId) });
  };

  const handleGetSuggestion = async () => {
    if (!muscleGroup.trim()) {
      Alert.alert('Muscle group required', 'Please enter a muscle group to get a suggestion.');
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await getExerciseSuggestion(muscleGroup.trim());
      if (result.success && result.exercise) {
        onChange({ ...exercise, name: result.exercise });
      } else {
        Alert.alert('No suggestion', result.message ?? 'Please try again.');
      }
    } catch (error) {
      Alert.alert('No suggestion', 'Unable to fetch a suggestion right now.');
    } finally {
      setIsSuggesting(false);
      setMuscleGroup('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerNumber}>#{exerciseNumber}</Text> Exercise
        </Text>
        <TouchableOpacity onPress={onRemove}>
          <TrashIcon size={20} color="#f87171" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Exercise Name (e.g., Bench Press)"
        placeholderTextColor="#94a3b8"
        value={exercise.name}
        onChangeText={handleNameChange}
      />

      <View style={styles.suggestionRow}>
        <TextInput
          style={styles.suggestionInput}
          placeholder="Muscle Group (e.g., chest)"
          placeholderTextColor="#94a3b8"
          value={muscleGroup}
          onChangeText={setMuscleGroup}
          onSubmitEditing={handleGetSuggestion}
        />
        <TouchableOpacity
          style={[styles.suggestionButton, isSuggesting && styles.suggestionButtonDisabled]}
          onPress={handleGetSuggestion}
          disabled={isSuggesting}
        >
          {isSuggesting ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <SparklesIcon size={16} color="#ffffff" />
              <Text style={styles.suggestionText}>Suggest</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.setHeader}>
        <Text style={[styles.setHeaderText, styles.setHeaderLabel]}>Set</Text>
        <Text style={styles.setHeaderText}>Weight (kg)</Text>
        <Text style={styles.setHeaderText}>Reps</Text>
        <View style={styles.setHeaderSpacer} />
      </View>

      {exercise.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <View style={styles.setNumber}>
            <Text style={styles.setNumberText}>{index + 1}</Text>
          </View>
          <TextInput
            style={styles.setInput}
            keyboardType="numeric"
            value={String(set.weight)}
            onChangeText={(value) => handleSetChange(set.id, 'weight', value)}
          />
          <TextInput
            style={styles.setInput}
            keyboardType="numeric"
            value={String(set.reps)}
            onChangeText={(value) => handleSetChange(set.id, 'reps', value)}
          />
          <View style={styles.setActions}>
            {exercise.sets.length > 1 && (
              <TouchableOpacity onPress={() => removeSet(set.id)}>
                <TrashIcon size={18} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
        <PlusIcon size={16} color="#38bdf8" />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#1f2a44',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  headerNumber: {
    color: '#38bdf8',
    fontWeight: '700',
    marginRight: 4,
  },
  input: {
    backgroundColor: '#1f2a44',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    marginBottom: 12,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionInput: {
    flex: 1,
    backgroundColor: '#1f2a44',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    marginRight: 12,
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionButtonDisabled: {
    opacity: 0.6,
  },
  suggestionText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 6,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 6,
  },
  setHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#cbd5f5',
    textAlign: 'center',
  },
  setHeaderLabel: {
    textAlign: 'left',
  },
  setHeaderSpacer: {
    width: 28,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f2a44',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  setNumberText: {
    color: '#38bdf8',
    fontWeight: '700',
  },
  setInput: {
    flex: 1,
    backgroundColor: '#1f2a44',
    color: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    marginRight: 12,
  },
  setActions: {
    width: 32,
    alignItems: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#334155',
    paddingVertical: 10,
    marginTop: 12,
  },
  addSetText: {
    marginLeft: 6,
    color: '#38bdf8',
    fontWeight: '600',
  },
});

export default ExerciseForm;
