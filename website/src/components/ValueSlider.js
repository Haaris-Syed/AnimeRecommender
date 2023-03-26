import React from "react";

function ValueSlider(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <h4>{props.value}</h4>
      <input
        type="range"
        min={0}
        max={1}
        value={props.value}
        step={0.1}
        onChange={props.handleChange}
      />
    </div>
  );
}

export default ValueSlider;
