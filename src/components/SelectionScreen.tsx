import React from 'react';

interface SelectionScreenProps {
  onSelect: (level: 'new-to-ads' | 'ad-expert') => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Are YOU
          </h1>
          
          <div className="space-y-4">
            <button
              onClick={() => onSelect('new-to-ads')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              New to Ads
            </button>
            
            <button
              onClick={() => onSelect('ad-expert')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-lg"
            >
              Ad-Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};