import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import Searchbar from "./Searchbar";
import FilterModal from "./FilterModal";
import FilterModalContent from "./FilterModalContent";
import * as BSIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import TopAnimeBar from "./TopAnimeBar";
import "../assets/css/FilterModal.css";

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");
  const [animeIDs, setAnimeIDs] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [animeLinks, setAnimeLinks] = useState([]);

  const getTopAnime = async () => {
    const temp = await fetch(`https://api.jikan.moe/v4/top/anime`).then((res) =>
      res.json()
    );

    setTopAnime(temp.data.slice(0, 10));
  };

  useEffect(() => {
    getTopAnime();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    fetchAnime(search);
  };

  const fetchAnime = async (query) => {
    const temp = await fetch(`/get_hybrid_recs?query=${query}`).then((res) =>
      res.json()
    );

    setAnimeList(temp);
    getAnimeIDs(temp);
    getAnimeImages(temp);
    getAnimeLinks(temp);
  };

  const getAnimeIDs = async (recommendationList) => {
    const animeIDs = await fetch(
      `/get_ids_for_recommendations?query=${recommendationList}`
    ).then((res) => res.json());

    setAnimeIDs(animeIDs);
  };

  const getAnimeImages = async (recommendationList) => {
    const animeImages = await fetch(
      `/get_images_for_recommendations?query=${recommendationList}`
    ).then((res) => res.json());

    setAnimeImages(animeImages);
  };

  const getAnimeLinks = async (recommendationList) => {
    const animeLinks = await fetch(
      `/get_links_for_recommendations?query=${recommendationList}`
    ).then((res) => res.json());

    setAnimeLinks(animeLinks);
  };

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
          <button className="filter-button">
            <BSIcons.BsSliders onClick={toggleModal} />
          </button>
          {showModal && (
            <FilterModal>
              <button className="filter-button">
                <AiIcons.AiOutlineClose onClick={toggleModal} />
              </button>
              <h2
                style={{
                  color: "#fff",
                  padding: "0.5rem",
                  alignContent: "center",
                }}
              >
                Recommendation Algorithm
              </h2>
              <p
                style={{
                  color: "#fff",
                  padding: "0.5rem",
                  alignContent: "center",
                }}
              >
                Here you can change some aspects of the algorithm used to make
                recommendations.
              </p>
              <FilterModalContent />
            </FilterModal>
          )}
          {showModal && <div className="overlay"></div>}
        </div>
        <div className="anime-list">
          {animeList.map((anime, index) => (
            <AnimeCard
              anime={animeList[index]}
              animeID={animeIDs[index]}
              animeImage={animeImages[index]}
              animeLink={animeLinks[index]}
              key={index}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
