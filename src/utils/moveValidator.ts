import { Board, Piece, Position, PieceType } from '../types/chess';

export function isValidMove(
  board: Board,
  from: Position,
  to: Position,
  piece: Piece
): boolean {
  // Basic validation
  if (from.row === to.row && from.col === to.col) return false;
  
  const targetPiece = board[to.row][to.col];
  if (targetPiece && targetPiece.color === piece.color) return false;

  // Check if move pattern is valid for the piece type
  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(board, from, to, piece);
    case 'rook':
      return isValidRookMove(board, from, to);
    case 'knight':
      return isValidKnightMove(from, to);
    case 'bishop':
      return isValidBishopMove(board, from, to);
    case 'queen':
      return isValidQueenMove(board, from, to);
    case 'king':
      return isValidKingMove(from, to);
    default:
      return false;
  }
}

function isValidPawnMove(
  board: Board,
  from: Position,
  to: Position,
  piece: Piece
): boolean {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Forward move
  if (from.col === to.col) {
    if (from.row + direction === to.row && !board[to.row][to.col]) {
      return true;
    }
    // First move - can move two squares
    if (from.row === startRow && 
        from.row + 2 * direction === to.row && 
        !board[to.row][to.col] &&
        !board[from.row + direction][from.col]) {
      return true;
    }
  }
  
  // Capture move
  if (Math.abs(from.col - to.col) === 1 && from.row + direction === to.row) {
    return board[to.row][to.col] !== null;
  }
  
  return false;
}

function isValidRookMove(board: Board, from: Position, to: Position): boolean {
  if (from.row !== to.row && from.col !== to.col) return false;
  
  const rowDir = Math.sign(to.row - from.row);
  const colDir = Math.sign(to.col - from.col);
  
  let row = from.row + rowDir;
  let col = from.col + colDir;
  
  while (row !== to.row || col !== to.col) {
    if (board[row][col]) return false;
    row += rowDir;
    col += colDir;
  }
  
  return true;
}

function isValidKnightMove(from: Position, to: Position): boolean {
  const rowDiff = Math.abs(from.row - to.row);
  const colDiff = Math.abs(from.col - to.col);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(board: Board, from: Position, to: Position): boolean {
  if (Math.abs(from.row - to.row) !== Math.abs(from.col - to.col)) return false;
  
  const rowDir = Math.sign(to.row - from.row);
  const colDir = Math.sign(to.col - from.col);
  
  let row = from.row + rowDir;
  let col = from.col + colDir;
  
  while (row !== to.row && col !== to.col) {
    if (board[row][col]) return false;
    row += rowDir;
    col += colDir;
  }
  
  return true;
}

function isValidQueenMove(board: Board, from: Position, to: Position): boolean {
  return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to);
}

function isValidKingMove(from: Position, to: Position): boolean {
  return Math.abs(from.row - to.row) <= 1 && Math.abs(from.col - to.col) <= 1;
}