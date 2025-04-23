import React, { useEffect, useState } from "react";
import "../styles/Categories.css";
import SunIcon from "../icons/sun";
import MoonIcon from "../icons/moon";
import ExitIcon from "../icons/exit";
import ShuffleIcon from "../icons/shuffle";
import OrderedIcon from "../icons/ordered";

export default function SettingsPage({
  onBack,
  darkMode,
  setDarkMode,
  shuffled,
  setShuffled,
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const shufflePheses = () => {
    setShuffled((prev) => !prev);
  };

  return (
    <div className="container">
      <div className="card">
        <button className="setting-btn" onClick={toggleTheme}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="setting-btn" onClick={shufflePheses}>
          {shuffled ? <ShuffleIcon /> : <OrderedIcon />}
        </button>
        <button className="category-btn" onClick={onBack}>
          <ExitIcon />
        </button>
      </div>
    </div>
  );
}
