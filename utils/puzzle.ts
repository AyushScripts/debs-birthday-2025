export type TilePosition = {
  row: number;
  col: number;
};

export type PuzzleState = number[];

const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

/**
 * Get the position (row, col) from a linear index
 */
export function getPosition(index: number): TilePosition {
  return {
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  };
}

/**
 * Get the linear index from a position (row, col)
 */
export function getIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

/**
 * Check if two positions are adjacent (up, down, left, right)
 */
export function areAdjacent(pos1: TilePosition, pos2: TilePosition): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Count inversions in the puzzle state (for solvability check)
 */
function countInversions(state: PuzzleState): number {
  let inversions = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] === 0) continue;
    for (let j = i + 1; j < state.length; j++) {
      if (state[j] !== 0 && state[i] > state[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

/**
 * Check if a puzzle state is solvable
 * A puzzle is solvable if the number of inversions is even
 */
export function isSolvable(state: PuzzleState): boolean {
  const inversions = countInversions(state);
  return inversions % 2 === 0;
}

/**
 * Generate a random solvable puzzle state
 */
export function shuffleTiles(): PuzzleState {
  let state: PuzzleState;
  do {
    // Create array [0, 1, 2, 3, 4, 5, 6, 7, 8] where 0 is empty
    state = Array.from({ length: TOTAL_TILES }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = state.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state[i], state[j]] = [state[j], state[i]];
    }
  } while (!isSolvable(state));
  
  return state;
}

/**
 * Check if the puzzle is solved (tiles in order: 0, 1, 2, 3, 4, 5, 6, 7, 8)
 */
export function isSolved(state: PuzzleState): boolean {
  for (let i = 0; i < TOTAL_TILES; i++) {
    if (state[i] !== i) {
      return false;
    }
  }
  return true;
}

/**
 * Find the index of the empty tile (value 0)
 */
export function findEmptyIndex(state: PuzzleState): number {
  return state.indexOf(0);
}

/**
 * Get valid moves (indices that can move into the empty space)
 */
export function getValidMoves(state: PuzzleState): number[] {
  const emptyIndex = findEmptyIndex(state);
  const emptyPos = getPosition(emptyIndex);
  const validMoves: number[] = [];
  
  // Check all four directions
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 },  // right
  ];
  
  for (const dir of directions) {
    const newRow = emptyPos.row + dir.row;
    const newCol = emptyPos.col + dir.col;
    
    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
      const moveIndex = getIndex(newRow, newCol);
      validMoves.push(moveIndex);
    }
  }
  
  return validMoves;
}

/**
 * Move a tile to the empty space
 * Returns the new state if the move is valid, null otherwise
 */
export function makeMove(state: PuzzleState, tileIndex: number): PuzzleState | null {
  const emptyIndex = findEmptyIndex(state);
  const tilePos = getPosition(tileIndex);
  const emptyPos = getPosition(emptyIndex);
  
  if (!areAdjacent(tilePos, emptyPos)) {
    return null;
  }
  
  const newState = [...state];
  [newState[tileIndex], newState[emptyIndex]] = [newState[emptyIndex], newState[tileIndex]];
  return newState;
}

/**
 * Get the solved state (identity: [0, 1, 2, 3, 4, 5, 6, 7, 8])
 */
export function getSolvedState(): PuzzleState {
  return Array.from({ length: TOTAL_TILES }, (_, i) => i);
}
