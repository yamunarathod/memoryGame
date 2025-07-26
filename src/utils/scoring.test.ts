import { describe, it, expect } from 'vitest';
import { calculateWeightedScore, ScoreCalculationParams } from './scoring';

describe('calculateWeightedScore', () => {
  describe('Perfect performance scenarios', () => {
    it('should return score of 10 for all correct answers with 0 time taken', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 5,
        totalQuestions: 5,
        timeTaken: 0,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(10);
      expect(result.accuracyScore).toBe(5);
      expect(result.timeScore).toBe(5);
      expect(result.accuracyPercentage).toBe(100);
    });
  });

  describe('Minimum performance scenarios', () => {
    it('should return score of 0 for no correct answers regardless of time', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 0,
        totalQuestions: 5,
        timeTaken: 60,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(2.5);
      expect(result.accuracyScore).toBe(0);
      expect(result.timeScore).toBe(2.5);
      expect(result.accuracyPercentage).toBe(0);
    });

    it('should return score of 5 for all correct answers but full time used', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 5,
        totalQuestions: 5,
        timeTaken: 120,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(5);
      expect(result.accuracyScore).toBe(5);
      expect(result.timeScore).toBe(0);
      expect(result.accuracyPercentage).toBe(100);
    });
  });

  describe('Balanced performance scenarios', () => {
    it('should calculate correct score for 60% accuracy and 50% time performance', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 3,
        totalQuestions: 5,
        timeTaken: 60,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(5.5);
      expect(result.accuracyScore).toBe(3);
      expect(result.timeScore).toBe(2.5);
      expect(result.accuracyPercentage).toBe(60);
    });

    it('should calculate correct score for 80% accuracy and 25% time performance', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 4,
        totalQuestions: 5,
        timeTaken: 90,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(5.3);
      expect(result.accuracyScore).toBe(4);
      expect(result.timeScore).toBe(1.3);
      expect(result.accuracyPercentage).toBe(80);
    });
  });

  describe('Edge cases', () => {
    it('should handle exactly half correct answers', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 2,
        totalQuestions: 4,
        timeTaken: 30,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(6.3);
      expect(result.accuracyScore).toBe(2.5);
      expect(result.timeScore).toBe(3.8);
      expect(result.accuracyPercentage).toBe(50);
    });

    it('should handle time taken exceeding time limit', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 3,
        totalQuestions: 5,
        timeTaken: 150, // Exceeds 120 second limit
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(3);
      expect(result.accuracyScore).toBe(3);
      expect(result.timeScore).toBe(0);
      expect(result.accuracyPercentage).toBe(60);
    });

    it('should handle single question scenarios', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 1,
        totalQuestions: 1,
        timeTaken: 30,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(8.8);
      expect(result.accuracyScore).toBe(5);
      expect(result.timeScore).toBe(3.8);
      expect(result.accuracyPercentage).toBe(100);
    });
  });

  describe('Input validation', () => {
    it('should throw error for zero total questions', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 0,
        totalQuestions: 0,
        timeTaken: 60,
        timeLimit: 120
      };

      expect(() => calculateWeightedScore(params)).toThrow('Total questions must be greater than 0');
    });

    it('should throw error for negative correct answers', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: -1,
        totalQuestions: 5,
        timeTaken: 60,
        timeLimit: 120
      };

      expect(() => calculateWeightedScore(params)).toThrow('Correct answers must be between 0 and total questions');
    });

    it('should throw error for correct answers exceeding total questions', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 6,
        totalQuestions: 5,
        timeTaken: 60,
        timeLimit: 120
      };

      expect(() => calculateWeightedScore(params)).toThrow('Correct answers must be between 0 and total questions');
    });

    it('should throw error for negative time taken', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 3,
        totalQuestions: 5,
        timeTaken: -10,
        timeLimit: 120
      };

      expect(() => calculateWeightedScore(params)).toThrow('Time taken cannot be negative');
    });

    it('should throw error for zero or negative time limit', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 3,
        totalQuestions: 5,
        timeTaken: 60,
        timeLimit: 0
      };

      expect(() => calculateWeightedScore(params)).toThrow('Time limit must be greater than 0');
    });
  });

  describe('Boundary conditions', () => {
    it('should handle exactly at time limit', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 2,
        totalQuestions: 5,
        timeTaken: 120,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      expect(result.totalScore).toBe(2);
      expect(result.accuracyScore).toBe(2);
      expect(result.timeScore).toBe(0);
      expect(result.accuracyPercentage).toBe(40);
    });

    it('should round scores to 1 decimal place', () => {
      const params: ScoreCalculationParams = {
        correctAnswers: 1,
        totalQuestions: 3,
        timeTaken: 40,
        timeLimit: 120
      };

      const result = calculateWeightedScore(params);

      // Check that all scores are rounded to 1 decimal place
      expect(result.totalScore.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
      expect(result.accuracyScore.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
      expect(result.timeScore.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
    });
  });
});