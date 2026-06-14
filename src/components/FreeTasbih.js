import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ZekrCounter from "./ZekrCounter";
import { incrementTotalCount } from "../store/totalCountSlice";
import { HomeIcon, ToothIcon, TrashIcon } from "../icons/iconRepo.js";

export default function FreeTasbih({ onBack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animTimerRef = useRef(null);

  const handleTap = () => {
    setCount((c) => c + 1);
    dispatch(incrementTotalCount());
    setIsAnimating(true);

    if (animTimerRef.current) clearTimeout(animTimerRef.current);

    animTimerRef.current = setTimeout(() => setIsAnimating(false), 160);
  };

  const handleKeyDown = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleTap();
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="flex items-center justify-center vh-100 bg-[var(--bg-color)] p-4">
      <div className="flex flex-col gap-6 bg-[var(--card-bg-color)] rounded-2xl shadow-lg text-[var(--text-color)] h-full max-h-full max-w-md overflow-hidden p-4 w-full">
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex gap-2 w-1/3 justify-start">
            <button
              className="flex items-center justify-center h-11 w-11 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={handleReset}
              aria-label="Reset"
            >
              <TrashIcon />
            </button>
            <button className="invisible"></button>
            <button className="invisible"></button>
          </div>

          <div className="flex flex-col items-center gap-1 w-1/3 justify-center">
            <span className="inline-flex items-center justify-center rounded-full border border-[var(--button-border-color)] bg-[var(--card-bg-color)] px-3 py-1 text-[clamp(0.6rem,2vw,1rem)] font-semibold uppercase tracking-[0.12em] text-[var(--text-color)] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              مسبحة حرة
            </span>
            <div className="bg-[var(--secondary-bg-color)] border border-[var(--button-border-color)] rounded-lg overflow-hidden h-2.5 w-full">
              <div
                className="bg-[var(--icon-color)] h-full transition-width duration-300 ease-in-out w-[100%] gpu-accelerate"
                style={{ width: `100%` }}
                role="progressbar"
                aria-valuenow={100}
                aria-valuemax={100}
                aria-label="تقدم الذكر"
              />
            </div>
          </div>

          <div className="flex gap-2 w-1/3 justify-end">
            <button className="invisible"></button>
            <button
              className="flex items-center justify-center h-11 w-11 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={() => navigate("/settings")}
              aria-label="فتح إعدادات الذكر"
            >
              <ToothIcon />
            </button>
            <button
              className="flex items-center justify-center h-11 w-11 bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={() => {
                navigate("/");
              }}
              aria-label="الرجوع للصفحة الرئيسية"
            >
              <HomeIcon />
            </button>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-center flex-grow min-h-0 py-[2dvh] px-[2dvh] overflow-y-auto break-words cursor-pointer"
          onClick={handleTap}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          style={{
            transform: "none",
            transition: "none",
            opacity: 1,
            position: "relative",
          }}
        >
          <ZekrCounter
            onClickHandler={handleTap}
            counter={count}
            isAnimating={isAnimating}
          />
        </div>
      </div>
    </div>
  );
}
