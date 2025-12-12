'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PuzzleState,
  shuffleTiles,
  isSolved,
  getValidMoves,
  makeMove,
  getPosition,
  getSolvedState,
  findEmptyIndex,
} from '@/utils/puzzle';

interface SlidingPuzzleProps {
  imageSrc: string;
  onSolve: () => void;
}

const GRID_SIZE = 3;
const STORAGE_KEY = 'scrapbook.puzzle.v1';

interface StoredState {
  state: PuzzleState;
  moves: number;
}

export default function SlidingPuzzle({ imageSrc, onSolve }: SlidingPuzzleProps) {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>(() => getSolvedState());
  const [moves, setMoves] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [solved, setSolved] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const onSolveRef = useRef(onSolve);

  // Keep onSolve ref updated
  useEffect(() => {
    onSolveRef.current = onSolve;
  }, [onSolve]);

  // Load from localStorage on mount
  useEffect(() => {
    if (isInitialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredState = JSON.parse(stored);
        if (parsed.state && Array.isArray(parsed.state) && parsed.state.length === 9) {
          setPuzzleState(parsed.state);
          setMoves(parsed.moves || 0);
          setIsInitialized(true);
          // Check if already solved
          if (isSolved(parsed.state)) {
            setSolved(true);
            onSolveRef.current();
          }
          return;
        }
      }
    } catch (e) {
      console.error('Error loading puzzle state:', e);
    }
    
    // Initialize with shuffled state
    const shuffled = shuffleTiles();
    setPuzzleState(shuffled);
    setIsInitialized(true);
  }, [isInitialized]);

  // Save to localStorage whenever state or moves change
  useEffect(() => {
    if (!isInitialized || solved) return;
    
    if (puzzleState.length === 9) {
      try {
        const stored: StoredState = {
          state: puzzleState,
          moves,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      } catch (e) {
        console.error('Error saving puzzle state:', e);
      }
    }
  }, [puzzleState, moves, solved, isInitialized]);

  // Check if solved
  useEffect(() => {
    if (!isInitialized || solved) return;
    
    if (isSolved(puzzleState)) {
      setSolved(true);
      // Clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Ignore
      }
      onSolveRef.current();
    }
  }, [puzzleState, solved, isInitialized]);

  const handleTileClick = useCallback((tileIndex: number) => {
    if (solved || isAnimating || !isInitialized) return;

    const newState = makeMove(puzzleState, tileIndex);
    if (newState) {
      setIsAnimating(true);
      setPuzzleState(newState);
      setMoves(prev => prev + 1);
      
      // Reset animation flag after transition
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [puzzleState, solved, isAnimating, isInitialized]);

  // Handle keyboard navigation
  useEffect(() => {
    if (solved || !isInitialized) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      const emptyIndex = findEmptyIndex(puzzleState);
      const emptyPos = getPosition(emptyIndex);
      let targetIndex: number | null = null;

      switch (e.key) {
        case 'ArrowUp':
          if (emptyPos.row < GRID_SIZE - 1) {
            targetIndex = (emptyPos.row + 1) * GRID_SIZE + emptyPos.col;
          }
          break;
        case 'ArrowDown':
          if (emptyPos.row > 0) {
            targetIndex = (emptyPos.row - 1) * GRID_SIZE + emptyPos.col;
          }
          break;
        case 'ArrowLeft':
          if (emptyPos.col < GRID_SIZE - 1) {
            targetIndex = emptyPos.row * GRID_SIZE + (emptyPos.col + 1);
          }
          break;
        case 'ArrowRight':
          if (emptyPos.col > 0) {
            targetIndex = emptyPos.row * GRID_SIZE + (emptyPos.col - 1);
          }
          break;
        default:
          return;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        handleTileClick(targetIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzleState, isAnimating, solved, handleTileClick, isInitialized]);

  const handleShuffle = useCallback(() => {
    if (isAnimating) return;
    const shuffled = shuffleTiles();
    setPuzzleState(shuffled);
    setMoves(0);
    setSolved(false);
  }, [isAnimating]);

  const handleReset = useCallback(() => {
    if (isAnimating) return;
    setPuzzleState(getSolvedState());
    setMoves(0);
    setSolved(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }, [isAnimating]);

  const handleGiveUp = useCallback(() => {
    if (isAnimating) return;
    setPuzzleState(getSolvedState());
    setMoves(0);
    setSolved(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
    onSolveRef.current();
  }, [isAnimating]);

  const validMoves = isInitialized ? getValidMoves(puzzleState) : [];

  if (!isInitialized) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <p className="font-cormorant text-lg text-gray-800">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Move Counter */}
      <div className="text-center mb-4">
        <p className="font-cormorant text-lg text-gray-800">
          Moves: <span className="font-semibold">{moves}</span>
        </p>
      </div>

      {/* Puzzle Grid */}
      <div
        ref={gridRef}
        className="relative w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden"
        role="grid"
        aria-label="Sliding puzzle grid"
      >
        {puzzleState.map((tileValue, index) => {
          const { row, col } = getPosition(index);
          const isEmpty = tileValue === 0;
          const isValidMove = validMoves.includes(index);
          
          // Calculate background position for the tile
          // tileValue tells us which tile this is (0-8), we need to show the correct slice
          const solvedRow = Math.floor(tileValue / GRID_SIZE);
          const solvedCol = tileValue % GRID_SIZE;
          const bgX = -(solvedCol * (100 / GRID_SIZE));
          const bgY = -(solvedRow * (100 / GRID_SIZE));

          return (
            <div
              key={`tile-${index}-${tileValue}`}
              className={`absolute transition-all duration-300 ease-in-out ${
                isEmpty
                  ? 'bg-gray-100'
                  : 'bg-white cursor-pointer hover:opacity-90 active:scale-95'
              } ${
                isValidMove && !isEmpty
                  ? 'ring-2 ring-pink-400 ring-offset-2'
                  : ''
              }`}
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${col * (100 / GRID_SIZE)}%`,
                top: `${row * (100 / GRID_SIZE)}%`,
                backgroundImage: isEmpty ? 'none' : `url(${imageSrc})`,
                backgroundSize: `${GRID_SIZE * 100}%`,
                backgroundPosition: `${bgX}% ${bgY}%`,
                touchAction: 'manipulation',
                zIndex: isEmpty ? 1 : 2,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isEmpty) {
                  handleTileClick(index);
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isEmpty) {
                  handleTileClick(index);
                }
              }}
              role="gridcell"
              aria-label={isEmpty ? 'Empty space' : `Tile ${tileValue}`}
              tabIndex={isEmpty ? -1 : isValidMove ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isEmpty) {
                    handleTileClick(index);
                  }
                }
              }}
            >
              {!isEmpty && (
                <div className="absolute inset-0 border border-gray-200 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleShuffle}
          disabled={isAnimating || solved}
          className="px-4 py-2 bg-pink-500 text-white rounded-md font-cormorant text-sm hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          Shuffle
        </button>
        
        <button
          onClick={handleGiveUp}
          disabled={isAnimating || solved}
          className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-600 rounded-md font-cormorant text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Give Up
        </button>
      </div>
    </div>
  );
}
