# Design Document - Weighted Scoring System

## Overview

The weighted scoring system will replace the current simple count-based scoring with a more sophisticated algorithm that balances accuracy and speed. The system will calculate a final score out of 10 by combining:
- 50% weight for accuracy (correct answers / total questions)
- 50% weight for time performance (faster completion = higher score)

## Architecture

The scoring calculation will be implemented as a utility function that can be called from the MatchingScreen component before passing the score to the ResultsScreen. This maintains separation of concerns while ensuring consistent scoring logic.

### Current Flow
```
MatchingScreen -> handleSubmit() -> onComplete(correctCount, timeTaken)
App -> handleMatchingComplete() -> stores score and timeTaken
ResultsScreen -> displays score/totalQuestions
```

### New Flow
```
MatchingScreen -> handleSubmit() -> calculateWeightedScore() -> onComplete(weightedScore, timeTaken)
App -> handleMatchingComplete() -> stores weightedScore and timeTaken  
ResultsScreen -> displays weightedScore out of 10
```

## Components and Interfaces

### Scoring Utility Function

```typescript
interface ScoreCalculationParams {
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  timeLimit: number; // in seconds (default 120)
}

interface ScoreResult {
  totalScore: number; // out of 10
  accuracyScore: number; // out of 5
  timeScore: number; // out of 5
  accuracyPercentage: number; // 0-100
}

function calculateWeightedScore(params: ScoreCalculationParams): ScoreResult
```

### Updated Component Interfaces

**MatchingScreen**: No interface changes needed, but internal logic will use the new scoring function.

**ResultsScreen**: Interface will be updated to handle the new scoring display:
```typescript
interface ResultsScreenProps {
  score: number; // Now represents weighted score out of 10
  totalQuestions: number;
  timeTaken?: number;
  userEmail: string;
  onRestart: () => void;
}
```

## Data Models

### Scoring Algorithm

**Accuracy Component (50% weight, max 5 points):**
```
accuracyScore = (correctAnswers / totalQuestions) * 5
```

**Time Component (50% weight, max 5 points):**
```
timeScore = Math.max(0, (timeLimit - timeTaken) / timeLimit * 5)
```

**Total Score:**
```
totalScore = Math.round((accuracyScore + timeScore) * 10) / 10
```

### Score Boundaries
- Maximum possible score: 10 (all correct + completed instantly)
- Minimum possible score: 0 (no correct answers, regardless of time)
- Time component ranges from 0 (took full time) to 5 (completed instantly)
- Accuracy component ranges from 0 (no correct) to 5 (all correct)

## Error Handling

### Input Validation
- Ensure `correctAnswers` is not negative and not greater than `totalQuestions`
- Ensure `timeTaken` is not negative and not greater than `timeLimit`
- Handle edge cases where `totalQuestions` is 0
- Handle edge cases where `timeLimit` is 0

### Fallback Behavior
- If scoring calculation fails, fall back to current simple scoring method
- Log errors for debugging while maintaining user experience
- Ensure score is always a valid number between 0 and 10

## Testing Strategy

### Unit Tests
1. **Scoring Algorithm Tests:**
   - Test perfect score (all correct, 0 time)
   - Test minimum score (no correct answers)
   - Test balanced scenarios (some correct, various times)
   - Test edge cases (exactly at time limit, exactly half correct)
   - Test boundary conditions (negative inputs, zero values)

2. **Component Integration Tests:**
   - Test MatchingScreen calls scoring function correctly
   - Test ResultsScreen displays weighted score properly
   - Test API payload includes correct weighted score

### Test Cases Examples
```typescript
// Perfect performance
expect(calculateWeightedScore({
  correctAnswers: 5, totalQuestions: 5, timeTaken: 0, timeLimit: 120
})).toEqual({ totalScore: 10, accuracyScore: 5, timeScore: 5, accuracyPercentage: 100 });

// No correct answers
expect(calculateWeightedScore({
  correctAnswers: 0, totalQuestions: 5, timeTaken: 60, timeLimit: 120
})).toEqual({ totalScore: 0, accuracyScore: 0, timeScore: 2.5, accuracyPercentage: 0 });

// Balanced performance
expect(calculateWeightedScore({
  correctAnswers: 3, totalQuestions: 5, timeTaken: 60, timeLimit: 120
})).toEqual({ totalScore: 5.5, accuracyScore: 3, timeScore: 2.5, accuracyPercentage: 60 });
```

### Integration Testing
- Test complete game flow with new scoring
- Verify API webhook receives correct weighted score
- Test results screen displays appropriate success/failure states based on weighted score
- Test scoring consistency across different game levels (new-to-ads vs ad-expert)

## Implementation Notes

### Backward Compatibility
- The API webhook will receive the weighted score in the existing `score` field
- Results screen logic for success/failure determination may need adjustment based on weighted scoring
- Consider whether success threshold should be based on weighted score (e.g., > 5) rather than just having any correct answers

### Performance Considerations
- Scoring calculation is lightweight and can be performed synchronously
- No additional API calls or async operations required
- Minimal impact on existing game performance

### Display Considerations
- Results screen should clearly show the score is "out of 10"
- Consider showing breakdown of accuracy vs time performance for user feedback
- Maintain existing visual design while updating score presentation