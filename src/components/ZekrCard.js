import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increamentFontSize,
  decreamentFontSize,
} from "../store/fontSizeSlice.js";
import { increamentIndex, decreamentIndex } from "../store/indexCountSlice.js";
import "../styles/AzkarCard.css";
import MinusIcon from "../icons/minus.js";
import PlusIcon from "../icons/plus.js";
import HomeIcon from "../icons/home.js";
import ChevronLeftIcon from "../icons/chevron-left.js";
import ChevronRightIcon from "../icons/chevron-right.js";
import ZekrCounter from "./ZekrCounter.js";

export default function ZekrCard({
  phrase,
  counter,
  onPhraseClick,
  isAnimating,
  onBack,
}) {
  const dispatch = useDispatch();
  const fontSize = useSelector((state) => state.fontSize.value);
  const isLastPhrase = useSelector((state) => state.indexCount.isLastPhrase);
  const indexCount = useSelector((state) => state.indexCount.value) + 1;
  const phasesLength = useSelector((state) => state.indexCount.phasesLength);

  return (
    <div className="container">
      <div className="card">
        <div className="controls-container">
          <div className="font-controls">
            <button
              className="font-btn"
              onClick={() => dispatch(decreamentFontSize())}
            >
              <MinusIcon />
            </button>
            <button
              className="font-btn"
              onClick={() => dispatch(increamentFontSize())}
            >
              <PlusIcon />
            </button>
          </div>
          <div className="counter-container">
            <div className="counter-bar"
              style={{
                width: `${(indexCount / phasesLength) * 100}%`,
              }}
            ></div>
          </div>
          <div className="option-controls">
            <button className="back-btn" onClick={onBack}>
              <HomeIcon />
            </button>
          </div>
        </div>
        <h2
          className="phrase"
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
            onClick={() => dispatch(decreamentIndex())}
            style={{ visibility: phrase.id > 1 ? "visible" : "hidden" }}
          >
            <ChevronRightIcon />
          </button>

          <ZekrCounter
            onClickHandler={onPhraseClick}
            counter={phrase.count - counter}
            isAnimating={isAnimating}
          />

          <button
            className="switch-btn"
            onClick={() => dispatch(increamentIndex())}
            style={{ visibility: !isLastPhrase ? "visible" : "hidden" }}
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
