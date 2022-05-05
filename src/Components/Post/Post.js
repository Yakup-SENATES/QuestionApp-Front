import React, { useState, useEffect, useRef } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { Container } from "@mui/material";
import Comment from "../Comment/Comment";
import clsx from "clsx";
import CommentForm from "../Comment/CommentForm";

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
    position: "end",
    float: "right",
    //transition: theme.transitions.create("transform", {
    //  duration: theme.transitions.duration.shortest,
    //}),
  },
  expandOpen: {
    transform: "rotate(180deg)",
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
  const { title, text, userId, userName, postId } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [liked, setLiked] = useState(false);

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const isInitialMount = useRef(true);

  let disabled = localStorage.getItem("currentUser") == null ? true : false;

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

  const handleExpandClick = () => {
    setExpanded(!expanded);
    refreshComments();
    console.log("CommentList Gelecek ");
    console.log(commentList);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    else refreshComments();
  }, [commentList]);

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
            /* style={liked ? { color: "red" } : null}*/
            aria-label="add to favorites"
          >
            <FavoriteIcon style={liked ? { color: "red" } : null} />
          </IconButton>
        ) : (
          <IconButton onClick={handleLike} aria-label="add to favorites">
            <FavoriteIcon style={liked ? { color: "red" } : null} />
          </IconButton>
        )}

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

        {/*<ExpandMore
          position="end"
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>*/}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Container fixed className={classes.container}>
          {error
            ? "error"
            : isLoaded
            ? commentList.map((comment) => (
                <Comment
                  key={comment.id}
                  userId={1}
                  userName={"USER"}
                  text={comment.text}
                />
              ))
            : "Loading..."}
        </Container>
      </Collapse>
    </Card>
  );
}
export default Post;
