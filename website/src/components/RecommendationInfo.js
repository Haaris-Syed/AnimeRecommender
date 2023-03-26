import React from "react";
import "../assets/css/RecommendationInfo.css";

function RecommendationInfo() {
  return (
    <div className="recommendation-info-container">
      <div className="recommendation-info">
        <h1>Recommendation Information</h1>
        <h4>
          Upon clicking the filters icon next to the searchbar on the homepage,
          sliders with different values which you can adjust will appear on
          screen. These values are the weights used within the recommendation
          algorithm. With each value there is an assigned category.
          <li>Content-based filtering: reflects a user's overall satisfaction of an anime</li>
          <li>Collaborative filtering: reflects how good the story is of an anime.</li>
          <li>Overall: reflects a user's overall satisfaction of an anime</li>
          <li>Story: reflects how good the story is of an anime.</li>
          <li>
            Character: reflects character development, how likeable the
            characters are and their overall influence in an anime.
          </li>
          <li>Animation: reflects the animation quality of an anime</li>
        </h4>
        <h4>
          With each of these categories, you can adjust the values to tailor to
          your needs. Do you want animes that have really good animation? Select
          a higher value for the Animation category. Is the story more important
          to you? Give it a higher value.
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
