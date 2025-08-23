import React, { useState } from "react";
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
import { useSwipeable } from "react-swipeable";

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

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeOffset(eventData.deltaX * 0.5); // Apply some dampening
    },
    onSwipedLeft: () => {
      setIsSwipeAnimating(true);
      setSwipeOffset(-window.innerWidth);
      setTimeout(() => {
        dispatch(decrementIndex());
        setSwipeOffset(0);
        setIsSwipeAnimating(false);
      }, 200);
    },
    onSwipedRight: () => {
      setIsSwipeAnimating(true);
      setSwipeOffset(window.innerWidth);
      setTimeout(() => {
        dispatch(incrementIndex());
        setSwipeOffset(0);
        setIsSwipeAnimating(false);
      }, 200);
    },
    onSwiped: () => {
      if (!isSwipeAnimating) {
        setSwipeOffset(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

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
        <div
          className="content-container"
          onClick={onPhraseClick}
          {...swipeHandlers}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwipeAnimating ? "transform 0.2s ease-out" : "none",
            opacity: isSwipeAnimating ? 0.7 : 1,
            position: "relative",
          }}
        >
          {/* Swipe indicators */}
          {Math.abs(swipeOffset) > 50 && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: swipeOffset > 0 ? "10px" : "auto",
                  right: swipeOffset < 0 ? "10px" : "auto",
                  transform: "translateY(-50%)",
                  fontSize: "2rem",
                  color: "var(--icon-color)",
                  opacity: Math.min(Math.abs(swipeOffset) / 100, 1),
                  zIndex: 1,
                }}
              ></div>
            </>
          )}

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
