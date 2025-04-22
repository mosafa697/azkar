import React from "react";
import "../styles/ZekrCounter.css";

const ZekrCounter = ({ onClickHandler, counter, isAnimating }) => {
  return (
    <div className="zekr-counter">
      <button
        onClick={onClickHandler}
        className={`counter-btn ${isAnimating ? "bounce" : ""}`}
      >
        {counter}
      </button>
    </div>
  );
};

export default ZekrCounter;
