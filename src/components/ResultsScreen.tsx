"use client"

import React, { useEffect, useState } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';
// Assuming saveCatalogueImageResult is still needed, keep the import
// import { saveCatalogueImageResult } from '../lib/supabase'; 

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  userEmail: string;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  timeTaken = 0,
  userEmail,
  onRestart
}) => {
  const isSuccess = score > 0; // Keeping original logic for success based on score > 0
  const percentage = Math.round((score / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // API call to send score data
  const sendScoreToAPI = async () => {
    try {
      const payload = {
        email: userEmail,
        element_id: "03", // This ID might need to be dynamic based on the game
        game_name: "Ads Memory", // This name might need to be dynamic based on the game
        location: "surat",
        score: score
      };

      console.log('Sending score data to webhook:', payload);

      const response = await fetch('https://hook.eu1.make.com/4jtevja63bir17db4oqw267cvuxe5y98', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Score data sent successfully');
      } else {
        console.error('Failed to send score data:', response.status);
      }
    } catch (error) {
      console.error('Error sending score data:', error);
    }
  };

  // Send score data when component mounts
  useEffect(() => {
    sendScoreToAPI();
  }, [score, userEmail]); // Dependencies ensure it runs when score or email changes

  // Added a countdown for automatic restart, similar to the first Results component
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onRestart]);

  // Determine background image based on score
  const backgroundImage = isSuccess ? '/s1.png' : '/fail.png';

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Conditional Content */}
      {score > 0 ? (
        <div className="relative z-10 flex flex-col items-center mt-[230px]">
          <img
            src="/congrats.png"
            alt="Congratulations"
            className="w-[700px] mb-0"
          />
          <div className="mt-[70px]">
            <h1 className="text-[70px] font-extrabold text-white mb-2 leading-[1.1]">
              CONGRATULATIONS!
            </h1>
            <p className="text-white text-[60px] mb-1 leading-[1.1]">You got!</p>
            <p className="text-white text-[96px] font-bold mb-1 leading-none">
              {score}/{totalQuestions}
            </p>
            <p className="text-white text-[60px] leading-[1.1]">Correct answers!</p>
            {timeTaken > 0 && (
              <p className="text-white text-[40px] mt-4">
                Time taken: {formatTime(timeTaken)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center mt-[230px]">
        
        </div>
      )}
    </div>
  );
  
};