import {useAuth} from "../context/AuthProvider";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function LogoutPage() {
  const {logout} = useAuth();
  const navigation = useNavigate();
  
  useEffect(() => {
    if(logout) {
      logout();
      navigation("/");
    }
  }, [logout]);
  
  return (
    <div>Loading...</div>
  );
}