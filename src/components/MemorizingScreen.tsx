import React, { useState, useEffect } from 'react';

interface MemorizingScreenProps {
  content: string[];
  onComplete: () => void;
}

export const MemorizingScreen: React.FC<MemorizingScreenProps> = ({ content, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds to read all content

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Memorize the Following
          </h2>
          <div className="text-lg font-medium text-blue-600 mb-6">
            Time Left: {timeLeft}s
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {content.map((item, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-800 leading-relaxed">
                <span className="font-semibold text-blue-600">{index + 1}. </span>
                {item}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};