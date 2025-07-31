import React, { useState } from 'react';

// The BackgroundWrapper component is no longer needed.

interface RegistrationScreenProps {
  onSubmit: (email: string) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // State to control which view (and background) is shown
  const [showRegistration, setShowRegistration] = useState(false);

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call or async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(email);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  // This function triggers the state change to show the registration form
  const handlePlayClick = () => {
    setShowRegistration(true);
  };

  // Derived state for email validity, simplifying state management
  const isValidEmail = email.trim() && validateEmail(email);

  // Dynamically set the background image based on the showRegistration state
  const backgroundImageUrl = showRegistration
    ? "url('/s1.png')"
    : "url('/background2.png')";

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-4 overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center relative w-full">
        {/* Conditional rendering based on showRegistration state */}
        {!showRegistration ? (
          // Initial Welcome Content with a large transparent button
          <div className="text-center mb-16 transition-opacity duration-500 ease-in-out">
            <button
              onClick={handlePlayClick}
              className="text-white text-6xl font-semibold w-[800px] h-[240px] rounded-full transform hover:scale-105 hover:shadow-xl mt-[900px]"
              style={{ backgroundColor: 'transparent' }}
            >
              {/* This button is intentionally empty to act as a clickable area on the background */}
            </button>
          </div>
        ) : (
          // Registration Form Content
          <div className="w-full max-w-3xl flex flex-col items-center transition-opacity duration-500 ease-in-out">
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#00B5DB] text-center mb-12 sm:mb-16">
              Ads Memory Game
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-12 items-center w-full px-4">
              <input
                type="email"
                placeholder="Enter E-mail address"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                required
                className="w-full max-w-xl h-[64px] sm:h-[80px] md:h-[90px] px-4 sm:px-6 text-lg sm:text-2xl md:text-3xl bg-[#4291C3] border border-[#4315EF] text-white placeholder-white text-center rounded-[12px] shadow-md focus:outline-none"
              />
              <button
                type="submit"
                disabled={!isValidEmail || isLoading}
                className="w-full max-w-xs h-[60px] sm:h-[70px] md:h-[80px] bg-[#4315EF] text-white text-lg sm:text-xl md:text-4xl font-semibold rounded-full shadow-xl hover:opacity-90 transition-all"
              >
                {isLoading ? 'Starting...' : 'Play'}
              </button>
            </form>
            {error && <p className="text-md sm:text-lg text-red-600 mt-6 sm:mt-8 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};