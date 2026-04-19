import { useState } from "react";

export default function useAuthToken() {
  const [token, setTokenState] = useState(localStorage.getItem("token") || "");

  const setToken = (nextToken) => {
    if (nextToken) {
      localStorage.setItem("token", nextToken);
    } else {
      localStorage.removeItem("token");
    }

    setTokenState(nextToken || "");
  };

  return { token, setToken };
}

