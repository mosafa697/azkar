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
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] p-4">
      <div className="flex flex-col gap-6 bg-[var(--card-bg-color)] rounded-2xl shadow-lg text-[var(--text-color)] max-h-screen max-w-md overflow-y-auto p-4 w-full">
        {/* Controls Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-1 px-1.5 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={() => dispatch(decrementFontScale())}
              aria-label="Decrease font size"
              data-testid="decrease-font-size"
            >
              <MinusIcon />
            </button>
            <button
              className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-1 px-1.5 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={() => dispatch(incrementFontScale())}
              aria-label="Increase font size"
              data-testid="increase-font-size"
            >
              <PlusIcon />
            </button>
            <button className="invisible"></button>
            {/* TODO: find another way */}
          </div>
          <div className="bg-[var(--secondary-bg-color)] border border-[var(--button-border-color)] rounded-lg overflow-hidden h-2.5 w-[20dvh]">
            <div
              className="bg-[var(--icon-color)] h-full transition-all duration-300 ease-in-out w-[var(--progress-width)]"
              style={{ "--progress-width": `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={indexCount}
              aria-valuemax={phasesLength}
              aria-label="تقدم الذكر"
            />
          </div>

          <div className="flex gap-2">
            <button style={{ visibility: "hidden" }}></button>
            <button className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-1 px-1.5 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]" onClick={handleSettingsClick} aria-label="فتح إعدادات الذكر">
              <ToothIcon />
            </button>
            <button className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-1 px-1.5 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]" onClick={onBack} aria-label="الرجوع للصفحة الرئيسية">
              <HomeIcon />
            </button>
          </div>
        </div>
        <div
          className="flex flex-col items-center flex-grow h-screen py-[2dvh] px-[2dvh] overflow-y-auto break-words"
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
            className="text-[var(--text-color)] cursor-pointer leading-loose my-0 mb-5 py-[3dvh] text-center transition-colors duration-300 tap-highlight-none"
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
        <div className="flex justify-between">
          <button
            className={`flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-0.5 px-1 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)] self-center ${canGoBack ? "" : "invisible"}`}
            onClick={() => dispatch(decrementIndex())}
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
            className={`flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-0.5 px-1 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)] self-center ${canGoForward ? "" : "invisible"}`}
            onClick={() => dispatch(incrementIndex())}
            aria-label="Next phrase"
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
