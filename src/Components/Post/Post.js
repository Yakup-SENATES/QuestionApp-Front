import React, { useState, useEffect, useRef } from "react";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { Container } from "@mui/material";
import Comment from "../Comment/Comment";
import clsx from "clsx";
import CommentForm from "../Comment/CommentForm";
import { DeleteWithAuth, PostWithAuth } from "../Services/HttpService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 900,
    textAlign: "left",
    margin: 20,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    float: "right",
    margin: "auto",
    //transition: theme.transitions.create("transform", {
    //  duration: theme.transitions.duration.shortest,
    //}),
  },
  expandOpen: {
    transform: "rotate(90deg)",
  },
  avatar: {
    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  },
  link: {
    textDecoration: "none",
    boxShadow: "none",
    color: "white",
  },
}));

function Post(props) {
  const { title, text, userId, userName, postId, likes } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const isInitialMount = useRef(true);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [likeId, setLikeId] = useState(null);
  const [refresh, setRefresh] = useState(false);

  let disabled = localStorage.getItem("currentUser") == null ? true : false;

  const setCommentRefresh = () => {
    setRefresh(true);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();
    console.log("CommentList : ", commentList);
  };
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      saveLike();
      setLikeCount(likeCount + 1);
    } else {
      deleteLike();
      setLikeCount(likeCount - 1);
    }
  };
  const refreshComments = () => {
    fetch("/comments?postId=" + postId)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setCommentList(result);
        },
        (error) => {
          console.log(error);
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const saveLike = () => {
    PostWithAuth("/likes", {
      postId: postId,
      userId: localStorage.getItem("currentUser"),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const deleteLike = () => {
    DeleteWithAuth("/likes/" + likeId).catch((err) => console.log(err));
  };

  const checkLikes = () => {
    var likeControl = likes.find(
      (like) => "" + like.userId === localStorage.getItem("currentUser")
    );
    if (likeControl != null) {
      setLikeId(likeControl.id);
      setIsLiked(true);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    else refreshComments();
  }, [refresh]);

  useEffect(() => {
    checkLikes();
  }, []);

  return (
    //<Card className={classes.root} sx={{ width: 800, margin: 2 }}>
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Link to={{ pathname: "/users/" + userId }} className={classes.link}>
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              /*sx={{
                background: "linear-gradient(45deg,#2196F3 30% , #21CBF3 90%)",
              }}*/
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        }
        title={title}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {disabled ? (
          <IconButton
            disabled
            onClick={handleLike}
            aria-label="add to favorites"
          >
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        ) : (
          <IconButton onClick={handleLike} aria-label="add to favorites">
            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
          </IconButton>
        )}
        {likeCount}

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed className={classes.container}>
          {error
            ? "error"
            : isLoaded
            ? commentList.map((comment) => (
                <Comment
                  key={comment.id}
                  userId={comment.userId}
                  userName={comment.userName}
                  text={comment.text}
                />
              ))
            : "Loading..."}
          <CommentForm
            userId={localStorage.getItem("currentUser")}
            userName={localStorage.getItem("userName")}
            postId={postId}
            setCommentRefresh={setCommentRefresh}
          />
        </Container>
      </Collapse>
    </Card>
  );
}
export default Post;
