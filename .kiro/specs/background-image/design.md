# Design Document

## Overview

This design implements a consistent background image (s1.png) across all screens in the Ads Memory application. The solution uses a centralized approach with CSS classes and a shared layout component to ensure maintainability and consistency.

## Architecture

The background image implementation follows a layered approach:

1. **CSS Layer**: Define background styles using Tailwind CSS utilities and custom CSS
2. **Component Layer**: Create a shared BackgroundWrapper component for consistent application
3. **Application Layer**: Apply the background wrapper to all screen components

## Components and Interfaces

### BackgroundWrapper Component

```typescript
interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
}
```

A reusable wrapper component that:
- Applies the s1.png background image
- Ensures proper scaling and positioning
- Maintains content readability with optional overlay
- Accepts additional className props for customization

### CSS Background Styles

Custom CSS classes for background implementation:
- `.bg-s1-image`: Main background image class
- `.bg-overlay`: Optional semi-transparent overlay for text readability
- Responsive utilities for different screen sizes

## Data Models

No new data models are required for this feature. The implementation only involves UI/styling changes.

## Error Handling

### Image Loading
- Fallback to gradient background if s1.png fails to load
- Graceful degradation for slow network connections
- Console warnings for missing image assets

### Browser Compatibility
- CSS fallbacks for older browsers
- Progressive enhancement approach
- Responsive design considerations

## Testing Strategy

### Visual Testing
- Verify background appears on all screens
- Test responsive behavior across device sizes
- Validate text readability over background

### Component Testing
- Unit tests for BackgroundWrapper component
- Props validation and className merging
- Children rendering verification

### Integration Testing
- Test background consistency across screen transitions
- Verify performance impact is minimal
- Cross-browser compatibility testing

## Implementation Approach

### Phase 1: Create Shared Background Component
- Implement BackgroundWrapper component
- Define CSS styles for background image
- Add proper image optimization

### Phase 2: Apply to Existing Screens
- Wrap each screen component with BackgroundWrapper
- Remove existing background classes from individual components
- Ensure proper z-index layering for content

### Phase 3: Optimization and Testing
- Optimize image loading and caching
- Test across different screen sizes
- Validate accessibility and readability

## Technical Considerations

### Performance
- Use CSS `background-image` for better performance than `<img>` tags
- Implement proper image caching headers
- Consider image compression and format optimization

### Accessibility
- Ensure sufficient contrast between background and text
- Provide alternative styling for high contrast mode
- Test with screen readers for content accessibility

### Responsive Design
- Use `background-size: cover` for full coverage
- Implement `background-position: center` for proper centering
- Add media queries for mobile-specific adjustments

## File Structure

```
src/
├── components/
│   ├── shared/
│   │   └── BackgroundWrapper.tsx
│   ├── RegistrationScreen.tsx (updated)
│   ├── SelectionScreen.tsx (updated)
│   ├── MemorizingScreen.tsx (updated)
│   ├── MatchingScreen.tsx (updated)
│   └── ResultsScreen.tsx (updated)
├── styles/
│   └── background.css (if needed)
└── public/
    └── s1.png
```