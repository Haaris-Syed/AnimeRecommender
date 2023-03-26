import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import Searchbar from "./Searchbar";
import TopAnimeBar from "./TopAnimeBar";

function BrowseAnime() {
  const [browseAnime, setBrowseAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    jikanAnimeSearch(search);
  };

  const getTopAnime = async () => {
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime`).then((res) =>
      res.json()
    );

    setTopAnime(temp.data.slice(0, 10));
  };

  const jikanAnimeSearch = async (query) => {
    const temp = await fetch(
      `https://api.jikan.moe/v4/anime?q=${query}`
    ).then((res) => res.json());

    setBrowseAnime(temp.data);
  };

  useEffect(() => {
    getTopAnime();
  }, []);

  return (
    <div className="content-wrap">
      <TopAnimeBar topAnime={topAnime} />
      <main>
        <div className="home-head">
          <Searchbar
            search={search}
            handleSearch={handleSearch}
            setSearch={setSearch}
          />
          <div className="anime-list">
            {browseAnime.map((anime) => (
              <AnimeCard
                anime={anime.title}
                animeID={anime.mal_id}
                animeImage={anime.images.jpg.image_url}
                animeLink={anime.url}
                key={anime.mal_id}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BrowseAnime;
