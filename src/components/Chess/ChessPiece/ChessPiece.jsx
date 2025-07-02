import React from 'react';
import './ChessPiece.css'


const Piece = ({ id = '', color, piece, row, col, spriteRow = 1, spriteCol = 1, className = '' }) => {
  /*
  * VARIABLES
  */

  const type_piece = `../../../../pieces/${color}_${piece}.png`;
  
  return (
    <div
      id={`${id}`}
      className={`${className} ${piece}_${color}`} // Agregar clase adicional
      style={{
        backgroundImage: `url(${type_piece})`,
      }}
    />
  );
};

export default Piece;
