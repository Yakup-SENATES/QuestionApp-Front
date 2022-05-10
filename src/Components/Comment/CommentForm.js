import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router";
import { PostWithAuth, RefreshToken } from "../Services/HttpService";
import {
  Avatar,
  Button,
  CardContent,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  comment: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  link: {
    textDecoration: "none",
    boxShadow: "none",
    color: "white",
  },
}));

function CommentForm(props) {
  const { postId, userId, userName, setCommentRefresh } = props;
  const classes = useStyles();
  const [text, setText] = useState("");

  let history = useNavigate();

  const logout = () => {
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("refreshKey");
    localStorage.removeItem("userName");
    history.push("/");
  };

  const saveComment = () => {
    PostWithAuth("/comments", {
      postId: postId,
      userId: userId,
      text: text,
    })
      .then((res) => {
        if (!res.ok) {
          RefreshToken()
            .then((res) => {
              if (!res.ok) {
                logout();
              } else {
                return res.json();
              }
            })
            .then((result) => {
              console.log(result);

              if (result != undefined) {
                localStorage.setItem("tokenKey", result.accessToken);
                saveComment();
                setCommentRefresh();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else res.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSubmit = () => {
    saveComment();
    setText("");
    setCommentRefresh();
  };

  const handleChange = (value) => {
    setText(value);
  };

  return (
    <CardContent className={classes.comment}>
      <OutlinedInput
        id="outlined-adornment-amount"
        multiline
        inputProps={{ maxLength: 250 }}
        fullWidth
        onChange={(i) => handleChange(i.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <Link
              className={classes.link}
              to={{ pathname: "/users/" + userId }}
            >
              <Avatar aria-label="recipe" className={classes.small}>
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Button
              variant="contained"
              style={{
                background: "linear-gradient(45deg,#2196F3 30% , #21CBF3 90%)",
                color: "white",
              }}
              onClick={handleSubmit}
            >
              Comment
            </Button>
          </InputAdornment>
        }
        value={text}
        style={{ color: "black", background: "white" }}
      ></OutlinedInput>
    </CardContent>
  );
}

export default CommentForm;
