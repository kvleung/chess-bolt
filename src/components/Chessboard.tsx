import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChessPiece from './ChessPiece';
import PawnPromotionModal from './PawnPromotionModal';
import { isValidMove } from '../utils/moveValidator';
import { isKingInCheck, isCheckmate, isStalemate } from '../utils/gameState';
import { toFEN, toPGN } from '../utils/notation';
import type { Board, Piece, Position, PieceType } from '../types/chess';

const initialBoard: Board = [
  [
    { type: 'rook', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'queen', color: 'black' },
    { type: 'king', color: 'black' },
    { type: 'bishop', color: 'black' },
    { type: 'knight', color: 'black' },
    { type: 'rook', color: 'black' },
  ],
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
  [
    { type: 'rook', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'queen', color: 'white' },
    { type: 'king', color: 'white' },
    { type: 'bishop', color: 'white' },
    { type: 'knight', color: 'white' },
    { type: 'rook', color: 'white' },
  ],
];

interface PendingPromotion {
  from: Position;
  to: Position;
  color: 'white' | 'black';
}

export default function Chessboard() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [fen, setFen] = useState<string>(toFEN(initialBoard, 'white'));

  const makeMove = (from: Position, to: Position, promotionPiece?: PieceType) => {
    const piece = board[from.row][from.col]!;
    const targetPiece = board[to.row][to.col];
    const isCapture = targetPiece !== null;
    
    const newBoard = board.map(row => [...row]);
    
    // Handle promotion
    if (promotionPiece) {
      newBoard[to.row][to.col] = { type: promotionPiece, color: piece.color };
    } else {
      newBoard[to.row][to.col] = piece;
    }
    newBoard[from.row][from.col] = null;
    
    // Check if this move puts the opponent in check/checkmate
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    const putInCheck = isKingInCheck(newBoard, nextPlayer);
    const mated = isCheckmate(newBoard, nextPlayer);
    const stalemated = isStalemate(newBoard, nextPlayer);
    
    // Generate PGN notation
    const pgn = toPGN(from, to, piece, isCapture, putInCheck, mated);
    
    setBoard(newBoard);
    setCurrentPlayer(nextPlayer);
    setMoveHistory([...moveHistory, pgn]);
    setFen(toFEN(newBoard, nextPlayer));
    
    if (mated) {
      setMessage(`Checkmate! ${currentPlayer} wins!`);
    } else if (stalemated) {
      setMessage('Stalemate! Game is drawn.');
    } else if (putInCheck) {
      setMessage(`${nextPlayer} is in check!`);
    } else {
      setMessage('');
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    const clickedSquare: Position = { row, col };
    const piece = board[row][col];

    if (!selectedSquare) {
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare(clickedSquare);
        setMessage('');
      } else {
        setMessage('Select your own piece');
      }
    } else {
      const selectedPiece = board[selectedSquare.row][selectedSquare.col];
      
      if (selectedPiece) {
        if (isValidMove(board, selectedSquare, clickedSquare, selectedPiece)) {
          // Check for pawn promotion
          if (selectedPiece.type === 'pawn' && 
              ((selectedPiece.color === 'white' && row === 0) || 
               (selectedPiece.color === 'black' && row === 7))) {
            setPendingPromotion({
              from: selectedSquare,
              to: clickedSquare,
              color: selectedPiece.color
            });
          } else {
            makeMove(selectedSquare, clickedSquare);
          }
        } else {
          setMessage('Invalid move');
        }
      }
      setSelectedSquare(null);
    }
  };

  const handlePromotion = (pieceType: 'queen' | 'rook' | 'bishop' | 'knight') => {
    if (pendingPromotion) {
      makeMove(pendingPromotion.from, pendingPromotion.to, pieceType);
      setPendingPromotion(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start p-8">
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow-xl p-4">
          <div className="grid grid-cols-8 gap-0 w-full max-w-2xl mx-auto">
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                const isLight = (rowIndex + colIndex) % 2 === 0;
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      aspect-square flex items-center justify-center
                      ${isLight ? 'bg-neutral-200' : 'bg-amber-800'}
                      ${isSelected ? 'ring-4 ring-blue-400' : ''}
                      hover:opacity-90 transition-opacity
                    `}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {piece && <ChessPiece type={piece.type} color={piece.color} />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-80">
        <div className="bg-white rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Game Info</h2>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-1">FEN</h3>
              <p className="text-xs font-mono break-all">{fen}</p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-700">PGN Moves</h3>
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 text-sm bg-gray-50 rounded"
                >
                  <span className="w-8 text-gray-400">{Math.floor(index / 2) + 1}.</span>
                  <span className="flex-1 font-mono">{move}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-900">
                Current Turn: {currentPlayer === 'white' ? 'White' : 'Black'}
              </p>
            </div>
            
            {message && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-900">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {pendingPromotion && (
        <PawnPromotionModal
          color={pendingPromotion.color}
          onSelect={handlePromotion}
        />
      )}
    </div>
  );
}