import React, {useState} from "react";
import * as FiIcons from "react-icons/fi";

function AnimeCard(props) {
  const {anime, id, image, link, onAddAnime} = props
  const [savedAnime, setSavedAnime] = useState([])

  // id is null for some reason

  const addAnimeToSaved = () => {
    onAddAnime(anime)
  }  

  // console.log(savedAnime);
  // console.log(savedAnime.length);
 
  return (
    <article className="anime-card">
      <a href={props.animeLink} target="_blank" rel="noreferrer">
        <figure>
          <img src={props.animeImage} alt="Anime" />
        </figure>
      </a>
      <h3>
        {props.anime}
        <button>
          <FiIcons.FiPlusCircle onClick={addAnimeToSaved} />
        </button>
      </h3>
    </article>
  );
}

export default AnimeCard;
