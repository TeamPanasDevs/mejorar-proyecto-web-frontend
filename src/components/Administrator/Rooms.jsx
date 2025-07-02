import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { PathsContext } from "../../App";

const Rooms = () => {
  const {
    backendURL
  } = useContext(PathsContext);

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);


  function handleRooms() {
    setLoading(true);
    async function setAPIRooms() {
      try {
        const response = await axios.get(`${backendURL}/rooms`, request_config);
        response.status === 200 ? setRooms(response.data) : setRooms([]);
      }
      catch(error) { console.log(error) }
      setLoading(false);
    }
    setAPIRooms();
  }

  useEffect(() => {
    handleRooms();
  }, [])


  async function deleteRoom(room_id) {
    if (!confirm(`¿Realmente quieres eliminar la sala ${room_id}?`)) return;

    try {
      const response = await axios.delete(`${backendURL}/rooms/${room_id}`, request_config);
      handleRooms();
    }
    catch(error) {
      console.log(error)
    }
  }


  if (loading) {
    return (
      <p>Cargando...</p>
    )
  }

  return (
    rooms.length == 0 ? (
      <p>No hay salas</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sala</th>
            <th>ID Jugador 1</th>
            <th>ID Jugador 2</th>
          </tr>
        </thead>

        <tbody>
          { rooms.map((room, idx) => (
            <tr key={idx}>
              <td>{room.id}</td>
              <td>{room.title}</td>
              <td>{room.player1_id ? room.player1_id : '-'}</td>
              <td>{room.player2_id ? room.player2_id : '-'}</td>
              <td><button className="delete_button" onClick={() => deleteRoom(room.id)}>Eliminar</button></td>
            </tr>
          )) }
        </tbody>
      </table>
    )
  );
}

export default Rooms;