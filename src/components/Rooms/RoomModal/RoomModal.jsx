import './RoomModal.css';
import React from 'react';
import RoomBox from '../RoomBox/RoomBox';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthInfo } from '../hooks/useAuth';
import { useRoomSocketListeners } from '../hooks/useRoomSocketListeners';
import { validateRoomTitle } from '../utils/validateRoomTitle';

import { useFetchRooms } from '../../../api/queries/room';
import { useCreateRoom } from '../../../api/mutations/room';
import { useWebSocket } from '../../../hooks/WebSocketContext';
import { PathsContext } from '../../../App';

const RoomModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  const [roomTitle, setRoomTitle] = useState('');
  const [error, setError] = useState('');

  const { token, currentPlayerId } = useAuthInfo();
  const { backendURL: url } = useContext(PathsContext);
  const socket = useWebSocket();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading, isError } = useFetchRooms({ url, token });
  const { mutate: createRoom } = useCreateRoom({ url, token, current_player_id: currentPlayerId });

  useRoomSocketListeners(socket, queryClient);

  const handleCreateRoom = () => {
    const validationError = validateRoomTitle(roomTitle, rooms);
    if (validationError) return setError(validationError);

    createRoom(
      { title: roomTitle },
      {
        onSuccess: (data) => {
          setError('');
          navigate(`/rooms/${data.id}`);
        },
        onError: (err) => {
          console.error('Error al crear Room:', err);
          setError('Hubo un error al crear la sala');
        },
      }
    );
  };

  return (
    <div className="modal-overlay">
      <section className="wrapper" id="rooms">
        <header className="wrapper_header">
          <div className="create_room">
            <input
              type="text"
              placeholder="Título de sala"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
            />
            <button className="button create_room_button" onClick={handleCreateRoom}>
              Crear sala
            </button>
          </div>
          <button id="rooms_close_button" className="close-button" onClick={closeModal}>
            X
          </button>
        </header>

        {error && <p className="error_message">{error}</p>}

        <section className="rooms_box">
          {isLoading ? (
            <h1 className="rooms_message">Cargando salas...</h1>
          ) : isError ? (
            <h1 className="rooms_message">Error al cargar salas</h1>
          ) : rooms.length > 0 ? (
            rooms.map((room) => <RoomBox key={room.id} room_data={room} />)
          ) : (
            <h1 className="rooms_message">No hay salas</h1>
          )}
        </section>
      </section>
    </div>
  );
};

export default RoomModal;