import React, { useState, useEffect } from 'react';
import './FlipCard.css'
import ModalFlipCard from './ModalFlipCard';

const FlipCard = ({piece, piece_img_position}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Detecta si estamos en una pantalla móvil
  useEffect(() => {
    const checkScreenSize = () => {
      // Compara si cumple con el tamaño de móvil
      setIsMobile(window.innerWidth <= 1023);
    };
    
    // Detecta cambios de tamaño de pantalla
    window.addEventListener('resize', checkScreenSize);
    
    // Configura el tamaño inicial
    checkScreenSize();

    // Limpia el event listener cuando el componente se desmonta
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (
    <section className="flip-card-container">
      {isMobile ? (
        // Vista móvil: Al hacer clic se abre un modal
        <article className="flip-card-mobile" onClick={openModal} style={{ backgroundPosition: `100% ${piece_img_position}%` }}>
        </article>
      ) : (
        // Vista de escritorio: Tarjeta que se da vuelta
        <figure className="flip-card">
          <div className="thecard">
            <div className="thefront" style={{ backgroundPosition: `100% ${piece_img_position}%` }}></div>
            <figcaption className="theback" style={{ backgroundPosition: `0 ${piece_img_position}%` }}>
              <div>
                {piece}
              </div>
            </figcaption>
          </div>
        </figure>
      )}

      {isMobile && isModalOpen && (
        // Modal que se abre al hacer clic en la tarjeta móvil
        <ModalFlipCard closeModal={closeModal}>
          {piece}
        </ModalFlipCard>
      )}
    </section>
  );
};

export default FlipCard;