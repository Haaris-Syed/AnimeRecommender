import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import AnimeCard from "./AnimeCard";
import "../assets/css/SavedAnime.css";
import httpClient from "./httpClient";

function SavedAnime() {
  const { state } = useLocation();

  const [username, setUsername] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get(
          "http://127.0.0.1:5000/get_current_user"
        );
        
        setUsername(resp.data.username);

      } catch (error) {
        console.log("Not Authenticated");
      }
    })();
  }, []);

  return (
    <div className="saved">
      {username && <h1 className="welcome">Welcome, @{username}</h1>}
      <h2 style={{'marginTop': '20px'}}>
        Here are the animes you saved!
        </h2>
      <div className="content-wrap">
        <main>
        <div className="anime-list">
          {state && state.length !== 0 ? (
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
