import { useContext, useEffect, useState } from 'react';
import ChessBoard from '../../components/Chess/ChessBoard/ChessBoard';
import './GamePage.css'
import { DisplayNavContext, PathsContext } from '../../App';
import axios, { AxiosHeaders } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const GamePage = () => {
  const {
    setDisplayNavbar
  } = useContext(DisplayNavContext);
  const {
    backendURL,
    mainPagePath
  } = useContext(PathsContext);

  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  /* ESTADOS */
  const [players, setPlayers] = useState({ player1: '', player2: '' }); // Estado para nombres de los jugadores.


  function surrender() {
    if (!confirm('¿Realmente quieres rendirte?')) return;

    /* 
    Procesar lógica para rendirse aqui.
    De momento, solo elimina la sala (eliminando en cascada lo demás)
    y envia a la landing
    */
    const button = document.getElementById('surrender_button');
    button.disabled = true;
    
    try {
      axios.get(`${backendURL}/sessions/${id}`, request_config)
        .then( session_response => {
          if (session_response.status === 200) {
            axios.get(`${backendURL}/rooms/${session_response.data.room_id}`, request_config)
              .then( room_response => {
                if (room_response.status === 200) {
                  axios.delete(`${backendURL}/rooms/${room_response.data.id}`, request_config)
                    .then( response => {
                      if ( response.status == 204 ) {
                        setDisplayNavbar(true);
                        navigate(mainPagePath);
                      }
                    })
                    .catch(error => {
                      console.log(error);
                      button.disabled = false;
                    })
                }
              })
              .catch(error => {
                console.log(error);
                button.disabled = false;
              })
          }
        })
        .catch(error => {
          console.log(error);
          button.disabled = false;
        })
    }
    catch(error) {
      console.log(error);
      button.disabled = false;
    }
  }


  // Función para obtener los datos de Sessión.
  async function sessionData() {
    try {
      const responseSession = await axios.get(
        `${backendURL}/sessions/${id}`, request_config
      );
      if (responseSession.status === 200) {
        return responseSession.data;
      }
    } catch (error) {
      console.log("Error al obtener datos de la Sesión:", error);
      return;
    }
  }

  // Función para obtener los datos de Room.
  async function roomData(session_data) {
    try {
      const responseRoom = await axios.get(
        `${backendURL}/rooms/${session_data.room_id}`, request_config
      );
      if (responseRoom.status === 200) {
        return responseRoom.data;
      }
    } catch (error) {
      console.log("Error al obtener datos de la Room:", error);
      return;
    }
  }

  // Función para obtener los datos de Player.
  async function playerData(room_data) {
    try {
      // Obtenemos Player1.
      const responsePlayer1 = await axios.get(
        `${backendURL}/players/${room_data.player1_id}`, request_config
      );
      // Obtenemos Player2.
      const responsePlayer2 = await axios.get(
        `${backendURL}/players/${room_data.player2_id}`, request_config
      );
      if (responsePlayer1.status === 200 && responsePlayer2.status === 200) {
        return [responsePlayer1.data, responsePlayer2.data]
      }
    } catch (error) {
      console.log("Error al obtener datos de los Jugadores:", error);
      return;
    }
  }

  // Función para obtener los nombres de los jugadores.
  async function playersName() {
    let responseSessionData;  // Session data.
    let responseRoomData;     // Room data.
    let responsePlayersData;  // Player data.
    let playersName = {
      player1: '',
      player2: ''
    };

    try {
      responseSessionData = await sessionData();                 // Obtenemos los datos de la sesión.
      responseRoomData    = await roomData(responseSessionData); // Obtenemos los datos de la Room.
      responsePlayersData = await playerData(responseRoomData);  // Obtenemos los datos de Players.

      // Obtener nombre Players.
      playersName.player1 = responsePlayersData[0].name;         // Obtenemos el nombre de Player1.
      playersName.player2 = responsePlayersData[1].name;         // Obtenemos el nombre de Player2.
      console.log()
      return playersName;
    } catch (error) {
      console.log("Error al obtener nombres de los jugadores:", error);
      return { player1: '', player2: '' };                       // Devuelve valores vacíos en caso de error.
    }

  }

  async function deleteRoom(backendURL, id_session, request_config, sessionData, setSessionData) {
    let responseSessionData;
    
    try {
      const responseSession = await axios.get(
        `${backendURL}/sessions/${id_session}`,
        request_config
      );
      if (responseSession.status === 200) {
        responseSessionData = responseSession.data
        setSessionData(responseSessionData);
      }
    } catch (error) {
      console.log("Error al obtener sessión:", error);
    }
  
    axios.delete(`${backendURL}/rooms/${responseSessionData.room_id}`, request_config)
      .then( response => {
        if (response.status === 204) {
          console.log(`Sesión eliminada`);
        }
      })
      .catch(error => {
        console.log("Ha ocurrido un error en la eliminación de Room", error);
      })
  }


  useEffect(() => {
    setDisplayNavbar(false);

    // Llama a la función playersName y actualiza el estado.
    const fetchPlayers = async () => {
      const fetchedPlayers = await playersName();
      setPlayers(fetchedPlayers); 
    };

    fetchPlayers();
  }, []);

  return (
    <section className='gamepage_div'>
      <button id='surrender_button' className='room_exit_button' onClick={surrender}>Rendirse</button>
      <p>Time</p>
      <div id='user_enemy' className='user_div'>{players.player2}</div>
      <ChessBoard />
      <div id='user_you' className='user_div'>{players.player1}</div>
    </section>
  );
}

export default GamePage;