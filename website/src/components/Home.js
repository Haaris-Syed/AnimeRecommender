import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import Filters from "./Filters";
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
			<Searchbar 
			search={props.search}
			handleSearch={props.handleSearch}
			setSearch={props.setSearch}
			/>
		<Filters />
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
