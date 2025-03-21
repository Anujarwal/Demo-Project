import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useAuthStatus = () => {
  const { user } = useSelector((state) => state.auth);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChechedIn, setIsChechedIn] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setIsChechedIn(false);
  }, [user]);
  return { isLoggedIn, isChechedIn };
};

export default useAuthStatus;
