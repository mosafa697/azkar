import React from "react";
import config from "../config/config";
import useTimeGuardedCallback from "../utils/useTimeGuardedCallback";

const ZekrCounter = ({ onClickHandler, counter, isAnimating }) => {
  const handleClick = useTimeGuardedCallback(
    (e) => {
      e?.stopPropagation?.();
      onClickHandler?.(e);
    },
    config.interaction.counterGuardMs
  );

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center w-24 h-24 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-full text-[var(--icon-color)] cursor-pointer text-[5dvh] font-black font-[ScheherazadeNew,Cairo,sans-serif] transition-transform duration-300 tap-highlight-none hover:bg-[var(--button-hover-bg-color)] ${isAnimating ? "animate-pop" : ""}`}
      >
        {counter}
      </button>
    </div>
  );
};

export default ZekrCounter;
