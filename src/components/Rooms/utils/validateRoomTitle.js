export function validateRoomTitle(title, rooms) {
  if (!title.trim()) return 'El título no puede estar vacío.';
  const duplicate = rooms.some(r => r.title.toLowerCase() === title.toLowerCase());
  if (duplicate) return 'Ese título ya está ocupado.';
  return '';
}
