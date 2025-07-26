# Requirements Document

## Introduction

This feature enhances the current scoring system in the Ads Memory game to provide a more balanced evaluation of player performance. Instead of only counting correct matches, the new system will calculate a weighted score that considers both accuracy (correct answers) and speed (time taken), with each factor contributing 50% to the final score out of 10.

## Requirements

### Requirement 1

**User Story:** As a player, I want my final score to reflect both my accuracy and speed, so that I'm rewarded for both getting answers right and completing the game quickly.

#### Acceptance Criteria

1. WHEN a player completes the matching game THEN the system SHALL calculate a weighted score out of 10
2. WHEN calculating the weighted score THEN the system SHALL give 50% weight to accuracy (correct matches)
3. WHEN calculating the weighted score THEN the system SHALL give 50% weight to time performance
4. WHEN a player gets all answers correct in minimum time THEN the system SHALL award a score of 10
5. WHEN a player gets no answers correct THEN the system SHALL award a score of 0 regardless of time

### Requirement 2

**User Story:** As a player, I want to understand how my score was calculated, so that I can see the breakdown of my performance.

#### Acceptance Criteria

1. WHEN the results screen is displayed THEN the system SHALL show the total weighted score out of 10
2. WHEN the results screen is displayed THEN the system SHALL display the number of correct answers
3. WHEN the results screen is displayed THEN the system SHALL display the time taken
4. WHEN the results screen is displayed THEN the system SHALL maintain the current visual feedback for success/failure

### Requirement 3

**User Story:** As a developer, I want the scoring algorithm to be fair and consistent, so that players with similar performance get similar scores.

#### Acceptance Criteria

1. WHEN calculating the accuracy component THEN the system SHALL use the formula: (correct_answers / total_questions) * 5
2. WHEN calculating the time component THEN the system SHALL use a time-based scoring that awards maximum points for fast completion and decreases linearly
3. WHEN the time limit is reached THEN the system SHALL award 0 points for the time component
4. WHEN a player completes in 0 seconds THEN the system SHALL award 5 points for the time component
5. WHEN a player takes the full 120 seconds THEN the system SHALL award 0 points for the time component