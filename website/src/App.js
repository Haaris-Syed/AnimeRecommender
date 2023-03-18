import React, { useState, useEffect } from "react";

function App() {
  const [recommendationsIsLoading, setRecommendationsIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([{}]);

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

  return (
      <div className="wrapper">
        {/* <div> */}
          {recommendationsIsLoading ? <p>Loading Recommendations...</p> : (
            recommendations.map((anime_title) => (
              // <p key={anime_title.toString()}>{anime_title}</p>
            <AnimeCard key={anime_title.toString()}
              title={anime_title}
            />
            ))
          )}
        {/* </div> */}
        
      </div>
    );
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

  
}

function AnimeCard(props){
  return(
    <div className="card">
      <div className="card_body">
        {/* <img /> */}
        <h2 className="card_title">
          {props.title}
          <p className="card_description">
            {props.description}
          </p>
        </h2>
      </div>
      <button className="card_button">View Anime</button>
    </div>
  )
}

export default App;
