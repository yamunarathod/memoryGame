export interface User {
  name: string;
  email: string;
  level: 'new-to-ads' | 'ad-expert';
}

export interface MatchItem {
  id: number;
  left: string;
  right: string;
}

export interface GameState {
  user: User | null;
  currentScreen: 'registration' | 'selection' | 'memorizing' | 'matching' | 'results';
  memorizingContent: string[];
  matchingItems: MatchItem[];
  userMatches: { [key: number]: number };
  score: number;
  timeTaken: number;
}