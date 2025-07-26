# Requirements Document

## Introduction

This feature updates the existing registration screen to collect user email addresses instead of names. The change will improve user identification and enable email-based communication while maintaining the same user experience and visual design.

## Requirements

### Requirement 1

**User Story:** As a user, I want to register with my email address instead of my name, so that I can be uniquely identified and contacted via email.

#### Acceptance Criteria

1. WHEN the registration screen loads THEN the system SHALL display an email input field instead of a name input field
2. WHEN a user enters an email address THEN the system SHALL validate that it follows proper email format
3. WHEN a user submits a valid email THEN the system SHALL call the onSubmit callback with the email address
4. WHEN a user submits an invalid email THEN the system SHALL display an appropriate error message
5. WHEN a user submits an empty email field THEN the system SHALL prevent form submission and show validation feedback

### Requirement 2

**User Story:** As a user, I want clear visual feedback about email validation, so that I understand what input is expected and can correct any errors.

#### Acceptance Criteria

1. WHEN a user enters an invalid email format THEN the system SHALL provide real-time visual feedback
2. WHEN a user focuses on the email field THEN the system SHALL show appropriate placeholder text indicating email format
3. WHEN email validation fails THEN the system SHALL display a clear error message below the input field
4. WHEN email validation passes THEN the system SHALL remove any error messages and show positive feedback

### Requirement 3

**User Story:** As a developer, I want the registration component interface to remain backward compatible, so that existing parent components continue to work without modification.

#### Acceptance Criteria

1. WHEN the component is used THEN the system SHALL maintain the same onSubmit prop interface
2. WHEN onSubmit is called THEN the system SHALL pass the email string as the parameter instead of name
3. WHEN the component renders THEN the system SHALL maintain the same visual styling and layout as the current name-based version