import React, { useState } from 'react';
import { Settings, Puzzle, PuzzleGenerator } from './components';
import { PuzzleSettings, Word } from './types';

const App: React.FC = () => {
  const [settings, setSettings] = useState<PuzzleSettings>({
    gridSize: { width: 20, height: 20 },
    fontSize: 16,
    fontFamily: 'Arial',
    letterSpacing: 1,
  });
  const [words, setWords] = useState<Word[]>([]);
  const [puzzle, setPuzzle] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<Word[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleGeneratePuzzle = (inputWords: string[]) => {
    const { puzzle, placedWords, errorWords } = PuzzleGenerator.generate(inputWords, settings);
    setPuzzle(puzzle);
    setPlacedWords(placedWords);
    setWords(inputWords.map(word => ({ word, start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, direction: 'horizontal' })));
    
    if (errorWords.length > 0) {
      setErrorMessage(`The following words couldn't fit in the puzzle: ${errorWords.join(', ')}`);
    } else {
      setErrorMessage('');
    }

    // Add debug information
    setDebugInfo(`Input words: ${inputWords.join(', ')}\nPlaced words: ${placedWords.map(w => w.word).join(', ')}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-3xl font-bold text-center py-6 bg-blue-600 text-white">Word Search Puzzle Generator</h1>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 p-6 border-r">
            <Settings settings={settings} onSettingsChange={setSettings} onGeneratePuzzle={handleGeneratePuzzle} />
          </div>
          <div className="w-full md:w-2/3 p-6">
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                <p>{errorMessage}</p>
              </div>
            )}
            <Puzzle puzzle={puzzle} placedWords={placedWords} settings={settings} />
            {placedWords.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Words in the puzzle:</h3>
                <ul className="list-disc list-inside">
                  {placedWords.map((word, index) => (
                    <li key={index}>{word.word} ({word.direction} at {word.start.x},{word.start.y})</li>
                  ))}
                </ul>
              </div>
            )}
            {debugInfo && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold mb-2">Debug Information:</h3>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;