# Design Document

## Overview

This design adds comprehensive touch support to the existing MatchingScreen component's drag-and-drop functionality. The solution will implement a unified interaction system that handles both mouse and touch events seamlessly, providing consistent behavior across all device types while maintaining the existing game logic and visual design.

## Architecture

### Current State Analysis
The existing MatchingScreen component uses HTML5 drag-and-drop API with:
- `draggable` attribute on answer items
- `onDragStart`, `onDragOver`, and `onDrop` event handlers
- State management for `draggedItem` and `draggedIndex`
- Visual feedback through CSS classes and state

### Proposed Architecture
The solution will implement a hybrid approach that:
1. Maintains existing HTML5 drag-and-drop for mouse interactions
2. Adds touch event handlers for mobile devices
3. Uses a unified state management system for both interaction types
4. Provides consistent visual feedback regardless of input method

## Components and Interfaces

### Enhanced State Management

```typescript
interface TouchDragState {
  isDragging: boolean;
  draggedItem: string | null;
  draggedIndex: number | null;
  touchStartPosition: { x: number; y: number } | null;
  currentTouchPosition: { x: number; y: number } | null;
  dragPreviewElement: HTMLElement | null;
  hoveredDropZone: number | null;
}
```

### Touch Event Handlers

```typescript
interface TouchHandlers {
  handleTouchStart: (e: React.TouchEvent, item: string, index: number) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleTouchCancel: (e: React.TouchEvent) => void;
}
```

### Drag Preview Component

```typescript
interface DragPreviewProps {
  item: string;
  position: { x: number; y: number };
  isVisible: boolean;
}
```

## Data Models

### Enhanced Component State
The existing state will be extended with touch-specific properties:

```typescript
const [touchDragState, setTouchDragState] = useState<TouchDragState>({
  isDragging: false,
  draggedItem: null,
  draggedIndex: null,
  touchStartPosition: null,
  currentTouchPosition: null,
  dragPreviewElement: null,
  hoveredDropZone: null,
});
```

### Unified Drag State
A computed state that combines mouse and touch drag information:

```typescript
const unifiedDragState = {
  isDragging: draggedItem !== null || touchDragState.isDragging,
  currentItem: draggedItem || touchDragState.draggedItem,
  currentIndex: draggedIndex ?? touchDragState.draggedIndex,
};
```

## Implementation Strategy

### Phase 1: Touch Event Infrastructure
1. Add touch event listeners to answer items
2. Implement basic touch start/move/end handling
3. Create drag preview element for visual feedback
4. Prevent default touch behaviors (scrolling, selection)

### Phase 2: Touch Drag Logic
1. Implement touch-based drag initiation
2. Add real-time position tracking during touch move
3. Create drop zone detection using element coordinates
4. Implement touch-based drop completion

### Phase 3: Visual Feedback Enhancement
1. Create floating drag preview element
2. Add drop zone highlighting for touch interactions
3. Implement smooth animations and transitions
4. Ensure consistent styling across input methods

### Phase 4: Integration and Optimization
1. Merge touch and mouse event handling
2. Optimize performance for smooth 60fps interactions
3. Add accessibility improvements
4. Implement comprehensive error handling

## Technical Implementation Details

### Touch Event Handling Strategy

```typescript
const handleTouchStart = (e: React.TouchEvent, item: string, index: number) => {
  e.preventDefault(); // Prevent scrolling and text selection
  const touch = e.touches[0];
  
  setTouchDragState({
    isDragging: true,
    draggedItem: item,
    draggedIndex: index,
    touchStartPosition: { x: touch.clientX, y: touch.clientY },
    currentTouchPosition: { x: touch.clientX, y: touch.clientY },
    dragPreviewElement: null,
    hoveredDropZone: null,
  });
};
```

### Drop Zone Detection Algorithm

```typescript
const findDropZoneAtPosition = (x: number, y: number): number | null => {
  const elements = document.elementsFromPoint(x, y);
  const dropZone = elements.find(el => el.hasAttribute('data-drop-zone'));
  return dropZone ? parseInt(dropZone.getAttribute('data-drop-zone-index') || '-1') : null;
};
```

### Drag Preview Implementation

```typescript
const DragPreview: React.FC<DragPreviewProps> = ({ item, position, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div
      className="fixed pointer-events-none z-50 bg-white p-4 rounded-lg border-2 border-blue-400 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {item}
    </div>
  );
};
```

## Error Handling

### Touch Event Error Scenarios
1. **Multiple Touch Points**: Handle only the first touch, ignore additional touches
2. **Touch Interruption**: Clean up state if touch events are cancelled
3. **Invalid Drop Zones**: Provide feedback and return item to original position
4. **Performance Issues**: Throttle touch move events to maintain 60fps

### Fallback Mechanisms
1. **Touch API Unavailable**: Gracefully degrade to mouse-only functionality
2. **Browser Compatibility**: Provide polyfills for older browsers
3. **Performance Degradation**: Reduce visual effects if frame rate drops

## Testing Strategy

### Unit Tests
1. Touch event handler functions
2. Drop zone detection algorithm
3. State management logic
4. Visual feedback components

### Integration Tests
1. Complete touch drag-and-drop workflows
2. Mouse and touch interaction compatibility
3. Game logic preservation during touch interactions
4. Performance under various device conditions

### Device Testing
1. iOS Safari (iPhone/iPad)
2. Android Chrome (various screen sizes)
3. Desktop browsers with touch screens
4. Accessibility testing with screen readers

## Performance Considerations

### Optimization Strategies
1. **Event Throttling**: Limit touch move events to 60fps maximum
2. **DOM Queries**: Cache drop zone elements to avoid repeated queries
3. **State Updates**: Batch state updates to prevent unnecessary re-renders
4. **Memory Management**: Clean up event listeners and references properly

### Performance Metrics
- Touch response time: < 100ms
- Drag smoothness: 60fps during movement
- Memory usage: No memory leaks during extended gameplay
- Battery impact: Minimal additional battery drain on mobile devices

## Accessibility Enhancements

### Screen Reader Support
1. Add ARIA live regions for drag-and-drop announcements
2. Provide alternative keyboard navigation for drag-and-drop
3. Ensure proper focus management during interactions
4. Add descriptive labels for all interactive elements

### Motor Accessibility
1. Increase touch target sizes for easier interaction
2. Add configurable drag sensitivity settings
3. Provide alternative interaction methods for users with limited mobility
4. Implement gesture timeout settings for users who need more time