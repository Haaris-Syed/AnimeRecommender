import React from "react";
import "../assets/css/RecommendationInfo.css";

function RecommendationInfo() {
  return (
    <div className="recommendation-info-container">
      <div className="recommendation-info">
        <h1>Recommendation Information</h1>
        <h4>
          Upon clicking the filters icon next to the searchbar on the homepage,
          sliders with different values will appear on screen. These values are
          the weights used within the recommendation algorithm and can be
          altered to your liking. Each slider represents a similarity type,
          where the similarity type is indicated by the name of that slider, and
          is used to determine the similarity between anime.
          <h3>Content-based filtering:</h3>
          <p>
            Anime features, such as their genre, popularity, and average rating,
            are used to determine the similarity between different animes. Here,
            you are able to adjust the values of each similarity type. Changing
            these values will reflect how much of each similarity type will be
            used in the overall recommendation algorithm, with higher values
            taking precedence over others.
          </p>
          <h3>Collaborative filtering:</h3>
          <p>
            Here, ratings given to animes by other users is the main factor for
            determining the similarity between anime. The ratings are separated
            into sub categories where each slider represents a different
            rating category. Changing these values will reflect how much of each
            similarity type will be used in the overall recommendation
            algorithm, with higher values taking precedence over others.
          </p>
        </h4>
        <h4>
          Once you have adjusted the values to your liking, press the "Done"
          button. Here, the recommendation algorithm will use the values you
          have provided to recommend anime.
        </h4>
        <h4>
          Please note, upon submitting your values, the database will take
          approximately 1 minute to update with the values you have entered.
          Whilst this is happening, you will be unable to search and receive
          recommendations for an anime!
        </h4>
      </div>
    </div>
  );
}

export default RecommendationInfo;
