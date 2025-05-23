import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementIndex, decrementIndex } from "../store/indexCountSlice.js";
import {
  incrementFontScale,
  decrementFontScale,
} from "../store/fontScaleSlice.js";
import {
  MinusIcon,
  PlusIcon,
  HomeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../icons/iconRepo.js";
import ZekrCounter from "./ZekrCounter.js";
import SubPhrase from "./SubPhase.js";

export default function ZekrCard({
  phrase,
  counter,
  onPhraseClick,
  isAnimating,
  onBack,
}) {
  const dispatch = useDispatch();
  const fontScale = useSelector((state) => state.fontScale.value);
  const isLastPhrase = useSelector((state) => state.indexCount.isLastPhrase);
  const indexCount = useSelector((state) => state.indexCount.value);
  const phasesLength = useSelector((state) => state.indexCount.phasesLength);
  const showSubText = useSelector((state) => state.subText.value);

  return (
    <div className="zekr-container">
      <div className="zekr-card">
        <div className="controls-container">
          <div className="font-controls">
            <button
              className="font-btn"
              onClick={() => dispatch(decrementFontScale())}
            >
              <MinusIcon />
            </button>
            <button
              className="font-btn"
              onClick={() => dispatch(incrementFontScale())}
            >
              <PlusIcon />
            </button>
            <button style={{ visibility: "hidden" }}></button>
            {/* TODO: find another way */}
          </div>
          <div className="counter-container">
            <div
              className="counter-bar"
              style={{
                width: `${(indexCount / phasesLength) * 100}%`,
              }}
            ></div>
          </div>
          <div className="option-controls">
            <button style={{ visibility: "hidden" }}></button>
            {/* TODO: find another way */}
            <button style={{ visibility: "hidden" }}></button>
            {/* TODO: find another way */}
            <button className="back-btn" onClick={onBack}>
              <HomeIcon />
            </button>
          </div>
        </div>
        <div className="content-container" onClick={onPhraseClick}>
          <h2
            className="phrase"
            style={{
              fontSize: `${fontScale}dvh`,
              whiteSpace: "pre-line",
            }}
          >
            {phrase.text}
          </h2>
          {showSubText && phrase.subtext && (
            <SubPhrase subPhraseText={phrase.subtext} />
          )}
        </div>
        <div className="buttons-container">
          <button
            className="switch-btn"
            onClick={() => dispatch(decrementIndex())}
            style={{ visibility: indexCount > 0 ? "visible" : "hidden" }}
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
            onClick={() => dispatch(incrementIndex())}
            style={{ visibility: !isLastPhrase ? "visible" : "hidden" }}
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
