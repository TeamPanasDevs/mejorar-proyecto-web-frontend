import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { PathsContext } from "../../App";

const Players = () => {
  const {
    backendURL
  } = useContext(PathsContext);

  const token = localStorage.getItem('token');
  const request_config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  
  function handlePlayers() {
    setLoading(true);
    async function setAPIPlayers() {
      try {
        const response = await axios.get(`${backendURL}/players`, request_config);
        response.status == 200 ? setPlayers(response.data) : setPlayers([]);
      }
      catch(error) { console.log(error) }
      setLoading(false);
    }
    setAPIPlayers();
  }

  useEffect(() => {
    handlePlayers();
  }, [])


  async function deletePlayer(player_id) {
    if (!confirm(`¿Realmente quieres eliminar al usuario ${player_id}?`)) return;

    try {
      const response = await axios.delete(`${backendURL}/players/${player_id}`, request_config);
      handlePlayers();
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
    players.length == 0 ? (
      <p>No hay jugadores</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          { players.map((player, idx) => (
            <tr key={idx}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.email}</td>
              <td><button className="delete_button" onClick={() => deletePlayer(player.id)}>Eliminar</button></td>
            </tr>
          )) }
        </tbody>
      </table>
    )
  );
}

export default Players;