import { useNavigate } from "react-router-dom";
import './RoomBox.css';
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { PathsContext } from "../../App";
import webSocketService from "../../services/WebSocketService"; // Importa el servicio WebSocket

const RoomBox = ({ room_data }) => {
  const { backendURL } = useContext(PathsContext);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [player1Loaded, setPlayer1Loaded] = useState(false);
  const [player2Loaded, setPlayer2Loaded] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const current_player_id = localStorage.getItem('player_id');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  async function joinRoom() {
    try {
      setButtonDisabled(true);
      const response = await axios.put(`${backendURL}/rooms/${room_data.id}`, {
        player2_id: current_player_id,
      }, request_config);
  
      if (response.status === 200) {
        // Enviar mensaje de WebSocket informando que el jugador se unió
        webSocketService.send('joinRoom', {
          playerId: current_player_id, // ID del jugador
          roomId: room_data.id,        // ID de la sala
        });
  
        navigate(`/rooms/${room_data.id}`);
      }
    } catch (error) {
      console.log('Error al actualizar room player:', error);
      setButtonDisabled(false);
    }
  }
  

  useEffect(() => {
    const fetchPlayerData = async (playerId, setPlayer, setLoaded) => {
      try {
        const response = await axios.get(`${backendURL}/players/${playerId}`, request_config);
        if (response.status === 200) {
          setPlayer(response.data);
        }
      } catch (error) {
        console.log('Error al obtener datos del jugador:', error);
      } finally {
        setLoaded(true);
      }
    };

    if (room_data.player1_id) {
      fetchPlayerData(room_data.player1_id, setPlayer1, setPlayer1Loaded);
    } else {
      setPlayer1Loaded(true);
    }

    if (room_data.player2_id) {
      fetchPlayerData(room_data.player2_id, setPlayer2, setPlayer2Loaded);
    } else {
      setPlayer2Loaded(true);
    }

    const handleRoomUpdate = (updatedRoom) => {
      setPlayer1(updatedRoom.player1);
      setPlayer2(updatedRoom.player2);
    };
    
    webSocketService.addListener(`roomUpdated:${room_data.id}`, handleRoomUpdate);

    return () => {
      webSocketService.removeListener(`roomUpdated:${room_data.id}`, handleRoomUpdate);
    };
  }, [room_data]);

  return (
    <article className="room_box">
      <header className="room_info">
        <h3>{room_data.title}</h3>
        <p>
          {!(player1Loaded && player2Loaded)
            ? 'Cargando jugadores...'
            : (
              <>
                <span>Jugadores:</span><br />
                <span>{`${player1 ? player1.name : '-'} / ${player2 ? player2.name : '-'}`}</span>
              </>
            )}
        </p>
      </header>
      <button
        className="join_button"
        onClick={joinRoom}
        disabled={buttonDisabled || (player1 && player2) || !(player1Loaded && player2Loaded)}
      >
        Unirse
      </button>
    </article>
  );
};

export default RoomBox;
