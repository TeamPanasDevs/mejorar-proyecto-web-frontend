import { useQuery } from "@tanstack/react-query";
import { fetchRooms } from "../room";

export function useFetchRooms({ url, token }) {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => fetchRooms({ url, token }),
    enabled: !!token,
  });
}