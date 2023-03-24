import React from "react";
import * as FiIcons from "react-icons/fi";

function AnimeCard(props) {
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
          <FiIcons.FiPlusCircle style={{}} />
        </button>
      </h3>
    </article>
  );
}

export default AnimeCard;
