import React, { useState } from 'react';
import { PuzzleSettings } from '../types';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  settings: PuzzleSettings;
  onSettingsChange: (settings: PuzzleSettings) => void;
  onGeneratePuzzle: (words: string[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onGeneratePuzzle }) => {
  const [words, setWords] = useState<string>('');

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'gridWidth' || name === 'gridHeight') {
      onSettingsChange({
        ...settings,
        gridSize: {
          ...settings.gridSize,
          [name === 'gridWidth' ? 'width' : 'height']: parseInt(value, 10),
        },
      });
    } else {
      onSettingsChange({
        ...settings,
        [name]: name === 'fontSize' || name === 'letterSpacing' ? parseInt(value, 10) : value,
      });
    }
  };

  const handleGeneratePuzzle = () => {
    const wordList = words.split(',').map(word => word.trim()).filter(word => word.length > 0);
    if (wordList.length > 50) {
      alert('Please enter no more than 50 words.');
      return;
    }
    onGeneratePuzzle(wordList);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <SettingsIcon className="mr-2" /> Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Grid Size</label>
            <div className="mt-1 flex space-x-2">
              <input
                type="number"
                name="gridWidth"
                value={settings.gridSize.width}
                onChange={handleSettingsChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="10"
                max="36"
              />
              <span className="text-gray-500">x</span>
              <input
                type="number"
                name="gridHeight"
                value={settings.gridSize.height}
                onChange={handleSettingsChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                min="10"
                max="36"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              name="fontSize"
              value={settings.fontSize}
              onChange={handleSettingsChange}
              className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              min="8"
              max="24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Font Family</label>
            <select
              name="fontFamily"
              value={settings.fontFamily}
              onChange={handleSettingsChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Letter Spacing</label>
            <input
              type="number"
              name="letterSpacing"
              value={settings.letterSpacing}
              onChange={handleSettingsChange}
              className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              min="0"
              max="5"
            />
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="words" className="block text-sm font-medium text-gray-700">
          Enter words (comma-separated, max 50)
        </label>
        <textarea
          id="words"
          name="words"
          rows={4}
          className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          value={words}
          onChange={(e) => setWords(e.target.value)}
        ></textarea>
      </div>
      <button
        onClick={handleGeneratePuzzle}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generate Puzzle
      </button>
    </div>
  );
};

export default Settings;