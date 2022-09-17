import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import TweetInput from "./TweetInput";
import Post from "./Post";
import styles from "./Feed.module.css";

const Feed: React.FC = () => {
  const [posts, setPosts] = useState([
    {
      avatar: "",
      id: "",
      imageUrl: "",
      text: "",
      timestamp: null,
      username: "",
      uid: "",
    },
  ]);

  // 初期表示のみ実行
  useEffect(() => {
    //Firebase ver9 compliant (modular)
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        // すべてのデータを持ってくる
        snapshot.docs.map((doc) => ({
          avatar: doc.data().avatar,
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          text: doc.data().text,
          timestamp: doc.data().timestamp,
          username: doc.data().username,
          uid: doc.data().uid,
        }))
      );
    });
    return () => {
      unSub();
    };
  }, []);

  return (
    <div className={styles.feed}>
      <TweetInput />
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              avatar={post.avatar}
              imageUrl={post.imageUrl}
              text={post.text}
              timestamp={post.timestamp}
              username={post.username}
              uid={post.uid}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
