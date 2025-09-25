
import React, { useState, useCallback } from 'react';
import { WorkoutSession } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutForm from './components/WorkoutForm';
import { PlusIcon, HistoryIcon } from './components/icons/Icons';

type View = 'history' | 'logging';

const App: React.FC = () => {
  const [workouts, setWorkouts] = useLocalStorage<WorkoutSession[]>('workouts', []);
  const [currentView, setCurrentView] = useState<View>('history');
  const [editingWorkout, setEditingWorkout] = useState<WorkoutSession | null>(null);

  const handleSaveWorkout = useCallback((workout: WorkoutSession) => {
    // Check if it's an existing workout being edited
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    if (existingIndex > -1) {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[existingIndex] = workout;
        setWorkouts(updatedWorkouts);
    } else {
        setWorkouts(prevWorkouts => [workout, ...prevWorkouts]);
    }
    setCurrentView('history');
    setEditingWorkout(null);
  }, [workouts, setWorkouts]);

  const handleStartNewWorkout = () => {
    setEditingWorkout(null);
    setCurrentView('logging');
  };
  
  const handleEditWorkout = (workout: WorkoutSession) => {
    setEditingWorkout(workout);
    setCurrentView('logging');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if(window.confirm('Are you sure you want to delete this workout?')) {
        setWorkouts(workouts.filter(w => w.id !== workoutId));
    }
  };

  const Header = () => (
    <header className="bg-dark-card p-4 shadow-lg sticky top-0 z-10 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z" /></svg>
        <h1 className="text-2xl font-bold text-dark-text-primary">Gym Tracker</h1>
      </div>
      {currentView === 'logging' && (
         <button onClick={() => setCurrentView('history')} className="flex items-center gap-2 px-4 py-2 bg-dark-bg text-brand-accent rounded-lg hover:bg-slate-600 transition-colors">
            <HistoryIcon className="w-5 h-5" />
            <span>History</span>
        </button>
      )}
    </header>
  );

  return (
    <div className="min-h-screen bg-dark-bg font-sans">
      <Header />
      <main className="p-4 pb-24">
        {currentView === 'history' && (
          <WorkoutHistory 
            workouts={workouts} 
            onEdit={handleEditWorkout}
            onDelete={handleDeleteWorkout}
            />
        )}
        {currentView === 'logging' && (
          <WorkoutForm 
            onSave={handleSaveWorkout} 
            onCancel={() => { setCurrentView('history'); setEditingWorkout(null); }}
            existingWorkout={editingWorkout}
          />
        )}
      </main>
      {currentView === 'history' && (
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleStartNewWorkout}
            className="bg-brand-primary text-white rounded-full p-4 shadow-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-accent transition-transform duration-200 ease-in-out hover:scale-110"
            aria-label="Start new workout"
          >
            <PlusIcon className="h-8 w-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
