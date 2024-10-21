import React, { useRef } from 'react';
import { PuzzleSettings, Word } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface PuzzleProps {
  puzzle: string[][];
  placedWords: Word[];
  settings: PuzzleSettings;
}

const Puzzle: React.FC<PuzzleProps> = ({ puzzle, placedWords, settings }) => {
  const puzzleRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!puzzleRef.current) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const puzzleCanvas = await html2canvas(puzzleRef.current);
    const puzzleImage = puzzleCanvas.toDataURL('image/png');

    // Add puzzle without answers
    pdf.addImage(puzzleImage, 'PNG', 10, 10, 190, 190 * puzzleCanvas.height / puzzleCanvas.width);
    pdf.addPage();

    // Add puzzle with answers
    pdf.addImage(puzzleImage, 'PNG', 10, 10, 190, 190 * puzzleCanvas.height / puzzleCanvas.width);
    placedWords.forEach(word => {
      const startX = word.start.x * (190 / settings.gridSize.width) + 10;
      const startY = word.start.y * (190 / settings.gridSize.height) + 10;
      const endX = word.end.x * (190 / settings.gridSize.width) + 10;
      const endY = word.end.y * (190 / settings.gridSize.height) + 10;

      pdf.setDrawColor(255, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(startX, startY, endX, endY);
    });

    pdf.save('word_search_puzzle.pdf');
  };

  return (
    <div>
      <div ref={puzzleRef} className="mb-4 overflow-x-auto">
        <table className="border-collapse">
          <tbody>
            {puzzle.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((letter, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-300 p-1 text-center"
                    style={{
                      width: `${settings.fontSize * 1.5}px`,
                      height: `${settings.fontSize * 1.5}px`,
                      fontSize: `${settings.fontSize}px`,
                      fontFamily: settings.fontFamily,
                      letterSpacing: `${settings.letterSpacing}px`,
                    }}
                  >
                    {letter}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={generatePDF}
        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
      >
        <Download className="mr-2" /> Generate PDF
      </button>
    </div>
  );
};

export default Puzzle;