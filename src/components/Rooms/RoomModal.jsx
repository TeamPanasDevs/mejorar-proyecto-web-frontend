import React, { useContext, useEffect, useState } from 'react';
import './RoomModal.css';
import axios from 'axios';
import RoomBox from './RoomBox';
import webSocketService from '../../services/WebSocketService';

// Componentes y similares.
import { PathsContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/WebSocketContext';

// Hooks y base de datos.
import { useCreateRoom } from '../../api/mutations/room';
import { useFetchRooms } from '../../api/queries/room';

const RoomModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;
  
  const token = localStorage.getItem('token');
  const current_player_id = localStorage.getItem('player_id');

  const { backendURL: url, webSocketUrl: socketUrl } = useContext(PathsContext);
  const navigate = useNavigate();
  const socket = useWebSocket();

  const [roomTitle, setRoomTitle] = useState('');

  // Hooks de React Query.
  const { data: rooms, isLoading, isError } = useFetchRooms({ url, token });
  const { mutate: createRoomMutation } = useCreateRoom({ url, token, current_player_id });

  function handleCreateRoom() {
    createRoomMutation({ title: roomTitle }, {
      onSuccess: (data) => navigate(`/rooms/${data.id}`),
      onError: (error) => console.error('Error al crear Room:', error)
    });
  }


  useEffect(() => {

    // Conectar al WebSocket si no está conectado.
    if (!webSocketService.socket || webSocketService.socket.readyState !== WebSocket.OPEN) {
        webSocketService.connect(socketUrl);
    }

    const handleRoomCreated = (newRoom) => {
      console.log("Nueva sala agregada:", newRoom);
      // ¡Aquí debemos invalidar la cache o usar un update manual!
      // Pero eso lo dejamos para después, cuando hablemos de sincronización con React Query
    };

    const handleRoomUpdated = (updatedRoom) => {
      // Aquí podríamos invalidar la query también o mutar el cache manualmente
    };

    const handleOpen = () => {
        webSocketService.addListener('ROOM_CREATED', handleRoomCreated);
        webSocketService.addListener('roomUpdated', handleRoomUpdated);
    };

    if (webSocketService.socket.readyState === WebSocket.OPEN) {
        handleOpen();
    } else {
        webSocketService.socket.addEventListener('open', handleOpen);
    }

    return () => {
        webSocketService.removeListener('ROOM_CREATED', handleRoomCreated);
        webSocketService.removeListener('roomUpdated', handleRoomUpdated);
        if (webSocketService.socket) {
            webSocketService.socket.removeEventListener('open', handleOpen);
        }
    };
}, [socket]);



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
              onClick={handleCreateRoom}
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
          {isLoading ? (
            <h1 className='rooms_message'>Cargando salas...</h1>
          ) : isError ? (
            <h1 className='rooms_message'>Error al cargar salas</h1>
          ) : rooms.length > 0 ? (
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
