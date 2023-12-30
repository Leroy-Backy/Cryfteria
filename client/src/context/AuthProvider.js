import {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../utils/Api"

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  
  const login = (signFunction) => {
    return new Promise((resolve, reject) => {
      signFunction().then(res => {
        console.log("LOGIN>>>", res)
        localStorage.setItem("jwt", res.data.token);
        getCurrentUser().then(res => {
          setUser(res.data);
          setLoggedIn(true);
          navigate("/user");
          resolve();
        }).catch(err => {
          logout();
          reject(err)
        });
      }).catch(err => {
        reject(err);
      })
    })
  };
  
  const onAppInit = (setInit) => {
    if (!!localStorage.getItem("jwt")) {
      getCurrentUser().then(res => {
        setUser(res.data);
        setLoggedIn(true);
        setInit(true);
      }).catch(err => {
        logout();
        setInit(true);
      });
    } else {
      logout();
      setInit(true);
    }
  }
  
  const getCurrentUser = () => {
    return api.get("/user/current");
  }
  
  const logout = () => {
    localStorage.removeItem("jwt");
    setUser({});
    setLoggedIn(false);
  }
  
  return (
    <AuthContext.Provider value={{login, logout, isLoggedIn, onAppInit, user}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}

