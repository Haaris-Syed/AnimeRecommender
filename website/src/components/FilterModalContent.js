import React, { useState, useEffect } from "react";
import "../assets/css/FilterModal.css";
import ValueSlider from "./ValueSlider";

function FilterModalContent() {
  // const [overallValue, setOverallValue] = useState(0.5);
  // const [storyValue, setStoryValue] = useState(0.3);
  // const [animationValue, setAnimationValue] = useState(0.1);
  // const [characterValue, setCharacterValue] = useState(0.1);

  // TO DO:
  // 1) Loading indicator for when database is updating (initial launch
  //  and after customising weights)

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

  // FEELS LIKE THE BUTTON IS ONE CLICK BEHIND?????
  // FIRST CLICK AFTER ADJUSTING VALUES DOESNT WORK?
  const [weightString, setWeightString] = useState(""); //0.5, 0.3, 0.1, 0.1

  const update_recommendation_weights = async () => {
    setWeightString(
      overallValue +
        "," +
        storyValue +
        "," +
        animationValue +
        "," +
        characterValue
    );

    await fetch(`/update_recommendation_weights?query=${weightString}`);
  };

  const [hybridWeightString, setHybridWeightString] = useState("");

  const update_hybrid_weights = async () => {
    setHybridWeightString(contentValue + "," + collaborativeValue);

    await fetch(`/update_hybrid_weights?query=${hybridWeightString}`);
  };

  const update_weights = async () => {
    await update_recommendation_weights();
    await update_hybrid_weights();
  };
  // console.log(`/update_recommendation_weights?query=${weightString}`)

  // console.log((typeof weightString == 'string')
  // console.log(sliderValue)
  const FilterWeightItems = [
    {
      title: "Content-based filtering",
      value: contentValue,
      handleChange: handleContentSliderChange,
    },
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
      title: "Story filtering",
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
      {FilterWeightItems.map((slider, index) => {
        return (
          <ValueSlider
          key={index}
          title={slider.title}
          value={slider.value}
          handleChange={slider.handleChange}
        />
        );  
      })}
      {/* <h3>Content-based filtering</h3>
      <h4>{contentValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={contentValue}
        step={0.1}
        onChange={handleContentSliderChange}
      />
      <h3>Collaborative Filtering</h3>
      <h4>{collaborativeValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={collaborativeValue}
        step={0.1}
        onChange={handleCollaborativeSliderChange}
      />
      <h3>Overall</h3>
      <h4>{overallValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={overallValue}
        step={0.1}
        onChange={handleOverallSliderChange}
        //  onChange={(e) => setOverallValue(e.target.valueAsNumber)}
      />
      <h3>Story</h3>
      <h4>{storyValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={storyValue}
        step={0.1}
        onChange={handleStorySliderChange}
      />
      <h3>Animation</h3>
      <h4>{animationValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={animationValue}
        step={0.1}
        onChange={handleAnimationSliderChange}
      />
      <h3>Character</h3>
      <h4>{characterValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={characterValue}
        step={0.1}
        onChange={handleCharacterSliderChange}
      /> */}

      <div className="submit-values">
        <button className="button" onClick={update_weights}>
          Done
        </button>
      </div>
    </div>
  );
}

export default FilterModalContent;
// update_recommendation_weights
