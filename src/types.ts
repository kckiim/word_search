export interface PuzzleSettings {
  gridSize: {
    width: number;
    height: number;
  };
  fontSize: number;
  fontFamily: string;
  letterSpacing: number;
}

export interface Word {
  word: string;
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  direction: 'horizontal' | 'vertical' | 'diagonal';
}