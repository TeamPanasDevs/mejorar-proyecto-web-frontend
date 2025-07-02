import { Link, useNavigate, useParams } from 'react-router-dom';
import './RoomPage.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DisplayNavContext, PathsContext } from '../../App';
import WebSocketService from '../../services/WebSocketService'; 


const RoomPage = () => {
  const {
    backendURL,
    mainPagePath
  } = useContext(PathsContext);
  const {
    setDisplayNavbar
  } = useContext(DisplayNavContext);

  const { id } = useParams();
  const [roomTitle, setRoomTitle] = useState('');
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [roomLoaded, setRoomLoaded] = useState(false);
  const [ws, setWs] = useState(null); // Estado para manejar WebSocket

  const current_player_id = localStorage.getItem('player_id');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  function deleteRoom(button_id) {
    if ( !confirm('¿Realmente quieres eliminar la sala?') ) return;

    const button = document.getElementById(button_id);
    button.disabled = true;

    try {
      axios.delete(`${backendURL}/rooms/${id}`, request_config)
        .then( response => {
          if ( response.status == 204 ) {
            setDisplayNavbar(true);
            navigate(mainPagePath);
          }
          else {
            button.disabled = false;
          }
        })
    } catch(error) {
      console.log(error);
      button.disabled = false;
    }
  }

  function leaveRoom(button_id) {
    if ( !confirm('¿Realmente quieres salir de la sala?') ) return;

    const button = document.getElementById(button_id);
    button.disabled = true;

    try {
      axios.put(`${backendURL}/rooms/${id}`, { 'player2_id': null }, request_config)
        .then( response => {
          if ( response.status == 200 ) {
            navigate(mainPagePath);
          }
          else {
            button.disabled = false;
          }
        })
    } catch(error) {
      console.log(error);
      button.disabled = false;
    }
  }

  function startGame() {
    const button = document.getElementById('start_button');
    button.disabled = true;
  
    try {
      axios.post(`${backendURL}/sessions`, {
        'room_id': id
      }, request_config)
      .then(response => {
        if (response.status === 201) {
          const gameId = response.data.id;
          navigate(`/games/${gameId}`);
  
          // Enviar mensaje startgame con roomId
          const message = {
            type: 'startgame',
            gameId: gameId,
            roomId: id, // Enviamos directamente el roomId
            initiator: current_player_id, // Jugador que inicia la partida
          };
  
          console.log('Intentando mandar el mensaje al backend con roomId...');
          WebSocketService.send('startgame', message); // Usa WebSocketService para enviar el mensaje
        }
      })
      .catch(error => {
        console.log(error);
        button.disabled = false;
      });
    } catch (error) {
      console.log(error);
      button.disabled = false;
    }
  }
  

  useEffect(() => {
    setDisplayNavbar(false);
  
    // Función que se usa para escuchar los cambios en la sala
    const roomUpdatedListener = async (updatedRoom) => {
      if (updatedRoom.id === Number(id)) {
        setRoomTitle(updatedRoom.title);
  
        // Obtener info actualizada de player1
        if (updatedRoom.player1_id) {
          try {
            const player1Response = await axios.get(
              `${backendURL}/players/${updatedRoom.player1_id}`,
              request_config
            );
            if (player1Response.status === 200) setPlayer1(player1Response.data);
          } catch (error) {
            console.log('Error obteniendo player1:', error);
          }
        } else {
          setPlayer1(null); // Si no hay player1
        }
  
        // Obtener info actualizada de player2
        if (updatedRoom.player2_id) {
          try {
            const player2Response = await axios.get(
              `${backendURL}/players/${updatedRoom.player2_id}`,
              request_config
            );
            if (player2Response.status === 200) setPlayer2(player2Response.data);
          } catch (error) {
            console.log('Error obteniendo player2:', error);
          }
        } else {
          setPlayer2(null); // Si no hay player2
        }
      }
    };
  
    // Solo agregar el listener si no está agregado
    WebSocketService.addListener('roomUpdated', roomUpdatedListener);
  
    if (!roomLoaded) {
      try {
        axios.get(`${backendURL}/rooms/${id}`, request_config)
          .then(async (response) => {
            if (response.status === 200) {
              setRoomTitle(response.data.title);
  
              // Obtener info del player1
              if (response.data.player1_id != null) {
                const player1Response = await axios.get(
                  `${backendURL}/players/${response.data.player1_id}`,
                  request_config
                );
                if (player1Response.status === 200) setPlayer1(player1Response.data);
              }
  
              // Obtener info del player2
              if (response.data.player2_id != null) {
                const player2Response = await axios.get(
                  `${backendURL}/players/${response.data.player2_id}`,
                  request_config
                );
                if (player2Response.status === 200) setPlayer2(player2Response.data);
              }
  
            }
  
            setRoomLoaded(true); // Aquí ya terminamos de cargar todo
          })
          .catch((error) => {
            console.log('Error al obtener Room:', error);
          });
      } catch (error) {
        console.log('Error al hacer consulta para obtener Room:', error);
      }
    }
  
    // Cleanup cuando el componente se desmonte o cambie
    return () => {
      WebSocketService.removeListener('roomUpdated', roomUpdatedListener); // Elimina el listener de 'roomUpdated'
    };
  }, [id, roomLoaded]); // Este effect depende de 'id' y 'roomLoaded'
  
  
  
  
  return (
    <>
      { !roomLoaded ? ( <h1>Cargando sala...</h1> )
        : (
          <section className="room_div">
            { player1 ? (current_player_id == player1.id ? (
              <button id='delete_room' className='room_exit_button' onClick={() => deleteRoom('delete_room')}>Eliminar sala</button>
            ) : (
              <button id='leave_room' className='room_exit_button' onClick={() => leaveRoom('leave_room')}>Salir</button>
            )) : (<></>) }
            <h1>{roomTitle}</h1>
            <table className="users_table">
              <tr>
                <th>Nivel</th>
                <th>Jugador</th>
                <th>Descripción de jugador</th>
              </tr>
              <tr>
                { player1 ? (
                  <>
                    <td>{player1.level}</td>
                    <td>{player1.name}</td>
                    <td className='rooms_player_description'>{player1.description}</td>
                  </>
                ) : (
                  <>
                    <td> - </td>
                    <td> - </td>
                    <td>Esperando jugador...</td>
                  </>
                )}
              </tr>
              <tr>
              { player2 ? (
                  <>
                    <td>{player2.level}</td>
                    <td>{player2.name}</td>
                    <td className='rooms_player_description'>{player2.description}</td>
                  </>
                ) : (
                  <>
                    <td> - </td>
                    <td> - </td>
                    <td>Esperando jugador...</td>
                  </>
                )}
              </tr>
            </table>
            { (player1 && player2) ? (
                current_player_id == player1.id ? (
                  <button id='start_button' className="startgame_button" onClick={startGame}>
                    Iniciar partida
                  </button>
                ) : (
                  <button className='startgame_button' disabled={true}>Esperando a jugador 1...</button>
                )
              ) : (
                <button className='startgame_button' disabled={true}>Iniciar partida</button>
              )
            }
          </section>
        )
      }
    </>
  );
}

export default RoomPage;