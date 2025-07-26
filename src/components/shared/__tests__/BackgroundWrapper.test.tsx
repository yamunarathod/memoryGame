import React from 'react';
import { render, screen } from '@testing-library/react';
import { BackgroundWrapper } from '../BackgroundWrapper';

describe('BackgroundWrapper', () => {
  it('renders children correctly', () => {
    render(
      <BackgroundWrapper>
        <div data-testid="test-child">Test Content</div>
      </BackgroundWrapper>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies background image CSS classes', () => {
    const { container } = render(
      <BackgroundWrapper>
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const backgroundDiv = container.firstChild as HTMLElement;
    expect(backgroundDiv).toHaveClass('min-h-screen');
    expect(backgroundDiv).toHaveClass('bg-cover');
    expect(backgroundDiv).toHaveClass('bg-center');
    expect(backgroundDiv).toHaveClass('bg-no-repeat');
    expect(backgroundDiv).toHaveClass('bg-fixed');
    expect(backgroundDiv).toHaveClass('relative');
  });

  it('merges additional className props correctly', () => {
    const { container } = render(
      <BackgroundWrapper className="custom-class flex items-center">
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const backgroundDiv = container.firstChild as HTMLElement;
    expect(backgroundDiv).toHaveClass('custom-class');
    expect(backgroundDiv).toHaveClass('flex');
    expect(backgroundDiv).toHaveClass('items-center');
    expect(backgroundDiv).toHaveClass('min-h-screen'); // Original classes should still be present
  });

  it('applies background image style correctly', () => {
    const { container } = render(
      <BackgroundWrapper>
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const backgroundDiv = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(backgroundDiv);
    expect(backgroundDiv.style.backgroundImage).toContain("url('/s1.png')");
  });

  it('includes overlay div for text readability', () => {
    const { container } = render(
      <BackgroundWrapper>
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const overlayDiv = container.querySelector('.bg-white.bg-opacity-10');
    expect(overlayDiv).toBeInTheDocument();
    expect(overlayDiv).toHaveClass('absolute');
    expect(overlayDiv).toHaveClass('inset-0');
    expect(overlayDiv).toHaveClass('pointer-events-none');
  });

  it('wraps content in relative z-10 container', () => {
    render(
      <BackgroundWrapper>
        <div data-testid="content">Test Content</div>
      </BackgroundWrapper>
    );
    
    const contentContainer = screen.getByTestId('content').parentElement;
    expect(contentContainer).toHaveClass('relative');
    expect(contentContainer).toHaveClass('z-10');
  });

  it('handles empty className prop', () => {
    const { container } = render(
      <BackgroundWrapper className="">
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const backgroundDiv = container.firstChild as HTMLElement;
    expect(backgroundDiv).toHaveClass('min-h-screen');
    expect(backgroundDiv).not.toHaveClass('undefined');
  });

  it('handles undefined className prop', () => {
    const { container } = render(
      <BackgroundWrapper>
        <div>Test Content</div>
      </BackgroundWrapper>
    );
    
    const backgroundDiv = container.firstChild as HTMLElement;
    expect(backgroundDiv).toHaveClass('min-h-screen');
    expect(backgroundDiv).not.toHaveClass('undefined');
  });
});