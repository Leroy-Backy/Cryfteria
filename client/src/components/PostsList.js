import PostComponent from "./PostComponent";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function PostsList({postsAll}) {
  console.log("POSTS_ALLL", postsAll)
  const [posts, setPosts] = useState(postsAll.slice(0, 15));
  const [hasMore, setHasMore] = useState(true);
  
  useEffect(() => {
    if(postsAll.length <= posts.length) {
      setHasMore(false);
    }
  }, [posts]);
  
  const next = () => {
    setPosts(prev => [...prev, ...postsAll.slice(posts.length, posts.length + 15)]);
  }

  return (
    <div className="m-auto mb-4">
      <InfiniteScroll 
        next={next} 
        hasMore={hasMore} 
        loader={<div>Loading...</div>} 
        dataLength={posts.length}
      >
        <div>
          {posts.map(post => (
            <div  key={post.hashKey}><PostComponent key={post.hashKey} {...post}/></div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}