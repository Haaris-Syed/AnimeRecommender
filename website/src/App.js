import React, { useState, useMemo } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SavedAnime from "./components/SavedAnime";
import RecommendationInfo from "./components/RecommendationInfo";
import BrowseAnime from "./components/BrowseAnime";

function App() {
  const [savedList, setSavedList] = useState([]);

  const value = useMemo(
    () => ({ savedList, setSavedList }),
    [savedList, setSavedList]
  );

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
            <Route path="/" Component={Home}></Route>
            <Route path="/browse" Component={BrowseAnime}></Route>
            <Route path="/information" Component={RecommendationInfo}></Route>
            <Route path="/saved" Component={SavedAnime}></Route>
            <Route path="/login" Component={Login}></Route>
            <Route path="/signup" Component={Signup}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
