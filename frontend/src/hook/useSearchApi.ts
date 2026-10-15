import { api } from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useCallback } from "react";

export const useSearchApi = () => {
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );

  const search = useCallback(async (query: string) => {

    console.log("API SEARCH CALLED:", query);

  const response = await api.get("/search", {
    params: { query },
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  });

  return response.data;
}, [accessToken]);

  return { search };
};