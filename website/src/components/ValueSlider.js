import React, { useState } from "react";

function ValueSlider() {
  const [overallValue, setOverallValue] = useState(0.5);
  const [storyValue, setStoryValue] = useState(0.5);
  const [animationValue, setAnimationValue] = useState(0.5);
  const [characterValue, setCharacterValue] = useState(0.5);

  return (
    <div>
      <h3>Overall</h3>
      <h4 style={{textAlign: 'center'}}>{overallValue}</h4>
      <input type='range' 
        min={0}
        max={1}
        value={overallValue}
        step={0.1}
        onChange={(e) => setOverallValue(e.target.valueAsNumber)}
      />
      <h3>Story</h3>
      <h4 style={{textAlign: 'center'}}>{storyValue}</h4>
      <input type='range' 
        min={0}
        max={1}
        value={storyValue}
        step={0.1}
        onChange={(e) => setStoryValue(e.target.valueAsNumber)}
      />
      <h3>Animation</h3>
      <h4 style={{textAlign: 'center'}}>{animationValue}</h4>
      <input type='range' 
        min={0}
        max={1}
        value={animationValue}
        step={0.1}
        onChange={(e) => setAnimationValue(e.target.valueAsNumber)}
      />
      <h3>Character</h3>
      <h4 style={{textAlign: 'center'}}>{characterValue}</h4>
      <input type='range' 
        min={0}
        max={1}
        value={characterValue}
        step={0.1}
        onChange={(e) => setCharacterValue(e.target.valueAsNumber)}
      />
    </div>
  );
}

export default ValueSlider;
