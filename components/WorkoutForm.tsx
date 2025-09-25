
import React, { useState, useEffect } from 'react';
import { WorkoutSession, Exercise } from '../types';
import ExerciseForm from './ExerciseForm';
import { PlusIcon } from './icons/Icons';

interface WorkoutFormProps {
  onSave: (workout: WorkoutSession) => void;
  onCancel: () => void;
  existingWorkout: WorkoutSession | null;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave, onCancel, existingWorkout }) => {
  const [workout, setWorkout] = useState<WorkoutSession>(
    existingWorkout || {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: `Workout ${new Date().toLocaleDateString()}`,
      exercises: [],
    }
  );

  useEffect(() => {
    if (existingWorkout) {
      setWorkout(existingWorkout);
    }
  }, [existingWorkout]);

  const handleExerciseChange = (updatedExercise: Exercise) => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    }));
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      sets: [{ id: Date.now().toString(), reps: 8, weight: 0 }],
    };
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exercises: [...prevWorkout.exercises, newExercise],
    }));
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter(ex => ex.id !== exerciseId),
    }));
  };
  
  const handleSave = () => {
    // Filter out exercises with no name
    const cleanedWorkout = {
        ...workout,
        exercises: workout.exercises.filter(ex => ex.name.trim() !== '')
    };
    if (cleanedWorkout.exercises.length === 0) {
        alert("Please add at least one exercise.");
        return;
    }
    onSave(cleanedWorkout);
  }

  return (
    <div className="bg-dark-card p-4 sm:p-6 rounded-lg shadow-xl space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-dark-text-primary mb-2">
        {existingWorkout ? 'Edit Workout' : 'Log New Workout'}
      </h2>
      <input
        type="text"
        value={workout.name}
        onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
        placeholder="Workout Name (e.g., Push Day)"
        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => (
          <ExerciseForm
            key={exercise.id}
            exercise={exercise}
            onChange={handleExerciseChange}
            onRemove={() => removeExercise(exercise.id)}
            exerciseNumber={index + 1}
          />
        ))}
      </div>
      <button
        onClick={addExercise}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-dark-bg hover:bg-slate-600 text-brand-accent rounded-lg transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Add Exercise</span>
      </button>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="py-2 px-6 bg-dark-border text-dark-text-primary rounded-lg hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="py-2 px-6 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
        >
          {existingWorkout ? 'Update Workout' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutForm;
