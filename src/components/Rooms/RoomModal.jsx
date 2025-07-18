import axios from 'axios';
import RoomBox from './RoomBox';
import './RoomModal.css';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import { PathsContext } from '../../App';
import webSocketService from '../../services/WebSocketService'; // Importa el servicio WebSocket

const RoomModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  const { backendURL } = useContext(PathsContext);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const current_player_id = localStorage.getItem('player_id');
  const request_config = { headers: { Authorization: `Bearer ${token}` } };

  const [rooms, setRooms] = useState([]);
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');

  async function create_room() {
    try {
      const response = await axios.post(`${backendURL}/rooms`, {
        title: roomTitle !== '' ? roomTitle : undefined,
        player1_id: current_player_id
      }, request_config);

      if (response.status === 201) {
        navigate(`/rooms/${response.data.id}`);
      }
    } catch (error) {
      console.log('!!! Error al crear Room:', error);
    }
  }

  useEffect(() => {
    // const backendWebSocketURL = "ws://localhost:3000";
    const backendWebSocketURL = "wss://y-backend-24-2.onrender.com";

    // Conectar al WebSocket si no está conectado
    if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
        webSocketService.connect(backendWebSocketURL);
    }

    const handleRoomCreated = (newRoom) => {
        console.log("Nueva sala:", newRoom);
        setRooms((prevRooms) => [...prevRooms, newRoom]);
    };

    const handleRoomUpdated = (updatedRoom) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
        );
    };

    const handleOpen = () => {
        console.log("WebSocket connection established");

        // Añadir oyentes únicos
        webSocketService.addListener('roomCreated', handleRoomCreated);
        webSocketService.addListener('roomUpdated', handleRoomUpdated);
    };

    if (webSocketService.socket.readyState === WebSocket.OPEN) {
        handleOpen();
    } else {
        webSocketService.socket.addEventListener('open', handleOpen);
    }

    // Fetch rooms solo una vez si aún no están cargadas
    const fetchRooms = async () => {
      if (!roomsLoaded) {
        try {
          const response = await axios.get(`${backendURL}/rooms`, request_config);
          if (response.status === 200) {
            setRooms(response.data);
            setRoomsLoaded(true);
          }
        } catch (error) {
          if (error.status === 404) {
            setRoomsLoaded(true);
          }
          console.log('Error al cargar salas:', error);
        }
      }
    };

    fetchRooms();

    // Cleanup para eliminar oyentes duplicados
    return () => {
        webSocketService.removeListener('roomCreated', handleRoomCreated);
        webSocketService.removeListener('roomUpdated', handleRoomUpdated);
        if (webSocketService.socket) {
            webSocketService.socket.removeEventListener('open', handleOpen);
        }
    };
}, [backendURL, request_config]);



  return (
    <div className="modal-overlay">
      <section className="wrapper" id="rooms">
        <section className='wrapper_header'>
          <div className='create_room'>
            <input
              type='text'
              placeholder='Titulo de Sala'
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
            />
            <button
              className='button create_room_button'
              onClick={create_room}
            >
              Crear sala
            </button>
          </div>
          <button
            id='rooms_close_button'
            className="close-button"
            onClick={closeModal}
          >
            X
          </button>
        </section>
        <section className="rooms_box">
          {!roomsLoaded ? (
            <h1 className='rooms_message'>Cargando salas...</h1>
          ) : rooms.length !== 0 ? (
            rooms.map(room_data => (
              <RoomBox key={room_data.id} room_data={room_data} />
            ))
          ) : (
            <h1 className='rooms_message'>No hay salas</h1>
          )}
        </section>
      </section>
    </div>
  );
};

export default RoomModal;
