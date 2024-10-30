import { Board, Piece, Position } from '../types/chess';

export function toFEN(board: Board, currentPlayer: 'white' | 'black'): string {
  let fen = '';
  
  // Board position
  for (let row = 0; row < 8; row++) {
    let emptyCount = 0;
    
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      
      if (piece === null) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        
        const pieceChar = getPieceChar(piece);
        fen += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
      }
    }
    
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    
    if (row < 7) fen += '/';
  }
  
  // Add turn
  fen += ` ${currentPlayer === 'white' ? 'w' : 'b'}`;
  
  // Add castling availability (simplified)
  fen += ' KQkq';
  
  // Add en passant target (simplified)
  fen += ' -';
  
  // Add halfmove clock and fullmove number (simplified)
  fen += ' 0 1';
  
  return fen;
}

export function toPGN(
  from: Position,
  to: Position,
  piece: Piece,
  isCapture: boolean,
  isCheck: boolean,
  isCheckmate: boolean
): string {
  const files = 'abcdefgh';
  const ranks = '87654321';
  
  let pgn = '';
  
  // Piece symbol
  if (piece.type !== 'pawn') {
    pgn += piece.type === 'knight' ? 'N' : piece.type.charAt(0).toUpperCase();
  }
  
  // Capture notation
  if (isCapture) {
    if (piece.type === 'pawn') pgn += files[from.col];
    pgn += 'x';
  }
  
  // Destination square
  pgn += files[to.col] + ranks[to.row];
  
  // Check or checkmate
  if (isCheckmate) pgn += '#';
  else if (isCheck) pgn += '+';
  
  return pgn;
}

function getPieceChar(piece: Piece): string {
  switch (piece.type) {
    case 'king': return 'k';
    case 'queen': return 'q';
    case 'rook': return 'r';
    case 'bishop': return 'b';
    case 'knight': return 'n';
    case 'pawn': return 'p';
  }
}