import { useEffect } from "react";

export function validateRoomTitle(title, rooms, setError) {
  useEffect(() => {
    // Eliminamos los espacios en blanco al final y al inicio.
    const trimmed = title.trim();

    // Título no vacio.
    if (trimmed.length === 0) {
      setError('El título no puede estar vacío.');
    // Título no mayor a 8 carácteres.
    } else if (trimmed.length > 15 ) {
      setError('El título no puede superar los 8 carácteres.');
    // Solo letras, números y espacios.
    } else if (!/^[\w\s]+$/.test(trimmed)) {
      setError('Solo se permiten letras, números y espacios.');
    // Títulos sin nombres repetidos.
    } else if (rooms.some(room => room.title === trimmed)) {
      setError('Ya existe una sala con ese título.');
    } else {
      setError('');
    }
  }, [title, rooms]);
}
