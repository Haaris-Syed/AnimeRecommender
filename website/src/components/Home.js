import React, { useState, useEffect } from "react";
import AnimeCard from "./AnimeCard";
import Searchbar from "./Searchbar";
import FilterModal from "./FilterModal";
import FilterModalContent from "./FilterModalContent";
import TopAnimeBar from "./TopAnimeBar";
import { Link } from "react-router-dom";
import * as BSIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import "../assets/css/FilterModal.css";
import "../assets/css/Link.css";
import ClipLoader from "react-spinners/ClipLoader";
import httpClient from "./httpClient";

function Home() {
  const [animeList, setAnimeList] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [search, setSearch] = useState("");
  const [animeIDs, setAnimeIDs] = useState([]);
  const [animeImages, setAnimeImages] = useState([]);
  const [animeLinks, setAnimeLinks] = useState([]);

  // used for loading indicator
  const [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#36d7b7");

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
    setLoading(true);
    const temp = await fetch(`/get_hybrid_recs?query=${query}`).then((res) =>
      res.json()
    );

    setAnimeList(temp);
    getAnimeIDs(temp);
    getAnimeImages(temp);
    getAnimeLinks(temp);

    setLoading(false);
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

  const [savedAnime, setSavedAnime] = useState([]);

  useEffect(() => {
    setSavedAnime(JSON.parse(localStorage.getItem("savedAnimeList")) || []);
  }, []);

  // this will be used to check if we need to add or remove a given title
  // by simply using the anime title
  const [savedAnimeTitles, setSavedAnimeTitles] = useState([]);

  useEffect(() => {
    setSavedAnimeTitles(
      JSON.parse(localStorage.getItem("savedAnimeTitles")) || []
    );
  }, []);

  const handleAddAnime = (animeTitle) => {
    const index = animeList.indexOf(animeTitle);

    const anime = animeList[index];
    const animeLink = animeLinks[index];
    const animeImage = animeImages[index];
    const animeID = animeIDs[index];

    // checks that the list is not empty before checking for duplicate titles
    // as this leads to an error
    if (savedAnimeTitles) {
      if (!savedAnimeTitles.includes(animeTitle)) {
        setSavedAnime([...savedAnime, [anime, animeLink, animeImage, animeID]]);
        setSavedAnimeTitles([...savedAnimeTitles, anime]); //savedAnime?
      }
    }
    // if the list is empty, just update both lists
    else {
      setSavedAnime([...savedAnime, [anime, animeLink, animeImage, animeID]]);
      setSavedAnimeTitles([...savedAnimeTitles, anime]); //savedAnime?
    }

    localStorage.setItem("savedAnimeList", JSON.stringify(savedAnime));
    localStorage.setItem("savedAnimeTitles", JSON.stringify(savedAnimeTitles));
  };

  const handleRemoveAnime = (animeTitle) => {
    // checks that the list is not empty before and if the title is present
    // in the list as these are both conditions needed to remove the anime
    if (savedAnimeTitles && savedAnimeTitles.includes(animeTitle)) {
      const updatedAnimeSaved = savedAnime.filter(
        (anime) => anime[0] !== animeTitle
      );
      const updatedAnimeTitles = savedAnimeTitles.filter(
        (anime) => anime !== animeTitle
      );

      setSavedAnime(updatedAnimeSaved);
      setSavedAnimeTitles(updatedAnimeTitles);

      localStorage.setItem("savedAnimeList", JSON.stringify(savedAnime));
      localStorage.setItem(
        "savedAnimeTitles",
        JSON.stringify(savedAnimeTitles)
      );
    }
  };

  const [username, setUsername] = useState('')

  // checks if a user is logged in
  // The "username" variable is used as a means to confirm if a user 
  // is logged in or not.
  // Empty = No, Not Empty = Yes
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
    <div className="content-wrap">
      <TopAnimeBar topAnime={topAnime} />
      <main>
        <h2 className="title">
          <p className="title-sub">Search a title and get recommendations!</p>
        </h2>
        <div className="home-head">
          <Searchbar
            search={search}
            handleSearch={handleSearch}
            setSearch={setSearch}
            loading={loading}
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
        <div className="loading-icon">
          {loading ? (
            <ClipLoader
              color={color}
              loading={loading}
              cssOverride={{ filter: "none" }}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="anime-list">
          {animeList.map((anime, index) => (
            <AnimeCard
              anime={animeList[index]}
              animeID={animeIDs[index]}
              animeImage={animeImages[index]}
              animeLink={animeLinks[index]}
              onAddAnime={handleAddAnime}
              onRemoveAnime={handleRemoveAnime}
              savedAnimeTitles={savedAnimeTitles}
              key={index}
            />
          ))}
        </div>
          <div className="view-saved-button">
            {username && (
                <Link
                className="saved-anime"
                to="/saved"
                state={JSON.parse(localStorage.getItem("savedAnimeList"))}
              >
                View Saved
              </Link>
              
            )} 
          </div>
      </main>
    </div>
  );
}

export default Home;
