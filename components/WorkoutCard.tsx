
import React, { useState } from 'react';
import { WorkoutSession } from '../types';
import { ChevronDownIcon, EditIcon, TrashIcon } from './icons/Icons';

interface WorkoutCardProps {
  workout: WorkoutSession;
  onEdit: (workout: WorkoutSession) => void;
  onDelete: (workoutId: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const workoutDate = new Date(workout.date);
  const formattedDate = workoutDate.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalVolume = workout.exercises.reduce((acc, ex) => 
    acc + ex.sets.reduce((setAcc, set) => setAcc + (set.reps * set.weight), 0), 
  0);

  return (
    <div className="bg-dark-card rounded-lg shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-brand-accent font-semibold">{formattedDate}</p>
            <h3 className="text-xl font-bold text-dark-text-primary">{workout.name || 'Untitled Workout'}</h3>
            <p className="text-sm text-dark-text-secondary">
              {workout.exercises.length} Exercises • {totalSets} Sets • {totalVolume.toLocaleString()} kg Volume
            </p>
          </div>
          <ChevronDownIcon className={`w-6 h-6 text-dark-text-secondary transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-dark-border animate-fade-in">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="mt-4">
              <h4 className="font-semibold text-lg text-dark-text-primary">{exercise.name}</h4>
              <ul className="text-sm text-dark-text-secondary mt-1 ml-2">
                {exercise.sets.map((set, setIndex) => (
                  <li key={setIndex} className="flex justify-between py-1 border-b border-dark-bg">
                    <span>Set {setIndex + 1}</span>
                    <span className="font-mono">{set.weight} kg x {set.reps} reps</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
             <button onClick={() => onEdit(workout)} className="p-2 text-dark-text-secondary hover:text-brand-accent transition-colors rounded-full hover:bg-dark-bg">
                <EditIcon className="w-5 h-5"/>
             </button>
             <button onClick={() => onDelete(workout.id)} className="p-2 text-dark-text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-dark-bg">
                <TrashIcon className="w-5 h-5"/>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
