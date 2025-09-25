export interface ExerciseSuggestionResult {
  success: boolean;
  exercise?: string;
  message?: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333';

export const getExerciseSuggestion = async (
  muscleGroup: string
): Promise<ExerciseSuggestionResult> => {
  if (!muscleGroup.trim()) {
    return { success: false, message: 'Please specify a muscle group.' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/suggest-exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ muscleGroup }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: errorText || 'The suggestion service is unavailable. Please try again later.',
      };
    }

    const data = await response.json();
    if (data?.suggestion) {
      return { success: true, exercise: data.suggestion };
    }

    return {
      success: false,
      message: data?.message ?? 'No suggestion was returned. Please try again.',
    };
  } catch (error) {
    console.error('Error fetching exercise suggestion:', error);
    return {
      success: false,
      message: 'Unable to reach the suggestion service. Please try again later.',
    };
  }
};
