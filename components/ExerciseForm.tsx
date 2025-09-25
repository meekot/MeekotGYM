
import React, { useState } from 'react';
import { Exercise, SetData } from '../types';
import { PlusIcon, TrashIcon, SparklesIcon } from './icons/Icons';
import { getExerciseSuggestion } from '../services/geminiService';

interface ExerciseFormProps {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onRemove: () => void;
  exerciseNumber: number;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ exercise, onChange, onRemove, exerciseNumber }) => {
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [muscleGroup, setMuscleGroup] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...exercise, name: e.target.value });
  };

  const handleSetChange = (setId: string, field: 'reps' | 'weight', value: number) => {
    const updatedSets = exercise.sets.map(set =>
      set.id === setId ? { ...set, [field]: value < 0 ? 0 : value } : set
    );
    onChange({ ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    const lastSet = exercise.sets[exercise.sets.length - 1] || { reps: 8, weight: 0 };
    const newSet: SetData = {
      id: Date.now().toString(),
      reps: lastSet.reps,
      weight: lastSet.weight,
    };
    onChange({ ...exercise, sets: [...exercise.sets, newSet] });
  };

  const removeSet = (setId: string) => {
    if (exercise.sets.length <= 1) return; // Don't remove the last set
    const updatedSets = exercise.sets.filter(set => set.id !== setId);
    onChange({ ...exercise, sets: updatedSets });
  };

  const handleGetSuggestion = async () => {
    setIsSuggesting(true);
    const suggestion = await getExerciseSuggestion(muscleGroup);
    if(suggestion && !suggestion.includes("Couldn't get a suggestion")) {
        onChange({ ...exercise, name: suggestion });
    } else {
        alert(suggestion);
    }
    setIsSuggesting(false);
    setMuscleGroup('');
  }

  return (
    <div className="bg-dark-bg p-4 rounded-lg border border-dark-border">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-dark-text-primary">
          <span className="text-brand-accent">#{exerciseNumber}</span> Exercise
        </h3>
        <button onClick={onRemove} className="text-slate-400 hover:text-red-500">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-3">
        <input
          type="text"
          value={exercise.name}
          onChange={handleNameChange}
          placeholder="Exercise Name (e.g., Bench Press)"
          className="w-full bg-slate-800 border border-dark-border rounded-lg px-3 py-2 text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
        <div className="flex gap-2 mt-2">
            <input
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                placeholder="Muscle Group (e.g., chest)"
                className="flex-grow bg-slate-800 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-dark-text-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestion()}
            />
            <button
                onClick={handleGetSuggestion}
                disabled={isSuggesting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:bg-slate-500"
            >
                <SparklesIcon className="w-4 h-4" />
                <span className="text-sm">{isSuggesting ? 'Thinking...' : 'Suggest'}</span>
            </button>
        </div>
      </div>
      
      {/* Sets Header */}
      <div className="grid grid-cols-12 gap-2 items-center mb-2 px-2 text-dark-text-secondary text-sm">
        <div className="col-span-2 font-semibold">Set</div>
        <div className="col-span-4 font-semibold text-center">Weight (kg)</div>
        <div className="col-span-4 font-semibold text-center">Reps</div>
        <div className="col-span-2"></div>
      </div>

      {exercise.sets.map((set, index) => (
        <div key={set.id} className="grid grid-cols-12 gap-2 items-center mb-2">
          <div className="col-span-2 flex items-center justify-center h-10 w-10 text-brand-accent font-bold text-lg">{index + 1}</div>
          <div className="col-span-4">
            <input
              type="number"
              value={set.weight}
              onChange={e => handleSetChange(set.id, 'weight', parseFloat(e.target.value) || 0)}
              className="w-full text-center bg-slate-800 border border-dark-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="col-span-4">
            <input
              type="number"
              value={set.reps}
              onChange={e => handleSetChange(set.id, 'reps', parseInt(e.target.value) || 0)}
              className="w-full text-center bg-slate-800 border border-dark-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="col-span-2 flex justify-center">
            {exercise.sets.length > 1 && (
              <button onClick={() => removeSet(set.id)} className="text-slate-400 hover:text-red-500">
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addSet}
        className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-slate-600/50 hover:bg-slate-600 text-dark-text-secondary rounded-md transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        <span>Add Set</span>
      </button>
    </div>
  );
};

export default ExerciseForm;
