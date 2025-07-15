import { Link } from 'react-router-dom';
import './MainPage.css';
import Logo from '../../../assets/Logo.jpg';  // Importa la imagen
import { SessionContext } from '../../App';
import GridCards from '../../components/Landing/GridCards';
import React, { useContext, useState } from 'react';
import RoomModal from '../../components/Rooms/RoomModal';
import Navbar from '../../components/navbar/Navbar';

const MainPage = () => {
  const {
    userConnected,
    openRegisterModal,
    openLoginModal,
  } = useContext(SessionContext)

  const [isRoomOpen, setRoomOpen] = useState(false);

  const openRoomModal = () => {
    setRoomOpen(true);
  };

  const closeRoomModal = () => setRoomOpen(false);
  return (
    <>
      <Navbar effect={'gradient'} />
      
      {/* Carrusel vistas */}

      {/* Home */}
      <div className='home'></div>

      {/* Characters */}
      <div className='characters'></div>
      
      <section className='mainpage_container'>
        <div className='mainpage_content'>
          {/* Sección del título y párrafo */}
          <div className='text_section'>
            <h1>Y, ¿por qué no <br /> darle vida?</h1>
            <p>
              "¡Creo que mi pieza se mueve... por su cuenta!" <br /><br />
              Juega al nuevo <strong>AkingDrez: Strategy & Combat</strong>, donde las piezas son más que solo eso.
              Planea tu estrategia, lucha en batallas individuales ¡y vence al ejército enemigo!
            </p>
            {/* Botones */}
            <div className='buttons'>
              { !userConnected ? (
                <>
                  <button className='button' onClick={openRegisterModal}>Registrarse</button>
                  <button className='button' onClick={openLoginModal}>Iniciar sesión</button>
                </>
              ) : (
                <button className='button' onClick={openRoomModal}>Salas de juego</button>
              )}
            </div>
          </div>

          {/* Imagen a la derecha */}
          <div className='image_section'>
            <img src={Logo} alt='Logo de AkingDrez' className='logo_image' />
          </div>
        </div>

        {/* Sección de 4 cuadros */}
        <div className='four_squares'>
          {['Planea', 'Lucha', 'Descubre', 'Sorprende'].map((title, index) => {
            const descriptions = [
              'Sigue las reglas del ajedrez clásico, donde cada pieza mantiene su movimiento y ataque original.',
              'En lugar de eliminar directamente a una pieza, ¡esta se resiste! Comienza una batalla 1v1 por turnos.',
              'Ataca, aumenta tu defensa, disminuye la del enemigo y lanza tus habilidades. ¡Hasta un peón puede vencer al rey!',
              '¿Estás en problemas? Nada que un as bajo la manga no pueda resolver. Utiliza tu habilidad única y vence en 1v1.'
            ];
            
            return (
              <div className='square' key={index}>
                <h1>{title}</h1>
                <p>{descriptions[index]}</p>
              </div>
            );
          })}
        </div>

        <RoomModal isOpen={isRoomOpen} closeModal={closeRoomModal} />
        
        <div>
          <GridCards />
        </div>
      </section>
    </>
  );
}

export default MainPage;