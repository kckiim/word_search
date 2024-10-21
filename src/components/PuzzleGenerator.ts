import { PuzzleSettings, Word } from '../types';

export class PuzzleGenerator {
  static generate(words: string[], settings: PuzzleSettings) {
    const { width, height } = settings.gridSize;
    const grid: string[][] = Array(height).fill(null).map(() => Array(width).fill(''));
    const placedWords: Word[] = [];
    const errorWords: string[] = [];

    // Sort words by length (longest first)
    words.sort((a, b) => b.length - a.length);

    for (const word of words) {
      const upperCaseWord = word.toUpperCase();
      if (upperCaseWord.length > Math.max(width, height)) {
        errorWords.push(upperCaseWord);
        continue;
      }

      let placed = false;
      for (let attempts = 0; attempts < 100; attempts++) {
        const direction = this.getRandomDirection();
        const { x, y } = this.getRandomStartPosition(upperCaseWord, direction, width, height);

        if (this.canPlaceWord(grid, upperCaseWord, x, y, direction)) {
          this.placeWord(grid, upperCaseWord, x, y, direction);
          placedWords.push({
            word: upperCaseWord,
            start: { x, y },
            end: this.getEndPosition(x, y, direction, upperCaseWord.length),
            direction,
          });
          placed = true;
          break;
        }
      }

      if (!placed) {
        errorWords.push(upperCaseWord);
      }
    }

    // Fill empty spaces with random letters
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] === '') {
          grid[y][x] = this.getRandomLetter();
        }
      }
    }

    return { puzzle: grid, placedWords, errorWords };
  }

  private static getRandomDirection(): 'horizontal' | 'vertical' | 'diagonal' | 'reverse_horizontal' | 'reverse_vertical' | 'reverse_diagonal' {
    const directions: ('horizontal' | 'vertical' | 'diagonal' | 'reverse_horizontal' | 'reverse_vertical' | 'reverse_diagonal')[] = [
      'horizontal', 'vertical', 'diagonal', 'reverse_horizontal', 'reverse_vertical', 'reverse_diagonal'
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private static getRandomStartPosition(word: string, direction: string, width: number, height: number) {
    let x: number, y: number;

    switch (direction) {
      case 'horizontal':
      case 'reverse_horizontal':
        x = Math.floor(Math.random() * (width - word.length + 1));
        y = Math.floor(Math.random() * height);
        break;
      case 'vertical':
      case 'reverse_vertical':
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * (height - word.length + 1));
        break;
      case 'diagonal':
      case 'reverse_diagonal':
        x = Math.floor(Math.random() * (width - word.length + 1));
        y = Math.floor(Math.random() * (height - word.length + 1));
        break;
      default:
        throw new Error('Invalid direction');
    }

    return { x, y };
  }

  private static canPlaceWord(grid: string[][], word: string, startX: number, startY: number, direction: string): boolean {
    const wordToPlace = direction.startsWith('reverse_') ? word.split('').reverse().join('') : word;

    for (let i = 0; i < wordToPlace.length; i++) {
      let x: number, y: number;

      switch (direction) {
        case 'horizontal':
        case 'reverse_horizontal':
          x = startX + i;
          y = startY;
          break;
        case 'vertical':
        case 'reverse_vertical':
          x = startX;
          y = startY + i;
          break;
        case 'diagonal':
        case 'reverse_diagonal':
          x = startX + i;
          y = startY + i;
          break;
        default:
          throw new Error('Invalid direction');
      }

      if (x >= grid[0].length || y >= grid.length || (grid[y][x] !== '' && grid[y][x] !== wordToPlace[i])) {
        return false;
      }
    }

    return true;
  }

  private static placeWord(grid: string[][], word: string, startX: number, startY: number, direction: string): void {
    const wordToPlace = direction.startsWith('reverse_') ? word.split('').reverse().join('') : word;

    for (let i = 0; i < wordToPlace.length; i++) {
      let x: number, y: number;

      switch (direction) {
        case 'horizontal':
        case 'reverse_horizontal':
          x = startX + i;
          y = startY;
          break;
        case 'vertical':
        case 'reverse_vertical':
          x = startX;
          y = startY + i;
          break;
        case 'diagonal':
        case 'reverse_diagonal':
          x = startX + i;
          y = startY + i;
          break;
        default:
          throw new Error('Invalid direction');
      }

      grid[y][x] = wordToPlace[i];
    }
  }

  private static getEndPosition(startX: number, startY: number, direction: string, length: number) {
    switch (direction) {
      case 'horizontal':
      case 'reverse_horizontal':
        return { x: startX + length - 1, y: startY };
      case 'vertical':
      case 'reverse_vertical':
        return { x: startX, y: startY + length - 1 };
      case 'diagonal':
      case 'reverse_diagonal':
        return { x: startX + length - 1, y: startY + length - 1 };
      default:
        throw new Error('Invalid direction');
    }
  }

  private static getRandomLetter(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }
}