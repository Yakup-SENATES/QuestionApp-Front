import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";

const useStyle = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f5ff",
  },
}));

function Home() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [postList, setPostList] = useState([]);

  const classes = useStyle();

  const refreshPosts = () => {
    fetch("/posts")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setPostList(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    refreshPosts();
  }, [postList]);

  if (error) {
    return <div>Error ocurred</div>;
  } else if (!isLoaded) {
    return <div>Loading ...</div>;
  } else {
    return (
      <div className={classes.container}>
        <PostForm
          userId={1}
          userName={"post.userName"}
          title={"post.title"}
          text={"post.text"}
        />
        {postList.map((post) => (
          <Post
            key={post.id}
            likes={post.postlikes}
            postId={post.id}
            userId={post.userId}
            userName={post.userName}
            title={post.title}
            text={post.text}
          ></Post>
        ))}
      </div>
    );
  }
}

export default Home;
