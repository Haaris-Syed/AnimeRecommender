import React, { useState, useEffect } from "react";

function FilterModalContent() {

  // const [overallValue, setOverallValue] = useState(0.5);
  // const [storyValue, setStoryValue] = useState(0.3);
  // const [animationValue, setAnimationValue] = useState(0.1);
  // const [characterValue, setCharacterValue] = useState(0.1);
  
  const [weightString, setWeightString] = useState('')

  // TO DO:
  // 1) Loading indicator for when database is updating (initial launch 
  //  and after customising weights)
  // 2) Check normalising calculatings with custom weights
  
  // ========== OVERALL ==========
  const [overallValue, setOverallValue] = useState(() => {
    // Initialize the slider value from local storage if it exists,
    // or use the default value if it doesn't exist
    const storedValue = localStorage.getItem('overallValue');
    return storedValue !== null ? JSON.parse(storedValue) : 0.5;
  });

  useEffect(() => {
    // Save the slider value to local storage when it changes
    localStorage.setItem('overallValue', JSON.stringify(overallValue));
  }, [overallValue]);

  const handleOverallSliderChange = (event) => {
    setOverallValue(event.target.value);
  };

  // ========== STORY ==========
  const [storyValue, setStoryValue] = useState(() => {
      const storedValue = localStorage.getItem('storyValue');
      return storedValue !== null ? JSON.parse(storedValue) : 0.3;
    });

  useEffect(() => {
    localStorage.setItem('storyValue', JSON.stringify(storyValue));
  }, [storyValue]);

  const handleStorySliderChange = (event) => {
    setStoryValue(event.target.value);
  };

  // ========== ANIMATION ==========
  const [animationValue, setAnimationValue] = useState(() => {
    const storedValue = localStorage.getItem('animationValue');
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem('animationValue', JSON.stringify(animationValue));
  }, [animationValue]);

  const handleAnimationSliderChange = (event) => {
    setAnimationValue(event.target.value);
  };

  // ========== CHARACTER ==========
  const [characterValue, setCharacterValue] = useState(() => {
    const storedValue = localStorage.getItem('characterValue');
    return storedValue !== null ? JSON.parse(storedValue) : 0.1;
  });

  useEffect(() => {
    localStorage.setItem('characterValue', JSON.stringify(characterValue));
  }, [characterValue]);

  const handleCharacterSliderChange = (event) => {
    setCharacterValue(event.target.value);
  };


  // FEELS LIKE THE BUTTON IS ONE CLICK BEHIND?????
  // FIRST CLICK AFTER ADJUSTING VALUES DOESNT WORK?
  const update_recommendation_weights = async () => {
    setWeightString(overallValue + "," + storyValue + "," + animationValue + "," + characterValue)

    await fetch(`/update_recommendation_weights?query=${weightString}`)
  }
  // console.log(`/update_recommendation_weights?query=${weightString}`)

  
  // console.log((typeof weightString == 'string')
  // console.log(sliderValue)

  return (
    <div>
      <h3>Overall</h3>
      <h4 style={{ textAlign: "center" }}>{overallValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={overallValue}
        step={0.1}
        onChange={handleOverallSliderChange}
      />
      <h3>Story</h3>
      <h4 style={{ textAlign: "center" }}>{storyValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={storyValue}
        step={0.1}
        onChange={handleStorySliderChange}
      />
      <h3>Animation</h3>
      <h4 style={{ textAlign: "center" }}>{animationValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={animationValue}
        step={0.1}
        onChange={handleAnimationSliderChange}
      />
      <h3>Character</h3>
      <h4 style={{ textAlign: "center" }}>{characterValue}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={characterValue}
        step={0.1}
        onChange={handleCharacterSliderChange}
      />
      <div className='submit-values'>
          <button className='button' onClick={update_recommendation_weights}>
            Done
          </button>
      </div>
    </div>
  );
}

export default FilterModalContent;
