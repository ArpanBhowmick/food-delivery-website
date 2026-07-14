import useRefreshToken from "@/hook/useRefreshToken";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {

  const refreshToken = useRefreshToken();

  const auth = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {

      try {
        if (!auth.accessToken) {
          await refreshToken();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    verifyRefreshToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log("Redux State:", auth);

  return <Outlet />;
};

export default PersistLogin;
