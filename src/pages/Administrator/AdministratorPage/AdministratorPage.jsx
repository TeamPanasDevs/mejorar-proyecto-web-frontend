import React, { useState } from 'react';
import '../AdministratorStyle.css'
import Players from '../../../components/Administrator/Players';
import Rooms from '../../../components/Administrator/Rooms';
import axios from 'axios';

const AdministratorPage = () => {
  const [mainContent, setMainContent] = useState(true);
  const [displayJugadores, setDisplayJugadores] = useState(false);
  const [displaySalas, setDisplaySalas] = useState(false);
  const [displayButtonKey, setDisplayButtonKey] = useState([
    false,  // Jugadores
    false   // Salas
  ])

  const buttons = [
    (<button key={0} className='panel_button button' onClick={() => clickButton(0)}>Jugadores</button>),
    (<button key={1} className='panel_button button' onClick={() => clickButton(1)}>Salas</button>)
  ]


  function clickButton(key) {
    setMainContent(false);
    setDisplayButtonKey(prevState => prevState.map((bool, index) => index == key ? true : false));
  }

  function goToPanel() {
    setDisplayButtonKey(prevState => prevState.map((bool) => false));
    setMainContent(true);
  }


  return (
    <article className='vertical_container'>
      <button id='go_to_panel_button' className='' onClick={goToPanel}>Panel</button>
      { mainContent && 
        <>
          <h1>Panel de administrador</h1>

          <div className='panel'>
            {buttons.map((button) => (
              button
            ))}
          </div>
        </>
      }

      { displayButtonKey[0] && 
        <>
          <h1>Jugadores</h1>
          <Players/>
        </>
      }

      { displayButtonKey[1] && 
        <>
          <h1>Salas</h1>
          <Rooms/>
        </>
      }
    </article>
  );
}

export default AdministratorPage;