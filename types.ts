
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD'
}

export interface ScoreEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  date: string;
  verificationCode: string;
}

export interface Donut {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: DonutType;
  rotation: number;
  rotationSpeed: number;
  isCaught?: boolean;
}

export enum DonutType {
  PINK = 'PINK',
  CHOCO = 'CHOCO',
  BLUE = 'BLUE',
  GOLDEN = 'GOLDEN'
}
