import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar() {
  let userId = 3;
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" className="link">
                Home
              </Link>
            </Typography>
            <Link to={{ pathname: "/users/" + userId }} className="link">
              User
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <style>
        {`  .link { 
        text-decoration: none;
        boxShadow:none;
        color: white;
      `}
      </style>
    </div>
  );
}

export default Navbar;
