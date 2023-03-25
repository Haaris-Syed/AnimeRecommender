import React from "react";
import { useLocation } from 'react-router';

function SavedAnime(animeList) {
    const { state } = useLocation();

    const test = () => {
        console.log(animeList)
        console.log("STATE: ", state)
    }
  return (
    <div>
        <button onClick={test}>TEST</button>

        {state.length !== 0 ? state.map((anime, index) => (
            <li>{anime}</li>
        )) : 
        <h1>Nothing Saved</h1>
        }  
    </div>
  );
}

export default SavedAnime;
