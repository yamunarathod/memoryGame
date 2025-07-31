import React, { useState } from 'react';
import { BackgroundWrapper } from './shared/BackgroundWrapper';

interface RegistrationScreenProps {
  onSubmit: (email: string) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false); // Controls which section is visible

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Real-time validation
    if (newEmail.trim() === '') {
      setEmailError('');
      setIsValidEmail(false);
    } else if (validateEmail(newEmail)) {
      setEmailError('');
      setIsValidEmail(true);
    } else {
      setEmailError('Please enter a valid email address'); // Add error for invalid format during typing
      setIsValidEmail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Validate email before submission
    if (trimmedEmail === '') {
      setEmailError('Email address is required');
      setIsValidEmail(false);
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      setIsValidEmail(false);
      return;
    }

    // Only submit if email is valid
    if (isValidEmail && trimmedEmail) {
      onSubmit(trimmedEmail);
    }
  };

  const handlePlayClick = () => {
    setShowRegistration(true);
  };

  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
 <div className="min-h-screen flex flex-col items-center justify-center relative w-full">
  {/* Conditional rendering based on showRegistration state */}
  {!showRegistration ? (
    // Initial Welcome Content
    <div className="text-center mb-16 transition-opacity duration-500 ease-in-out">
      {/* Changed heading color to #00B5DB and increased line spacing */}
      <h3 className="text-8xl font-bold mb-4" style={{ color: '#00B5DB', lineHeight: '1' }}>Play More,</h3>
      <h3 className="text-8xl font-bold" style={{ color: '#00B5DB', lineHeight: '1' }}>Learn More</h3>

      {/* CTA Button - Increased font, width, and height */}
      <button
        onClick={handlePlayClick}
        className="bg-[#4315EF] text-white text-6xl font-semibold px-20 py-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl mt-20"
      >
        Click here to Play
      </button>
    </div>
  ) : (
  
  
          // Registration Form Content
          <div className="p-8 w-full max-w-4xl transition-opacity duration-500 ease-in-out">
            <div className="text-center">
              {/* Changed heading color to #00B5DB */}
              <h1 className="text-4xl md:text-6xl font-bold text-center mb-12" style={{ color: '#00B5DB' }}>
                Ads Memory Game
              </h1>

              <div className="w-full flex flex-col items-center gap-8 md:gap-20">
                <div className="space-y-2 w-full max-w-2xl">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    // Increased font size for placeholder/text and set placeholder color to white
                    className="w-full h-20 md:h-32 px-6 py-4 text-3xl md:text-5xl text-white text-center placeholder-white bg-blue-700/80 rounded-xl border-2 border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  
                </div>

                <button
                  onClick={handleSubmit}
                  // Increased Play button font and changed background color to #4315EF
                  className="w-full max-w-lg h-16 md:h-32 text-3xl md:text-5xl font-semibold text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{ backgroundColor: '#4315EF' }} // Applied direct style for specific background color
                  disabled={!isValidEmail} // Disable button until email is valid
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BackgroundWrapper>
  );
};