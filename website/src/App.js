import React, { useState, useEffect } from "react";

function App() {
  // const [animeIsLoading, setAnimeIsLoading] = useState(true);
  // const [anime, setAnime] = useState([{}]);

  // const [ratingsIsLoading, setRatingsIsLoading] = useState(true);
  // const [userRatings, setUserRatings] = useState([{}]);

  // const [contentRecommendationsIsLoading, setContentRecommendationsIsLoading] = useState(true);
  // const [contentRecommendations, setContentRecommendations] = useState([{}]);

  const [recommendationsIsLoading, setRecommendationsIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([{}]);

  // useEffect(() => {
  //   fetch("/get_anime_df")
  //     .then((res) => res.json())
  //     .then((anime) => {
  //       setAnime(anime);
  //       setAnimeIsLoading(false);
  //       console.log(anime);
  //     });
  // }, []);

  // useEffect(() => {
  //   fetch("/get_ratings_df")
  //     .then((res) => res.json())
  //     .then((userRatings) => {
  //       setUserRatings(userRatings);
  //       setRatingsIsLoading(false);
  //       console.log(userRatings);
  //     });
  // }, []);

  useEffect(() => {
    fetch("/get_hybrid_recs").then(
      (res) => res.json()
    ).then(
      (recommendations) => {
        setRecommendations(recommendations)
        setRecommendationsIsLoading(false)
        console.log(recommendations)
    });
  }, []);

  // useEffect(() => {
  //   async function fetchAnimeData() {
  //     const response = await fetch("/get_anime_df");
  //     const data = response.json();
  //     setAnime(data);
  //     setAnimeIsLoading(false);
  //   }
  //   fetchAnimeData();
  //   console.log(anime);
  // }, []);

  // useEffect(() => {
  //   async function fetchRatingsData() {
  //     const response = await fetch("/get_user_ratings_df");
  //     const data = response.json();
  //     setUserRatings(data);
  //     setRatingsIsLoading(false);
      
  //   }
  //   fetchRatingsData();
  //   console.log(userRatings);
  // }, []);

  // const animeList = anime.map((anime_title) => {
  //   <p key={anime_title.toString()}>{anime_title}</p>;
  // });

  // const ratingsList = userRatings.map((rating) => {
  //   <p key={rating.toString()}>{rating}</p>;
  // });

  return (
    <div>
      <div>
        {recommendationsIsLoading ? <p>Loading Recommendations...</p> : (
          recommendations.map((anime_title) => (
            <p key={anime_title.toString()}>{anime_title}</p>
          ))
        )}
      </div>
      {/* <div>
        {animeIsLoading ? <p>Loading Anime...</p> : (
          anime.map((anime_title) => (
            <p key={anime_title.toString()}>{anime_title}</p>
          ))
        )}
      </div> */}
      {/* <div>
        {ratingsIsLoading ? <p>Loading Ratings...</p> : (
          userRatings.map((rating, index) => (
            <p key={`${rating}-${index}`}>{rating}</p>
            // the above will give unique IDs in the form of '8-1'
            // rating = 8, index = 1, separated by a hypon
          ))
        )}
      </div> */}
    </div>
  );
}

export default App;
