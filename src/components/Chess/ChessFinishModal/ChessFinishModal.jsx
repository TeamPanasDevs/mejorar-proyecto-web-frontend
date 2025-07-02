import React from 'react';
import './ChessFinishModal.css';

const GameEndModal = ({ winner, loser, stats, onExit }) => {
  return (
    <div className="combat-summary-overlay">
      <div className="combat-summary">
        <h1>{`Ganador: ${winner}`}</h1>
        <p>
          {`¡Las ${winner} derrotaron a las ${loser}!`}
        </p>

        <div className="stats">
          <h2>Estadísticas del combate</h2>
          <ul>
            <li><strong>Turnos jugados:</strong>{stats.turns}</li>
          </ul>
        </div>

        <div className="actions">
          <button onClick={onExit}>Salir al menú principal</button>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal;
