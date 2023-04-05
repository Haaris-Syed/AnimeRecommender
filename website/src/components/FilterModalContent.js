import React, { useState, useEffect } from "react";
import "../assets/css/FilterModal.css";
import ValueSlider from "./ValueSlider";
import ClipLoader from "react-spinners/ClipLoader";

// react-spinners library taken from
// https://www.davidhu.io/react-spinners/

function FilterModalContent() {

  const [loading, setLoading] = useState(false);
  let [color, setColor] = useState("#36d7b7");
  
  // ========== COLLABORATIVE FILTERING VALUES ==========
  const [collaborativeValue, setCollaborativeValue] = useState(() => {
    const storedValue = localStorage.getItem("collaborativeValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.6;
  });

  useEffect(() => {
    localStorage.setItem(
      "collaborativeValue",
      JSON.stringify(collaborativeValue)
    );
  }, [collaborativeValue]);

  const handleCollaborativeSliderChange = (event) => {
    setCollaborativeValue(event.target.value);
  };

  // ========== OVERALL ==========
  const [overallValue, setOverallValue] = useState(() => {
    // Initialize the slider value from local storage if it exists,
    // or use the default value if it doesn't exist
    const storedValue = localStorage.getItem("overallValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.5;
  });

  useEffect(() => {
    // Save the slider value to local storage when it changes
    localStorage.setItem("overallValue", JSON.stringify(overallValue));
  }, [overallValue]);

  const handleOverallSliderChange = (event) => {
    setOverallValue(event.target.value);
  };

  // ========== STORY ==========
  const [storyValue, setStoryValue] = useState(() => {
    const storedValue = localStorage.getItem("storyValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.3;
  });

  useEffect(() => {
    localStorage.setItem("storyValue", JSON.stringify(storyValue));
  }, [storyValue]);

  const handleStorySliderChange = (event) => {
    setStoryValue(event.target.value);
  };

  // ========== ANIMATION ==========
  const [animationValue, setAnimationValue] = useState(() => {
    const storedValue = localStorage.getItem("animationValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem("animationValue", JSON.stringify(animationValue));
  }, [animationValue]);

  const handleAnimationSliderChange = (event) => {
    setAnimationValue(event.target.value);
  };

  // ========== CHARACTER ==========
  const [characterValue, setCharacterValue] = useState(() => {
    const storedValue = localStorage.getItem("characterValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem("characterValue", JSON.stringify(characterValue));
  }, [characterValue]);

  const handleCharacterSliderChange = (event) => {
    setCharacterValue(event.target.value);
  };

  // ========== CONTENT-BASED FILTERING VALUES ==========
  const [contentValue, setContentValue] = useState(() => {
    const storedValue = localStorage.getItem("contentValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.4;
  });

  useEffect(() => {
    localStorage.setItem("contentValue", JSON.stringify(contentValue));
  }, [contentValue]);

  const handleContentSliderChange = (event) => {
    setContentValue(event.target.value);
  };

  // ========== GENRE ==========
  const [genreValue, setGenreValue] = useState(() => {
    const storedValue = localStorage.getItem("genreValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.3;
  });

  useEffect(() => {
    localStorage.setItem("genreValue", JSON.stringify(genreValue));
  }, [genreValue]);

  const handleGenreSliderChange = (event) => {
    setGenreValue(event.target.value);
  };

  // ========== MEMBERS ==========
  const [memberValue, setMemberValue] = useState(() => {
    const storedValue = localStorage.getItem("memberValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem("memberValue", JSON.stringify(memberValue));
  }, [memberValue]);

  const handleMemberSliderChange = (event) => {
    setMemberValue(event.target.value);
  };

  // ========== RATINGS ==========
  const [ratingValue, setRatingValue] = useState(() => {
    const storedValue = localStorage.getItem("ratingValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.4;
  });

  useEffect(() => {
    localStorage.setItem("ratingValue", JSON.stringify(ratingValue));
  }, [ratingValue]);

  const handleRatingSliderChange = (event) => {
    setRatingValue(event.target.value);
  };

  // ========== POPULARITY ==========
  const [popularityValue, setPopularityValue] = useState(() => {
    const storedValue = localStorage.getItem("popularityValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem("popularityValue", JSON.stringify(popularityValue));
  }, [popularityValue]);

  const handlePopularitySliderChange = (event) => {
    setPopularityValue(event.target.value);
  };

  // ========== EPISODES ==========
  const [episodesValue, setEpisodesValue] = useState(() => {
    const storedValue = localStorage.getItem("episodesValue");
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem("episodesValue", JSON.stringify(episodesValue));
  }, [episodesValue]);

  const handleEpisodesSliderChange = (event) => {
    setEpisodesValue(event.target.value);
  };

  // ========== FETCH HYBRID RECOMMENDATIONS ==========
  const [contentWeightString, setContentWeightString] = useState("");
  const [collaborativeWeightString, setCollaborativeWeightString] = useState("");

  const updateContentWeights = async () => {
    setContentWeightString(
      genreValue +
        "," +
        memberValue +
        "," +
        ratingValue +
        "," +
        popularityValue +
        "," +
        episodesValue
    );

    await fetch(`/update_content_weights?query=${contentWeightString}`);
  };

  const updateCollaborativeWeights = async () => {
    setCollaborativeWeightString(
      overallValue +
        "," +
        storyValue +
        "," +
        animationValue +
        "," +
        characterValue
    );

    await fetch(
      `/update_collaborative_weights?query=${collaborativeWeightString}`
    );
  };

  const [hybridWeightString, setHybridWeightString] = useState("");

  const updateHybridWeights = async () => {
    setHybridWeightString(contentValue + "," + collaborativeValue);

    await fetch(`/update_hybrid_weights?query=${hybridWeightString}`);
  };

  const updateWeights = async () => {
    setLoading(true);

    await updateContentWeights();
    await updateCollaborativeWeights();
    await updateHybridWeights();

    setLoading(false);
  };

  const ContentWeightItems = [
    {
      title: "Content-based filtering",
      value: contentValue,
      handleChange: handleContentSliderChange,
    },
    {
      title: "Genre Similarity",
      value: genreValue,
      handleChange: handleGenreSliderChange,
    },
    {
      title: "Members Similarity",
      value: memberValue,
      handleChange: handleMemberSliderChange,
    },
    {
      title: "Rating Similarity",
      value: ratingValue,
      handleChange: handleRatingSliderChange,
    },
    {
      title: "Popularity Similarity",
      value: popularityValue,
      handleChange: handlePopularitySliderChange,
    },
    {
      title: "Episode Similarity",
      value: episodesValue,
      handleChange: handleEpisodesSliderChange,
    },
  ];

  const CollaborativeWeightItems = [
    {
      title: "Collaborative based filtering",
      value: collaborativeValue,
      handleChange: handleCollaborativeSliderChange,
    },
    {
      title: "Overall",
      value: overallValue,
      handleChange: handleOverallSliderChange,
    },
    {
      title: "Story",
      value: storyValue,
      handleChange: handleStorySliderChange,
    },
    {
      title: "Animation",
      value: animationValue,
      handleChange: handleAnimationSliderChange,
    },
    {
      title: "Character",
      value: characterValue,
      handleChange: handleCharacterSliderChange,
    },
  ];

  return (
    <div className="modal-values">
      <h2>Content-based Filtering Weights</h2>
      {ContentWeightItems.map((slider, index) => {
        return (
          <ValueSlider
            key={index}
            title={slider.title}
            value={slider.value}
            handleChange={slider.handleChange}
          />
        );
      })}
      <h2>Collaborative Filtering Weights</h2>
      {CollaborativeWeightItems.map((slider, index) => {
        return (
          <ValueSlider
            key={index}
            title={slider.title}
            value={slider.value}
            handleChange={slider.handleChange}
          />
        );
      })}
      <div className="submit-values">
        <button className="button" onClick={updateWeights}>
          Done
        </button>
        {loading ? (
          <ClipLoader
            color={color}
            loading={loading}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default FilterModalContent;
