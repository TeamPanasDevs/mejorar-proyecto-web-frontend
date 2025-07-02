import React from 'react';
import './AboutUsPage.css'; // Importar el archivo CSS
import Logo from '../../../assets/Logo.jpg';
import Perfil1 from '../../../assets/Perfiles/Perfil1.jpg';
import Perfil2 from '../../../assets/Perfiles/Perfil2.jpg';
import Perfil3 from '../../../assets/Perfiles/Perfil3.jpg';

const AboutUsPage = () => {
  return (
    <section className="about-us-container">
      {/* Imagen centrada */}
      <figure>
        <img src={Logo} alt="Logo" className="about-us-logo" />
      </figure>

      <h1 className="titulo">Nosotros</h1>

      {/* Texto centrado */}
      <article className="about-us-text">
        <p>
          Somos Y, un equipo compuesto por tres desarrolladores apasionados que están embarcando en el emocionante proyecto
          de crear su primer juego como equipo. Unidos por la creatividad y el deseo de innovar, combinamos nuestras habilidades para
          ofrecer una experiencia única y envolvente. A pesar de ser nuestro primer proyecto, traemos una diversidad de talentos y enfoques
          que nos permiten complementar nuestras fortalezas.
        </p>
      </article>

      {/* Cards con imágenes de perfil */}
      <section className="profile-cards">
        {/* Card 1 */}
        <article className="profile-card">
          <div className="profile-card-inner">
            <div className="profile-card-front">
              <img src={Perfil1} alt="Perfil 1" />
              <h3>Eduardo Sepúlveda</h3>
              <p>Amante del anime, videojuegos y programación</p>
            </div>
            <div className="profile-card-back">
              <h3>Redes Sociales</h3>
              <a href="https://www.linkedin.com/in/eduardo-sepúlveda-b8576732a" target="_blank" rel="noopener noreferrer" className="social-button">
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Card 2 */}
        <article className="profile-card">
          <div className="profile-card-inner">
            <div className="profile-card-front">
              <img src={Perfil2} alt="Perfil 2" />
              <h3>Kael Fernández</h3>
              <p>Disfruto de programar, los videojuegos y las cosas simples de la vida</p>
            </div>
            <div className="profile-card-back">
              <h3>Redes Sociales</h3>
              <a href="https://www.linkedin.com/in/kaelfernandez" target="_blank" rel="noopener noreferrer" className="social-button">
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* Card 3 */}
        <article className="profile-card">
          <div className="profile-card-inner">
            <div className="profile-card-front">
              <img src={Perfil3} alt="Perfil 3" />
              <h3>Jean Fuentes</h3>
              <p>Amante de la innovación, investigación y emprendimiento</p>
            </div>
            <div className="profile-card-back">
              <h3>Redes Sociales</h3>
              <a href="https://www.linkedin.com/in/jean-philipe-fuentes-bordagaray/" target="_blank" rel="noopener noreferrer" className="social-button">
                LinkedIn
              </a>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
};

export default AboutUsPage;
