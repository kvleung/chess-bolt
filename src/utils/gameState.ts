import { Board, Piece, Position, PieceColor } from '../types/chess';
import { isValidMove } from './moveValidator';

export function isKingInCheck(board: Board, kingColor: PieceColor): boolean {
  // Find king position
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) return false;

  // Check if any opponent piece can capture the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== kingColor) {
        if (isValidMove(board, { row, col }, kingPos, piece)) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isCheckmate(board: Board, currentPlayer: PieceColor): boolean {
  if (!isKingInCheck(board, currentPlayer)) return false;
  return hasNoLegalMoves(board, currentPlayer);
}

export function isStalemate(board: Board, currentPlayer: PieceColor): boolean {
  if (isKingInCheck(board, currentPlayer)) return false;
  return hasNoLegalMoves(board, currentPlayer);
}

function hasNoLegalMoves(board: Board, color: PieceColor): boolean {
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = board[fromRow][fromCol];
      if (piece && piece.color === color) {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (isValidMove(board, 
                          { row: fromRow, col: fromCol }, 
                          { row: toRow, col: toCol }, 
                          piece)) {
              // Try the move
              const newBoard = board.map(row => [...row]);
              newBoard[toRow][toCol] = piece;
              newBoard[fromRow][fromCol] = null;
              
              // If the move doesn't leave/put the king in check, it's legal
              if (!isKingInCheck(newBoard, color)) {
                return false;
              }
            }
          }
        }
      }
    }
  }
  return true;
}