import React from "react";
import "../styles/AzkarCard.css";
import MinusIcon from "../icons/minus.js";
import PlusIcon from "../icons/plus.js";
import HomeIcon from "../icons/home.js";
import ChevronLeftIcon from "../icons/chevron-left.js";
import ChevronRightIcon from "../icons/chevron-right.js";

export default function ZekrCard({
  phrase,
  counter,
  onPhraseClick,
  onNext,
  onPrev,
  onBack,
  isLastPhrase,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
}) {
  return (
    <div className="container">
      <div className="card">
        <div className="controls-container">
          <div className="font-controls">
            <button className="font-btn" onClick={onDecreaseFontSize}>
              <MinusIcon />
            </button>
            <button className="font-btn" onClick={onIncreaseFontSize}>
              <PlusIcon />
            </button>
          </div>
          <div className="counter-container">
            <h2>
              {counter} / {phrase.count}
            </h2>
          </div>
          <div className="option-controls">
            <button className="back-btn" onClick={onBack}>
              <HomeIcon />
            </button>
          </div>
        </div>
        <h2
          className="phrase"
          onClick={onPhraseClick}
          style={{
            fontSize: `${fontSize}px`,
            whiteSpace: "pre-line",
          }}
        >
          {phrase.text}
        </h2>

        <div className="buttons-container">
          <button
            className="switch-btn"
            onClick={onPrev}
            style={{ visibility: phrase.id > 1 ? "visible" : "hidden" }}
          >
            <ChevronRightIcon />
          </button>

          <button
            className="switch-btn"
            onClick={onNext}
            style={{ visibility: !isLastPhrase ? "visible" : "hidden" }}
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
