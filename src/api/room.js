import axios from 'axios';

export async function fetchRooms({ url, token, title, player1_id }) {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${url}/rooms`, config);
  return response.data;
}

export async function createRoom({ url, token, current_player_id, title }) {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(`${url}/rooms`, {
    title: title !== '' ? title: undefined,
    player1_id: current_player_id
  }, config);
  return response.data;
}