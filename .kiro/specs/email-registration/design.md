# Design Document

## Overview

This design outlines the modification of the existing RegistrationScreen component to collect and validate email addresses instead of names. The change maintains the current visual design and component interface while adding proper email validation and user feedback.

## Architecture

The solution maintains the existing React functional component architecture with the following key changes:

- Replace name state management with email state management
- Add email validation logic using standard email regex patterns
- Implement real-time validation feedback
- Maintain the same component props interface for backward compatibility

## Components and Interfaces

### RegistrationScreen Component

**Props Interface (unchanged):**
```typescript
interface RegistrationScreenProps {
  onSubmit: (email: string) => void; // Parameter semantically changes from name to email
}
```

**Internal State:**
```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [isValidEmail, setIsValidEmail] = useState(false);
```

**Key Methods:**
- `validateEmail(email: string): boolean` - Validates email format using regex
- `handleEmailChange(e: React.ChangeEvent<HTMLInputElement>)` - Handles input changes with real-time validation
- `handleSubmit(e: React.FormEvent)` - Validates and submits email

## Data Models

### Email Validation

**Email Format Validation:**
- Use standard email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Trim whitespace before validation
- Minimum length validation (basic email structure)

**Validation States:**
- Empty: No validation message shown
- Invalid format: Show "Please enter a valid email address"
- Valid format: Remove error messages, enable submission

## Error Handling

### Validation Error Handling

1. **Real-time Validation:**
   - Validate on input change (debounced to avoid excessive validation)
   - Show/hide error messages based on validation state
   - Update visual styling (red border for invalid, green for valid)

2. **Form Submission:**
   - Prevent submission if email is invalid or empty
   - Show validation error if user attempts to submit invalid email
   - Clear any existing errors on successful submission

3. **User Experience:**
   - Non-blocking validation (user can continue typing)
   - Clear error messages when user starts correcting input
   - Maintain focus on input field during validation

## Testing Strategy

### Unit Tests

1. **Component Rendering:**
   - Verify email input field renders with correct placeholder
   - Verify submit button is present and styled correctly
   - Verify component maintains existing visual styling

2. **Email Validation:**
   - Test valid email formats (standard cases)
   - Test invalid email formats (missing @, missing domain, etc.)
   - Test edge cases (empty string, whitespace only)

3. **User Interactions:**
   - Test email input changes update state correctly
   - Test form submission with valid email calls onSubmit
   - Test form submission with invalid email prevents submission
   - Test error message display and clearing

4. **Integration:**
   - Test component works with existing parent components
   - Test onSubmit callback receives correct email parameter
   - Test component maintains backward compatibility

### Manual Testing Scenarios

1. **Happy Path:**
   - Enter valid email → see no errors → submit successfully
   
2. **Validation Path:**
   - Enter invalid email → see error message → correct email → error clears → submit successfully
   
3. **Edge Cases:**
   - Submit empty form → see validation error
   - Enter email with spaces → spaces trimmed automatically
   - Enter very long email → handled gracefully

## Implementation Notes

- Maintain all existing Tailwind CSS classes for consistent styling
- Use the same form structure and event handling patterns
- Keep the same responsive design and accessibility features
- Preserve the existing gradient background and card styling
- Update placeholder text from "Enter your name" to "Enter your email address"
- Update the heading to remain "Ads Memory" (no change needed)