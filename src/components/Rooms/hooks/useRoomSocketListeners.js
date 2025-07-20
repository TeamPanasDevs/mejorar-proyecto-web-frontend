import { useEffect } from 'react';

export function useRoomSocketListeners(socket, queryClient) {
  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (newRoom) => {
      queryClient.setQueryData(['rooms'], (oldRooms) => {
        if (!oldRooms) return oldRooms;
        const exists = oldRooms.some(room => room.id === newRoom.id);
        if (exists) return oldRooms;
        return [newRoom, ...oldRooms];
      });
    };

    const handleRoomDeleted = (deletedRoom) => {
      queryClient.setQueryData(['rooms'], (oldRooms) => {
        if (!oldRooms) return oldRooms;
        return oldRooms.filter(room => room.id !== deletedRoom.id);
      });
    };

    socket.on('ROOM_CREATED', handleRoomCreated);
    socket.on('ROOM_DELETED', handleRoomDeleted);

    return () => {
      socket.off('ROOM_CREATED', handleRoomCreated);
      socket.off('ROOM_DELETED', handleRoomDeleted);
    };
  }, [socket, queryClient]);
}
