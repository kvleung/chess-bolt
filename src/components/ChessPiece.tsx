import React from 'react';
import { PieceType, PieceColor } from '../types/chess';

const pieceImages = {
  white: {
    king: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wK.svg',
    queen: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wQ.svg',
    rook: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wR.svg',
    bishop: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wB.svg',
    knight: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wN.svg',
    pawn: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/wP.svg'
  },
  black: {
    king: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bK.svg',
    queen: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bQ.svg',
    rook: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bR.svg',
    bishop: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bB.svg',
    knight: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bN.svg',
    pawn: 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/bP.svg'
  }
};

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
}

export default function ChessPiece({ type, color }: ChessPieceProps) {
  return (
    <img 
      src={pieceImages[color][type]} 
      alt={`${color} ${type}`}
      className="w-4/5 h-4/5 select-none"
      draggable={false}
    />
  );
}