import React, { useState } from "react";
import AnimeCard from "./AnimeCard";
import Navbar from "./Navbar";
import Searchbar from "./Searchbar";
import FilterBar from "./FilterBar";
import FilterModal from "./FilterModal";
import * as BSIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import "../assets/css/Filters.css";
import "../assets/css/FilterModal.css";

function Home(props) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <main>
      <div className="home-head">
        <Searchbar
          search={props.search}
          handleSearch={props.handleSearch}
          setSearch={props.setSearch}
        />
        {/* <FilterBar /> */}
        <button className="filter-button">
          <BSIcons.BsSliders onClick={toggleModal} />
        </button>
        {showModal && (
          <FilterModal>
            <button className="filter-button">
              <AiIcons.AiOutlineClose onClick={toggleModal} />
            </button>
            <h2>Recommendation Algorithm</h2>
            <p>
              Here you can change some aspects of the algorithm used to make
              recommendations.
            </p>
          </FilterModal>
        )}
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
