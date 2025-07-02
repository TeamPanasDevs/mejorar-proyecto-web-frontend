import React from 'react';
import './ChessSquare.css';

const ChessSquare = ({ row, col, isHighlighted, isSelected, onClick, className, children }) => {
  return (
    <div
      className={`chess-square ${className} ${isHighlighted} ${isSelected}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ChessSquare;
