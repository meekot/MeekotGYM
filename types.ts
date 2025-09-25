
export interface SetData {
  id: string;
  reps: number;
  weight: number;
}

export interface Exercise {
  id:string;
  name: string;
  sets: SetData[];
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string format
  exercises: Exercise[];
  name?: string;
}
