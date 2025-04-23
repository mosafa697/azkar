import React, { useEffect, useState } from "react";
import "../styles/Categories.css";
import SunIcon from "../icons/sun";
import MoonIcon from "../icons/moon";
import ExitIcon from "../icons/exit";

export default function SettingsPage({ onBack, darkMode, setDarkMode }) {
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

  return (
    <div className="container">
      <div className="card">
        <button className="setting-btn" onClick={toggleTheme}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="category-btn" onClick={onBack}>
          <ExitIcon />
        </button>
      </div>
    </div>
  );
}
