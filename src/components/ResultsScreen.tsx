import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  score, 
  totalQuestions, 
  timeTaken = 0,
  onRestart 
}) => {
  const isSuccess = score > 0;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          {isSuccess ? (
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😔</span>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {score === totalQuestions ? 'Congratulations!' : score > 0 ? 'Good Job!' : 'Better Luck Next Time'}
          </h1>
          
          <div className="text-lg text-gray-600 mb-6">
            <p>You matched {score} out of {totalQuestions} ({percentage}%)</p>
            {timeTaken > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Time taken: {formatTime(timeTaken)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );
};