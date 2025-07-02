import React from 'react';
import './ModalFlipCard.css';

const ModalFlipCard = ({ children, closeModal }) => {
  return (
    <aside className="flip-card-modal-background">
      <section className="flip-card-modal-content">
        {children}
        <button className="close-button-flip-card" onClick={closeModal}>Cerrar</button>
      </section>
    </aside>
  );
};

export default ModalFlipCard;