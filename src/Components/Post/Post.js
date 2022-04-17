import React, { useState, useEffect } from "react";
import "./Post.scss";

function Post(props) {
  const { title, text } = props;

  return (
    <div className="postContainer">
      Title: {title}
      Text: {text}
    </div>
  );
}
export default Post;
