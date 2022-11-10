import React, { createContext, useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjexpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjexpirationTime - currentTime;
  return remainingDuration;

}

const retriveToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedDuration = localStorage.getItem('expirationTime');

  const remainingDuration = calculateRemainingTime(storedDuration);

  if(remainingDuration < 60000){
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingDuration
  }


}

export const AuthContextProvider = (props) => {
  const tokenData = retriveToken();
  let initialToken;
  if(tokenData){
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userLoggedIn = !!token;
  
  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    if(logoutTimer){
    clearTimeout(logoutTimer);
    }
  }, []);
  
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token',token);
    localStorage.setItem('expirationTime', expirationTime);
    const remainingTime = calculateRemainingTime (expirationTime);

    logoutTimer = setTimeout (logoutHandler, remainingTime);
  };

  useEffect(() => {
    if(tokenData){
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }

  },[tokenData, logoutHandler])

  const contextValue = {
    token: token,
    isLoggedIn: userLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
