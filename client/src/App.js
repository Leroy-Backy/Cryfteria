import './App.css';
import {useEffect, useState} from "react";
import {useAuth} from "./context/AuthProvider";
import LoadingSpinner from "./components/LoadingSpinner";
import {Navigate, Route, Routes} from "react-router-dom";
import ProtectRoutes from "./utils/ProtectedRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import LogoutPage from "./pages/LogoutPage";
import TestPage from "./pages/TestPage";
import {Container} from "react-bootstrap";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import PostsPage from "./pages/PostsPage";
import TopPostsPage from "./pages/TopPostsPage";
import FeedPage from "./pages/FeedPage";

function App() {
  const [isInit, setInit] = useState(false);
  const {onAppInit, user} = useAuth();

  useEffect(() => {
    if(!isInit && onAppInit) {
      onAppInit(setInit);
    }
  }, [isInit, onAppInit]);
  
  return (
    isInit ? 
      <div className="App">
        <Header/>
        <Container>
          <Routes>
            <Route path="/" element={<TestPage/>}/>
            <Route element={<ProtectRoutes/>}>
              <Route path="/user">
                <Route index element={<UserPage/>}/>
                <Route path=":address" element={<UserPage/>}/>
              </Route>
            </Route>
            <Route path="/posts">
              <Route index element={<PostsPage/>}/>
              <Route path="/posts/top" element={<TopPostsPage/>}/>
              <Route path="/posts/feed" element={<FeedPage/>}/>
            </Route>
            <Route path="/logout" element={<LogoutPage/>}/>
            <Route path="/notfound" element={<NotFoundPage/>}/>
            <Route path="/accessdenied" element={<AccessDeniedPage/>}/>
            <Route path="*" element={<Navigate to="/notfound" replace />}/>
          </Routes>
        </Container>
      </div>
      :
      <LoadingSpinner/>
  );
}

export default App;
