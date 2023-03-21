import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home(props) {
  // const [animeList, setAnimeList] = useState([])

  // useEffect(() => {
  // 	getAnimeValues();
  // }, [])

  // const getAnimeValues = async () => {
  // 	let anime = []

  // 	for (let key in props.animeList){
  // 		anime.push(props.animeList[key])
  // 	}
  // 	console.log("ANIME LIST: ", anime)
  // 	setAnimeList(anime)
  // }

  return (
    <main>
      <div className="home-head">
        <form className="search-box" onSubmit={props.handleSearch}>
          <input
            type="search"
            placeholder="Enter an anime..."
            required
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
          />
        </form>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" exact component={Home} />
          </Routes>
        </Router>
      </div>
      <div className="anime-list">
        {props.animeList.map((anime, index) => (
          <AnimeCard
            anime={props.animeList[index]}
            animeID={props.animeIDs[index]}
            animeImage={props.animeImages[index]}
            animeLink={props.animeLinks[index]}
            // key={anime.mal_id}
            key={props.animeIDs[index]}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;
