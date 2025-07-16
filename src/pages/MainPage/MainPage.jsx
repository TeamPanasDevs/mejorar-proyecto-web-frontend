import { Link } from 'react-router-dom';
import './MainPage.css';
import Logo from '../../../assets/Logo.jpg';  // Importa la imagen
import { SessionContext } from '../../App';
import GridCards from '../../components/Landing/GridCards';
import React, { useContext, useState } from 'react';
import RoomModal from '../../components/Rooms/RoomModal';

import Navbar from '../../components/navbar/Navbar';
import HomeSection from '../../components/MainPage/HomeSection/HomeSection';
import CharactersSection from '../../components/MainPage/CharactersSection/CharactersSection';

const MainPage = () => {
  return (
    <>
      <Navbar effect={'gradient'} />
      
      {/* Carrusel vistas */}

      <div className='mainCarrusel'>

        {/* Home */}
        <HomeSection />

        {/* Characters */}
        <CharactersSection />

      </div>

    </>
  )
}

export default MainPage;