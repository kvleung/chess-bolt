import React from 'react';
import { PieceColor } from '../types/chess';
import ChessPiece from './ChessPiece';

interface PawnPromotionModalProps {
  color: PieceColor;
  onSelect: (pieceType: 'queen' | 'rook' | 'bishop' | 'knight') => void;
}

export default function PawnPromotionModal({ color, onSelect }: PawnPromotionModalProps) {
  const pieces: Array<'queen' | 'rook' | 'bishop' | 'knight'> = ['queen', 'rook', 'bishop', 'knight'];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-center">Choose promotion piece</h2>
        <div className="grid grid-cols-4 gap-2">
          {pieces.map(piece => (
            <button
              key={piece}
              className="w-16 h-16 flex items-center justify-center hover:bg-gray-100 rounded"
              onClick={() => onSelect(piece)}
            >
              <ChessPiece type={piece} color={color} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}