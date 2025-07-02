import React from 'react';
import './GridCards.css';
import FlipCard from '../FlipCard/FlipCard';
import pieces_description from '../../PiecesDescription';

const GridCards = () => {
  return (
    <>
      <main className="container-mainpage">
        <header className="initial-block">
          <h1 style={{ maxWidth: '10em' }}>¿Conoces a las piezas?</h1>
          <h1 style={{ maxWidth: '10em' }}>¡¡Aca te las enseñamos!!</h1>
        </header>

        <section className="principal-block">
          <aside>
            <h1>¿Eres nuevo?</h1>
            <h2>¡¡Presta atención a nuestros consejos!!</h2>
          </aside>

          <section className="grid-card">
            {pieces_description.map((piece, index) => (
              <FlipCard key={index} piece={piece[1]} piece_img_position={piece[0]} />
            ))}
          </section>
        </section>
      </main>
    </>
  );
}

export default GridCards;