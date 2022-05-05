import React, { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Button, InputAdornment, OutlinedInput } from "@material-ui/core";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

//const ExpandMore = styled((props) => {
//  const { expand, ...other } = props;
//  return <IconButton {...other} />;
//})(({ theme }) => ({
//  marginLeft: "auto",
//  transition: theme.transitions.create("transform", {
//    duration: theme.transitions.duration.shortest,
//  }),
//}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PostForm(props) {
  const { userId, userName, refreshPost } = props;
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isSend, setIsSend] = useState(false);

  const savePost = () => {
    fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        title: title,
        text: text,
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.log(error));
  };

  const handleSubmit = () => {
    savePost();
    setIsSend(true);
    setText("");
    setTitle("");
    refreshPost();
  };
  const handleTitle = (value) => {
    setTitle(value);
    setIsSend(false);
  };
  const handleText = (value) => {
    setText(value);
    setIsSend(false);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSend(false);
  };

  return (
    <div className="postContainer">
      <div>
        <Snackbar open={isSend} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Post gönderildi !!
          </Alert>
        </Snackbar>
      </div>
      <Card sx={{ width: 900, margin: 2 }}>
        <CardHeader
          avatar={
            <Link to={{ pathname: "/users/" + userId }} className="link">
              <Avatar
                sx={{
                  background:
                    "linear-gradient(45deg,#2196F3 30% , #21CBF3 90%)",
                }}
                aria-label="recipe"
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
          }
          title={
            <OutlinedInput
              id="outlined-adornment-amount"
              multiline
              placeholder="Title"
              inputProps={{ maxLength: 25 }}
              fullWidth
              value={title}
              onChange={(i) => handleTitle(i.target.value)}
            ></OutlinedInput>
          }
        />

        <CardContent>
          <Typography variant="body2" color="text.secondary" component="span">
            <OutlinedInput
              id="outlined-adornment-amount"
              multiline
              placeholder="Text"
              inputProps={{ maxLength: 250 }}
              fullWidth
              value={text}
              onChange={(i) => handleText(i.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    style={{
                      background:
                        "linear-gradient(45deg,#2196F3 30% , #21CBF3 90%)",
                      color: "white",
                    }}
                    onClick={handleSubmit}
                  >
                    Post
                  </Button>
                </InputAdornment>
              }
            ></OutlinedInput>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
export default PostForm;
