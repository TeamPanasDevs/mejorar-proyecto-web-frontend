import { useMutation } from "@tanstack/react-query";
import { createRoom } from "../room";

export function useCreateRoom({ url, token, current_player_id }) {
  return useMutation({
    mutationFn: ({ title }) => createRoom({ url, token, current_player_id, title })
  })
}