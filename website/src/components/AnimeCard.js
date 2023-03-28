import React, { useState } from "react";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";

function AnimeCard(props) {
  const {
    anime,
    id,
    image,
    link,
    onAddAnime,
    onRemoveAnime,
    savedAnimeTitles,
  } = props;

  const addAnimeToSaved = () => {
    onAddAnime(anime);
  };

  const removeAnimeFromSaved = () => {
    onRemoveAnime(anime);
  };

  return (
    <article className="anime-card">
      <a href={props.animeLink} target="_blank" rel="noreferrer">
        <figure>
          <img src={props.animeImage} alt="Anime" />
        </figure>
      </a>
      <h3>
        {props.anime}
        {window.location.pathname === "/" ? (
          <div>
            {!savedAnimeTitles.includes(props.anime) ? (
              <button>
                <FiIcons.FiPlusCircle onClick={addAnimeToSaved} />
              </button>
            ) : (
              <button>
                <AiIcons.AiOutlineMinusCircle onClick={removeAnimeFromSaved} />
              </button>
            )}
          </div>
        ) : (
          <>
          </>
        )}
      </h3>
    </article>
  );
}

export default AnimeCard;
