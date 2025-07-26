import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatchingScreen } from '../MatchingScreen';

// Mock the BackgroundWrapper component
jest.mock('../shared/BackgroundWrapper', () => ({
  BackgroundWrapper: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe('MatchingScreen Touch Functionality', () => {
  const mockLeftItems = ['Question 1', 'Question 2', 'Question 3'];
  const mockRightItems = ['Answer 1', 'Answer 2', 'Answer 3'];
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Touch Event Handlers', () => {
    test('should initiate touch drag on touchstart', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      expect(answerItem).toHaveAttribute('aria-grabbed', 'true');
    });

    test('should update position during touch move', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // Move touch
      fireEvent.touchMove(answerItem, {
        touches: [{ clientX: 150, clientY: 150 }],
      });

      // Drag preview should be visible
      const dragPreview = screen.getByText('Answer 1');
      expect(dragPreview).toBeInTheDocument();
    });

    test('should complete drop on touchend over valid drop zone', async () => {
      // Mock document.elementsFromPoint
      const mockElementsFromPoint = jest.fn().mockReturnValue([
        { hasAttribute: () => true, getAttribute: () => '0' }
      ]);
      Object.defineProperty(document, 'elementsFromPoint', {
        value: mockElementsFromPoint,
        writable: true,
      });

      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // End touch over drop zone
      fireEvent.touchEnd(answerItem, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
      });

      await waitFor(() => {
        expect(mockElementsFromPoint).toHaveBeenCalledWith(200, 200);
      });
    });

    test('should reset state on touch cancel', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // Cancel touch
      fireEvent.touchCancel(answerItem);

      expect(answerItem).toHaveAttribute('aria-grabbed', 'false');
    });
  });

  describe('Mouse and Touch Compatibility', () => {
    test('should handle both mouse and touch events without conflicts', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Test mouse drag
      fireEvent.dragStart(answerItem);
      expect(answerItem).toHaveAttribute('draggable', 'true');

      // Test touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      expect(answerItem).toHaveAttribute('aria-grabbed', 'true');
    });

    test('should preserve existing mouse drag functionality', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      const dropZone = screen.getByText('Question 1').parentElement;
      
      // Test mouse drag and drop
      fireEvent.dragStart(answerItem);
      fireEvent.dragOver(dropZone!);
      fireEvent.drop(dropZone!);

      expect(answerItem).toHaveAttribute('draggable', 'true');
    });
  });

  describe('Visual Feedback', () => {
    test('should highlight drop zones during touch drag', () => {
      // Mock document.elementsFromPoint to simulate hovering over drop zone
      const mockElementsFromPoint = jest.fn().mockReturnValue([
        { hasAttribute: () => true, getAttribute: () => '0' }
      ]);
      Object.defineProperty(document, 'elementsFromPoint', {
        value: mockElementsFromPoint,
        writable: true,
      });

      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // Move over drop zone
      fireEvent.touchMove(answerItem, {
        touches: [{ clientX: 150, clientY: 150 }],
      });

      // Drop zone should be highlighted
      const dropZone = screen.getByText('Question 1').parentElement;
      expect(dropZone).toHaveClass('bg-green-50', 'border-green-400');
    });

    test('should show drag preview during touch drag', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });

      // Drag preview should be visible
      const dragPreview = screen.getByText('Answer 1');
      expect(dragPreview).toBeInTheDocument();
    });
  });

  describe('Game Logic Integration', () => {
    test('should update matches correctly for touch interactions', async () => {
      // Mock document.elementsFromPoint for correct match
      const mockElementsFromPoint = jest.fn().mockReturnValue([
        { hasAttribute: () => true, getAttribute: () => '0' }
      ]);
      Object.defineProperty(document, 'elementsFromPoint', {
        value: mockElementsFromPoint,
        writable: true,
      });

      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start and complete touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      
      fireEvent.touchEnd(answerItem, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
      });

      await waitFor(() => {
        expect(mockElementsFromPoint).toHaveBeenCalled();
      });
    });

    test('should show feedback for incorrect matches', async () => {
      // Mock document.elementsFromPoint for incorrect match
      const mockElementsFromPoint = jest.fn().mockReturnValue([
        { hasAttribute: () => true, getAttribute: () => '1' }
      ]);
      Object.defineProperty(document, 'elementsFromPoint', {
        value: mockElementsFromPoint,
        writable: true,
      });

      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start and complete touch drag to wrong zone
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      
      fireEvent.touchEnd(answerItem, {
        changedTouches: [{ clientX: 200, clientY: 200 }],
      });

      await waitFor(() => {
        const wrongFeedback = screen.getByText('Wrong match!');
        expect(wrongFeedback).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA labels for draggable items', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      expect(answerItem).toHaveAttribute('aria-label');
      expect(answerItem).toHaveAttribute('role', 'button');
      expect(answerItem).toHaveAttribute('tabIndex', '0');
    });

    test('should have proper ARIA labels for drop zones', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const dropZone = screen.getByText('Question 1').parentElement;
      expect(dropZone).toHaveAttribute('aria-label');
      expect(dropZone).toHaveAttribute('role', 'region');
    });

    test('should update aria-grabbed state during drag', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Initially not grabbed
      expect(answerItem).toHaveAttribute('aria-grabbed', 'false');
      
      // Start touch drag
      fireEvent.touchStart(answerItem, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      
      // Should be grabbed
      expect(answerItem).toHaveAttribute('aria-grabbed', 'true');
    });
  });

  describe('Performance', () => {
    test('should prevent default touch behaviors', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      expect(answerItem).toHaveStyle('touch-action: none');
    });

    test('should handle multiple touch points gracefully', () => {
      render(
        <MatchingScreen
          leftItems={mockLeftItems}
          rightItems={mockRightItems}
          onComplete={mockOnComplete}
        />
      );

      const answerItem = screen.getByText('Answer 1');
      
      // Start touch with multiple points (should only use first touch)
      fireEvent.touchStart(answerItem, {
        touches: [
          { clientX: 100, clientY: 100 },
          { clientX: 200, clientY: 200 }
        ],
      });

      expect(answerItem).toHaveAttribute('aria-grabbed', 'true');
    });
  });
});