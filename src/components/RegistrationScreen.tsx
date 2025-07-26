import React, { useState } from 'react';
import { BackgroundWrapper } from './shared/BackgroundWrapper';

interface RegistrationScreenProps {
  onSubmit: (email: string) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

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

  return (
    <BackgroundWrapper className="flex items-center justify-center p-4">
      <div className="p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-[60px] font-bold text-[#00B5DB] text-center mb-12">
            Ads Memory
          </h1>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-20">
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-[774px] h-[131px] px-6 py-4 text-[60px] text-white text-center placeholder-white bg-[#5E7CBA]/80 rounded-xl border-2 border-[#2B3990] focus:outline-none focus:ring-2 focus:ring-blue-400 

              
                "
                required
              />
              
              {emailError && (
                <div className="text-red-300 text-sm mt-2">
                  {emailError}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-[551px] h-[128px] text-[60px] font-semibold text-white bg-[#4126FF] rounded-full hover:bg-[#321AD9] shadow-md transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </BackgroundWrapper>
  );
};