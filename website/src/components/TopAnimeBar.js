import React from "react";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Home'

function TopAnimeBar({ topAnime }) {
  return (
    <div>
      <aside>
        <nav>
          <h3>Top Anime</h3>
          {topAnime.map((anime) => (
            <a
              href={anime.url}
              target="_blank"
              key={anime.mal_id}
              rel="noreferrer"
            >
              {anime.title}
            </a>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default TopAnimeBar;
