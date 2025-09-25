
import React from 'react';
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
      <div className="text-center py-16 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        <h2 className="mt-4 text-2xl font-semibold text-dark-text-primary">No Workouts Logged</h2>
        <p className="mt-2 text-dark-text-secondary">
          Tap the '+' button to log your first session and start your fitness journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-dark-text-primary">Workout History</h2>
      {workouts.map(workout => (
        <WorkoutCard key={workout.id} workout={workout} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WorkoutHistory;
