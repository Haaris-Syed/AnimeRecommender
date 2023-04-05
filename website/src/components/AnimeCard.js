import React, { useEffect, useState } from "react";
import * as FiIcons from "react-icons/fi";
import * as AiIcons from "react-icons/ai";
import httpClient from "./httpClient";

//react-icons library is taken from 
//https://react-icons.github.io/react-icons/

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

  const [username, setUsername] = useState("");

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
            {username &&
              (!savedAnimeTitles.includes(props.anime) ? (
                <button>
                  <FiIcons.FiPlusCircle onClick={addAnimeToSaved} />
                </button>
              ) : (
                <button>
                  <AiIcons.AiOutlineMinusCircle
                    onClick={removeAnimeFromSaved}
                  />
                </button>
              ))}
          </div>
        ) : (
          <></>
        )}
      </h3>
    </article>
  );
}

export default AnimeCard;
