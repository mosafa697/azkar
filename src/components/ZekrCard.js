import React, { useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  ToothIcon,
} from "../icons/iconRepo.js";
import ZekrCounter from "./ZekrCounter.js";
import SubPhrase from "./SubPhase.js";
import { useSwipeable } from "react-swipeable";

// Constants
const SWIPE_DAMPENING = 0.5;
const SWIPE_ANIMATION_DURATION = 200;
const SWIPE_THRESHOLD = 50;
const LONG_PRESS_DURATION = 600;

// Custom hook for swipe functionality
const useSwipeNavigation = (dispatch) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);

  const handleSwipeAnimation = useCallback(
    (direction, action) => {
      setIsSwipeAnimating(true);
      setSwipeOffset(direction * window.innerWidth);
      setTimeout(() => {
        dispatch(action());
        setSwipeOffset(0);
        setIsSwipeAnimating(false);
      }, SWIPE_ANIMATION_DURATION);
    },
    [dispatch]
  );

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeOffset(eventData.deltaX * SWIPE_DAMPENING);
    },
    onSwipedLeft: () => handleSwipeAnimation(-1, decrementIndex),
    onSwipedRight: () => handleSwipeAnimation(1, incrementIndex),
    onSwiped: () => {
      if (!isSwipeAnimating) {
        setSwipeOffset(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  return { swipeOffset, isSwipeAnimating, swipeHandlers };
};

export default function ZekrCard({
  phrase,
  counter,
  onPhraseClick,
  isAnimating,
  onBack,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fontScale = useSelector((state) => state.fontScale.value);
  const isLastPhrase = useSelector((state) => state.indexCount.isLastPhrase);
  const indexCount = useSelector((state) => state.indexCount.value);
  const phasesLength = useSelector((state) => state.indexCount.phasesLength);
  const showSubText = useSelector((state) => state.subText.value);
  const longPressTimerRef = useRef(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  const { swipeOffset, isSwipeAnimating, swipeHandlers } =
    useSwipeNavigation(dispatch);

  // Navigation handlers
  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const copyTextToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        document.body.appendChild(textArea);
        textArea.focus({ preventScroll: true });
        textArea.select();
        try {
          document.execCommand("copy");
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (_) {}
  };

  const startLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    longPressTimerRef.current = setTimeout(async () => {
      setLongPressTriggered(true);
      await copyTextToClipboard(phrase.text);
    }, LONG_PRESS_DURATION);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleContentClick = (e) => {
    if (longPressTriggered) {
      e.preventDefault();
      e.stopPropagation();
      setLongPressTriggered(false);
      return;
    }
    onPhraseClick();
  };

  // Helper functions
  const progressPercentage = (indexCount / phasesLength) * 100;
  const remainingCount = phrase.count - counter || 1;
  const canGoBack = indexCount > 0;
  const canGoForward = !isLastPhrase;
  const showSwipeIndicator = Math.abs(swipeOffset) > SWIPE_THRESHOLD;

  return (
    <div className="zekr-container">
      <div className="zekr-card">
        {/* Controls Header */}
        <div className="controls-container">
          <div className="font-controls">
            <button
              className="font-btn"
              onClick={() => dispatch(decrementFontScale())}
              aria-label="Decrease font size"
              data-testid="decrease-font-size"
            >
              <MinusIcon />
            </button>
            <button
              className="font-btn"
              onClick={() => dispatch(incrementFontScale())}
              aria-label="Increase font size"
              data-testid="increase-font-size"
            >
              <PlusIcon />
            </button>
            <button style={{ visibility: "hidden" }}></button>
            {/* TODO: find another way */}
          </div>
          <div className="counter-container">
            <div
              className="counter-bar"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={indexCount}
              aria-valuemax={phasesLength}
              aria-label="تقدم الذكر"
            />
          </div>

          <div className="option-controls">
            <button style={{ visibility: "hidden" }}></button>
            <button className="card-setting-btn" onClick={handleSettingsClick} aria-label="فتح إعدادات الذكر">
              <ToothIcon />
            </button>
            <button className="back-btn" onClick={onBack} aria-label="الرجوع للصفحة الرئيسية">
              <HomeIcon />
            </button>
          </div>
        </div>
        <div
          className="content-container"
          onClick={handleContentClick}
          onPointerDown={startLongPress}
          onPointerUp={cancelLongPress}
          onPointerLeave={cancelLongPress}
          onPointerCancel={cancelLongPress}
          onPointerMove={cancelLongPress}
          {...swipeHandlers}
          style={{
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwipeAnimating ? "transform 0.2s ease-out" : "none",
            opacity: isSwipeAnimating ? 0.7 : 1,
            position: "relative",
          }}
        >
          {/* Swipe Indicator */}
          {showSwipeIndicator && (
            <div
              className="swipe-indicator"
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
              aria-hidden="true"
            />
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
            style={{ visibility: canGoBack ? "visible" : "hidden" }}
            aria-label="Previous phrase"
          >
            <ChevronRightIcon />
          </button>

          <ZekrCounter
            onClickHandler={onPhraseClick}
            counter={remainingCount}
            isAnimating={isAnimating}
          />

          <button
            className="switch-btn"
            onClick={() => dispatch(incrementIndex())}
            style={{ visibility: canGoForward ? "visible" : "hidden" }}
            aria-label="Next phrase"
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
