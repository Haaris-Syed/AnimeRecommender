import React from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" Component={Home}></Route>
          <Route path="/login" Component={Login}></Route>
          <Route path="/profile" Component={Signup}></Route>
          <Route path="/signup" Component={Signup}></Route>
          <Route path="/logout" Component={Signup}></Route>
          <Route path="/saved" Component={Signup}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
