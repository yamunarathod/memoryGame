import React, { useState, useEffect } from 'react';

interface MatchingScreenProps {
  leftItems: string[];
  rightItems: string[];
  onComplete: (score: number, timeTaken: number) => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ 
  leftItems, 
  rightItems, 
  onComplete 
}) => {
  const [shuffledRightItems, setShuffledRightItems] = useState<string[]>([]);
  const [matches, setMatches] = useState<{ [key: number]: string }>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes timer
  const [showFeedback, setShowFeedback] = useState<{ [key: number]: 'correct' | 'wrong' }>({});
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    // Shuffle right items
    const shuffled = [...rightItems].sort(() => Math.random() - 0.5);
    setShuffledRightItems(shuffled);
  }, [rightItems]);

  useEffect(() => {
    if (gameCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameCompleted]);

  // Check if game is completed whenever matches change
  useEffect(() => {
    if (Object.keys(matches).length === leftItems.length && !gameCompleted) {
      setGameCompleted(true);
      // Auto-submit after a short delay to show completion
      setTimeout(() => {
        handleSubmit();
      }, 1000);
    }
  }, [matches, leftItems.length, gameCompleted]);

  const handleDragStart = (e: React.DragEvent, item: string, index: number) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, leftIndex: number) => {
    e.preventDefault();
    
    if (draggedItem && draggedIndex !== null) {
      const correctAnswer = rightItems[leftIndex];
      const isCorrect = draggedItem === correctAnswer;
      
      if (isCorrect) {
        setMatches(prev => ({ ...prev, [leftIndex]: draggedItem }));
        setShowFeedback(prev => ({ ...prev, [leftIndex]: 'correct' }));
        
        // Remove the matched item from shuffled items
        setShuffledRightItems(prev => prev.filter((_, index) => index !== draggedIndex));
      } else {
        setShowFeedback(prev => ({ ...prev, [leftIndex]: 'wrong' }));
        // Clear feedback after 1 second
        setTimeout(() => {
          setShowFeedback(prev => {
            const newFeedback = { ...prev };
            delete newFeedback[leftIndex];
            return newFeedback;
          });
        }, 1000);
      }
    }
    
    setDraggedItem(null);
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    const score = Object.keys(matches).length; // All matches in the matches object are correct
    const timeTaken = 120 - timeLeft;
    onComplete(score, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = Object.keys(matches).length === leftItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-purple-100 relative">
      {/* Flipkart Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">Flipkart</div>
            <div className="text-sm text-gray-600">Seller Hub</div>
          </div>
          <div className="text-lg font-bold text-gray-700">Seller Summit 2025</div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 flex space-x-2 p-4">
        <div className="w-12 h-20 bg-cyan-500 rounded-full"></div>
        <div className="w-12 h-20 bg-orange-500 rounded-full"></div>
        <div className="w-12 h-20 bg-yellow-500 rounded-full"></div>
        <div className="w-12 h-20 bg-red-500 rounded-full"></div>
        <div className="w-12 h-20 bg-green-500 rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              {leftItems.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[60px] flex items-center transition-all duration-300 ${
                    matches[index] 
                      ? 'bg-blue-50 border-blue-300' 
                      : showFeedback[index] === 'wrong'
                      ? 'bg-red-50 border-red-300'
                      : 'hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {matches[index] ? (
                    <div className="w-full">
                      <div className="font-medium text-blue-800 mb-2">{item}</div>
                      <div className="text-sm text-blue-600 bg-blue-100 p-2 rounded">
                        {matches[index]}
                      </div>
                    </div>
                  ) : (
                    <div className="font-medium text-gray-700">{item}</div>
                  )}
                  {showFeedback[index] === 'wrong' && (
                    <div className="text-red-500 text-sm ml-2">Wrong match!</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Answers */}
          <div className="space-y-3">
            {shuffledRightItems.map((item, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, item, index)}
                className="bg-white p-4 rounded-lg border-2 border-blue-200 cursor-move hover:border-blue-400 hover:shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <div className="text-gray-800">{item}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-2xl">←</span>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`px-12 py-4 rounded-full font-bold text-xl transition-all duration-200 ${
              isComplete
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Matched
          </button>

          <div className="flex items-center space-x-4">
            <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-800 to-blue-800 text-white p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-purple-800 font-bold">⏱</span>
              </div>
              <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};