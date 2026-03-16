import { useEffect } from "react";
import { setTokenGetter, axiosInstance } from "../lib/axios";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./msalconfig";
import { useAuthStore } from "../store/authStore";

export default function MsalTokenProvider({ children}: {children: React.ReactNode}) {
  const { instance, accounts } = useMsal();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    if (!accounts.length) {
      setLoading(false);
      setUser(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const tokenGetter = async () => {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    };

    setTokenGetter(tokenGetter);

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/me");
        if (isMounted) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    tokenGetter().then(() => fetchUser());

    return () => {
      isMounted = false;
    };
  }, [accounts, instance, setUser, setLoading]);

  return <>{children}</>;
}