export interface ScoreCalculationParams {
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  timeLimit: number; // in seconds (default 120)
}

export interface ScoreResult {
  totalScore: number; // out of 10
  accuracyScore: number; // out of 5
  timeScore: number; // out of 5
  accuracyPercentage: number; // 0-100
}

/**
 * Calculates a weighted score based on accuracy and time performance
 * @param params - Scoring parameters including correct answers, total questions, time taken, and time limit
 * @returns ScoreResult with total score out of 10 and component breakdowns
 */
export function calculateWeightedScore(params: ScoreCalculationParams): ScoreResult {
  const { correctAnswers, totalQuestions, timeTaken, timeLimit } = params;

  // Input validation
  if (totalQuestions <= 0) {
    throw new Error('Total questions must be greater than 0');
  }
  
  if (correctAnswers < 0 || correctAnswers > totalQuestions) {
    throw new Error('Correct answers must be between 0 and total questions');
  }
  
  if (timeTaken < 0) {
    throw new Error('Time taken cannot be negative');
  }
  
  if (timeLimit <= 0) {
    throw new Error('Time limit must be greater than 0');
  }

  // Calculate accuracy component (50% weight, max 5 points)
  const accuracyScore = (correctAnswers / totalQuestions) * 5;
  const accuracyPercentage = (correctAnswers / totalQuestions) * 100;

  // Calculate time component (50% weight, max 5 points)
  // Linear decrease from 5 points (instant completion) to 0 points (full time used)
  const timeScore = Math.max(0, ((timeLimit - Math.min(timeTaken, timeLimit)) / timeLimit) * 5);

  // Calculate total score (round to 1 decimal place)
  const totalScore = Math.round((accuracyScore + timeScore) * 10) / 10;

  return {
    totalScore,
    accuracyScore: Math.round(accuracyScore * 10) / 10,
    timeScore: Math.round(timeScore * 10) / 10,
    accuracyPercentage: Math.round(accuracyPercentage)
  };
}