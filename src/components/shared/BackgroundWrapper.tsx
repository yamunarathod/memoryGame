import React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  className = '',
  style
}) => {
  return (
    <div
      className={`min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative ${className}`}
      style={{
        backgroundImage: `url('/s1.png')`,
        // Fallback gradient if image fails to load
        backgroundColor: '#dbeafe',
        ...style
      }}
    >
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-white bg-opacity-10 pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};