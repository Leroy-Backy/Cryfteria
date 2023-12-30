import {useAuth} from "../context/AuthProvider";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectRoutes() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Outlet/> : <Navigate to='/' exact replace/>
};