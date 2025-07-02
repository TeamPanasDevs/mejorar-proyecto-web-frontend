import axios from "axios"

export const updatePieceStatus = async (backendURL, request_config, piece_status_id, attributes) => {
  try {
    const response = await axios.put(`${backendURL}/piecestatuses/${piece_status_id}`, attributes, request_config);
    if (response.status === 200) {
      console.log(`Pieza actualizada: ${JSON.stringify(response)}`);
      return response.data;
    }
    return null;
  }
  catch(error) {
    console.log(error);
    return null;
  }
}

export const getPieceStatus = async (backendURL, request_config, piece_status_id) => {
  try {
    const response = await axios.get(`${backendURL}/piecestatuses/${piece_status_id}`, request_config);
    if (response.status === 200) {
      console.log(`Estado Pieza obtenida: ${JSON.stringify(response)}`);
      return response.data;
    }
    return null;
  }
  catch(error) {
    console.log(error);
    return null;
  }
}