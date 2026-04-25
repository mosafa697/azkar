import React from "react";

const ZekrCounter = ({ onClickHandler, counter, isAnimating }) => {
  return (
    <div>
      <button
        onClick={onClickHandler}
        className={`flex items-center justify-center w-24 h-24 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-full text-[var(--icon-color)] cursor-pointer text-[3dvh] font-bold transition-transform duration-300 tap-highlight-none hover:bg-[var(--button-hover-bg-color)] ${isAnimating ? "animate-pop" : ""}`}
      >
        {counter}
      </button>
    </div>
  );
};

export default ZekrCounter;
