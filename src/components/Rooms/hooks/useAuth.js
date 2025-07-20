export function useAuthInfo() {
  return {
    token: localStorage.getItem('token'),
    currentPlayerId: localStorage.getItem('player_id')
  }
}