import {useEffect, useState} from "react";
import {useTransaction} from "../context/TransactionProvider";
import PostsList from "../components/PostsList";

export default function TopPostsPage() {
  const {getTopLikedPosts} = useTransaction();
  const [posts, setPosts] = useState();

  useEffect(() => {
    if(getTopLikedPosts) {
      getTopLikedPosts(10).then(res => {
        setPosts(res);
      }).catch(err => {
        
      });
    }
  }, [getTopLikedPosts]);
  
  return (
    posts && <PostsList postsAll={posts}/>
  );
}