import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import User from "./Components/User/User";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/users/:userId" element={<User />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route
            path="/auth"
            element={
              localStorage.getItem("currentUser") != null ? (
                <Navigate to="/" />
              ) : (
                <Auth />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
