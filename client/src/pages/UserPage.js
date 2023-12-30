import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthProvider";
import api from "../utils/Api";
import LoadingSpinner from "../components/LoadingSpinner";
import UserCard from "../components/UserCard";
import {useTransaction} from "../context/TransactionProvider";
import PostsList from "../components/PostsList";

export default function UserPage() {
  const navigation = useNavigate();
  const {address} = useParams();
  const [userAddress, setUserAddress] = useState(null);
  const {user, isLoggedIn} = useAuth(); // todo if !isLoggedIn && !address don't allow
  const [renderedUser, setRenderedUser] = useState(null);
  const [rerender, setRerender] = useState(false);
  const [posts, setPosts] = useState(null);
  const {getPostsForUser} = useTransaction();
  
  useEffect(() => {
    if(isLoggedIn && user) {
      if (!address) {
        setUserAddress(user.publicAddress)
      } else {
        setUserAddress(address);
      }
    }
  }, [address, user]);

  useEffect(() => {
    if(!navigation || !userAddress) {
      return;
    }
    api.get(`/user/${userAddress}`).then(res => {
      setRenderedUser(res.data);
    }).catch(err => {
      if(!err.response || err.response.status === 404) {
        navigation("/notfound");
      }

      if(err.response.status === 403) {
        navigation("/accessdenied");
      }
    });
    
    getPostsForUser(userAddress).then(res => {
      setPosts(res);
    }).catch(err => {
      console.log("ERROR WITH POSTS LOADING>>>", err);
    });
  }, [userAddress, navigation, rerender]);
  
  return (
    renderedUser ? 
      <div>
        <UserCard renderedUser={renderedUser} onUserEdit={() => setRerender(prev => !prev)} />
        {posts &&
          <PostsList postsAll={posts}/>
        }
      </div>
      :
      <LoadingSpinner/>
  );
}