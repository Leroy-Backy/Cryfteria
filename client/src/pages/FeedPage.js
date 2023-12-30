import {useTransaction} from "../context/TransactionProvider";
import {useEffect, useState} from "react";
import PostsList from "../components/PostsList";
import api from "../utils/Api";
import {useAuth} from "../context/AuthProvider";

export default function FeedPage() {
  const {getPostsForUser} = useTransaction();
  const [posts, setPosts] = useState();
  const {user} = useAuth();

  useEffect(() => {
    if(getPostsForUser && user) {
      let postsBuffer = [];
      
      api.get(`/user/${user.publicAddress}/follows/addresses`).then(async res => {
        for (const address of res.data) {
          console.log("ADDRESSES>>>", address)
          const usrPosts = await getPostsForUser(address);
          postsBuffer = [...postsBuffer, ...usrPosts];
        }
        setPosts(postsBuffer.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0))
      }).catch(err => {
        
      });
    }
  }, [getPostsForUser, user]);
  
  return (
    posts && <PostsList postsAll={posts}/>
  )
}