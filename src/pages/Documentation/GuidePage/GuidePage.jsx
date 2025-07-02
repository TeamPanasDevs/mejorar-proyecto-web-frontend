import React from 'react';
import './GuidePage.css'
import '../Documentation.css'
import { themeClicked } from '../Functions'

const GuidePage = () => {
  return (
    <section className='docs_div'>
      <h1 className='docs_title'>Guía de uso de la página</h1>

      {/* Cuenta jugador */}
      <article className="main_theme_box">
        <header id='head_player_account' className="head" onClick={() => themeClicked('player_account')}>
          <h2>Cuenta de jugador</h2>
          <button id='button_player_account' className='head_button' aria-expanded="false" aria-controls="player_account"></button>
        </header>

        <div id='player_account' className="content collapsed" aria-labelledby="head_player_account">
          <div className='text'>
            <p>
              Usted puede registrarse para obtener acceso al juego o iniciar sesión si ya tiene una cuenta.<br/>
              Para esto, debe presionar el botón correspondiente ubicado al inicio de la página, en la parte 
              superior de su pantalla. Luego se mostrará un formulario para rellenar sus datos e iniciar sesión
              con su cuenta nueva o existente.<br/>
              También es posible realizar lo mismo desde la página principal, siempre que usted se encuentre desconectado.<br/>
              <br/>
              Luego de entrar con una cuenta, se reemplazarán los botones por uno para cerrar su sesión y obtendrá acceso al juego.<br/>
            </p>
          </div>
        </div>
      </article>

      {/* Entrar a partida */}
      <article className="main_theme_box">
        <header id='head_search_room' className="head" onClick={() => themeClicked('search_room')}>
          <h2>Entrar a partida</h2>
          <button id='button_search_room' className='head_button' aria-expanded="false" aria-controls="search_room"></button>
        </header>

        <div id='search_room' className="content collapsed" aria-labelledby="head_search_room">
          <div className='text'>
            <p>
              Una vez tenga su sesión iniciada, usted puede crear o unirse a salas de juego desde 
              la página principal.<br/>
              <br/>
              Al presionar el botón <em>Salas de juego</em>, se desplegará una 
              lista de las salas disponibles creadas por otros jugadores. Si así lo desea, usted puede 
              presionar en el botón <em>Unirse</em> para entrar a la sala.<br/>
              También puede crear una sala presionando en <em>Crear sala</em> desde la página principal, 
              desplegándose así un formulario solicitando los datos de la sala. Al completarlo, se le llevará
              a la sala, donde deberá esperar a que se una otro jugador.<br/>
              <br/>
              Una vez dentro de una sala con 2 jugadores, al presionar en <em>Iniciar partida</em> se llevará 
              a los jugadores al juego, donde entrará en curso la partida.
            </p>
          </div>
        </div>
      </article>
    </section>
  )
}

export default GuidePage;