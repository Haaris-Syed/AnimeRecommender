import React from "react";
import AnimeCard from "./AnimeCard";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import FilterBar from "./FilterBar";

function Home(props) {
  return (
    <main>
      <div className="home-head">
        <Searchbar
          search={props.search}
          handleSearch={props.handleSearch}
          setSearch={props.setSearch}
        />
        <FilterBar />
      </div>
      <div className="anime-list">
        {props.animeList.map((anime, index) => (
          <AnimeCard
            anime={props.animeList[index]}
            animeID={props.animeIDs[index]}
            animeImage={props.animeImages[index]}
            animeLink={props.animeLinks[index]}
            key={props.animeIDs[index]}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;
