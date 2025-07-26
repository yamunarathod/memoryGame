import React, { useState } from 'react';
import { GameState } from './types';
import { RegistrationScreen } from './components/RegistrationScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { MemorizingScreen } from './components/MemorizingScreen';
import { MatchingScreen } from './components/MatchingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { memorizingContent, matchingQuestions } from './data/content';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    currentScreen: 'registration',
    memorizingContent: [],
    matchingItems: [],
    userMatches: {},
    score: 0,
    timeTaken: 0
  });

  const handleRegistration = (email: string) => {
    setGameState(prev => ({
      ...prev,
      user: { name: email.split('@')[0], email, level: 'new-to-ads' },
      currentScreen: 'selection'
    }));
  };

  const handleLevelSelection = (level: 'new-to-ads' | 'ad-expert') => {
    setGameState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, level } : null,
      currentScreen: 'memorizing',
      memorizingContent: memorizingContent[level]
    }));
  };

  const handleMemorizingComplete = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'matching'
    }));
  };

  const handleMatchingComplete = (score: number, timeTaken: number = 0) => {
    setGameState(prev => ({
      ...prev,
      score,
      timeTaken,
      currentScreen: 'results'
    }));
  };

  const handleRestart = () => {
    setGameState({
      user: null,
      currentScreen: 'registration',
      memorizingContent: [],
      matchingItems: [],
      userMatches: {},
      score: 0,
      timeTaken: 0
    });
  };

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'registration':
        return <RegistrationScreen onSubmit={handleRegistration} />;
      
      case 'selection':
        return <SelectionScreen onSelect={handleLevelSelection} />;
      
      case 'memorizing':
        return (
          <MemorizingScreen 
            content={gameState.memorizingContent}
            onComplete={handleMemorizingComplete}
          />
        );
      
      case 'matching':
        if (!gameState.user) return null;
        const questions = matchingQuestions[gameState.user.level];
        return (
          <MatchingScreen 
            leftItems={questions.left}
            rightItems={questions.right}
            onComplete={handleMatchingComplete}
          />
        );
      
      case 'results':
        if (!gameState.user) return null;
        const totalQuestions = matchingQuestions[gameState.user.level].left.length;
        return (
          <ResultsScreen 
            score={gameState.score}
            totalQuestions={totalQuestions}
            timeTaken={gameState.timeTaken}
            userEmail={gameState.user.email}
            onRestart={handleRestart}
          />
        );
      
      default:
        return null;
    }
  };

  return <div className="App">{renderCurrentScreen()}</div>;
}

export default App;