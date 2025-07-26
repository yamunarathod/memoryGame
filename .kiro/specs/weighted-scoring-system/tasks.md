# Implementation Plan

- [x] 1. Create scoring utility function with comprehensive logic


  - Create new utility file `src/utils/scoring.ts` with TypeScript interfaces and scoring calculation function
  - Implement weighted scoring algorithm that combines accuracy (50%) and time performance (50%)
  - Add input validation and error handling for edge cases
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3, 3.4, 3.5_



- [ ] 2. Write comprehensive unit tests for scoring function
  - Create test file `src/utils/scoring.test.ts` with test cases for all scoring scenarios
  - Test perfect score, minimum score, balanced performance, and edge cases


  - Verify scoring algorithm accuracy and boundary conditions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Update MatchingScreen component to use weighted scoring


  - Modify `handleSubmit` function in `src/components/MatchingScreen.tsx` to import and use the new scoring utility
  - Replace simple count-based scoring with weighted score calculation
  - Ensure correct parameters are passed to scoring function (correct answers, total questions, time taken, time limit)
  - _Requirements: 1.1, 1.2, 1.3_



- [ ] 4. Update ResultsScreen component to display weighted score properly
  - Modify `src/components/ResultsScreen.tsx` to show score as "X out of 10" format
  - Update success/failure logic to work with weighted scoring instead of simple count



  - Ensure API webhook payload uses the weighted score value
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Clean up unused code and fix TypeScript warnings
  - Remove unused imports in ResultsScreen component (Trophy, RotateCcw from lucide-react)
  - Remove unused variables (percentage, countdown) or implement their usage
  - Remove unused React import in App.tsx component
  - _Requirements: General code quality_

- [ ] 6. Test complete game flow with new scoring system
  - Create integration test or manual test to verify end-to-end scoring functionality
  - Test that weighted scores are correctly calculated and displayed throughout the game flow
  - Verify API webhook receives correct weighted score values
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4_