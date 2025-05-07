import React from "react";

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
