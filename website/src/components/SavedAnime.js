import React from "react";
import { useLocation } from "react-router";
import AnimeCard from "./AnimeCard";
import "../assets/css/SavedAnime.css";

function SavedAnime() {
  const { state } = useLocation();

  return (
    <div className="saved">
      <h1 style={{'marginTop': '20px'}}>
        Here are the animes you saved!
        </h1>
      <div className="content-wrap">
        <main>
        <div className="anime-list">
          {state.length !== 0 ? (
            state.map((anime, index) => (
              <AnimeCard
                anime={anime[0]}
                animeLink={anime[1]}
                animeImage={anime[2]}
                animeID={anime[3]}
                key={anime[3]}
              />
            ))
          ) : (
            <h1>Nothing Saved</h1>
          )}
        </div>
        </main>
      </div>
    </div>
  );
}

export default SavedAnime;
