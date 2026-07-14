import { useEffect, useState } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";
import type { User } from "@/types/auth.types";

export const useGetCurrentUser = () => {
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosPrivate.get("/user/me");

        setUser(response.data.user)

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    };

    fetchUser()
  }, [axiosPrivate]);

  return {user, loading}
};




