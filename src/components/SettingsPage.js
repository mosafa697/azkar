import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShuffle } from "../store/phasesSlice";
import { toggleTheme } from "../store/darkThemeSlice";
import "../styles/Categories.css";
import SunIcon from "../icons/sun";
import MoonIcon from "../icons/moon";
import ExitIcon from "../icons/exit";
import ShuffleIcon from "../icons/shuffle";
import OrderedIcon from "../icons/ordered";

export default function SettingsPage({ onBack }) {
  const dispatch = useDispatch();

  const isShuffled = useSelector((state) => state.phases.isShuffled);
  const darkTheme = useSelector((state) => state.darkTheme.value);

  useEffect(() => {
    const root = document.documentElement;
    if (darkTheme) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkTheme]);

  return (
    <div className="container">
      <div className="card">
        <div className="setting-card">
          <div className="setting-item">
            <span className="setting-label">سمة النظام</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkTheme}
                onChange={() => dispatch(toggleTheme())}
              />
              <span className="slider">
                {darkTheme ? <SunIcon /> : <MoonIcon />}
              </span>
            </label>
          </div>

          <div className="setting-item">
            <span className="setting-label">ترتيب الأذكار</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isShuffled}
                onChange={() => dispatch(toggleShuffle())}
              />
              <span className="slider">
                {isShuffled ? <OrderedIcon /> : <ShuffleIcon />}
              </span>
            </label>
          </div>
        </div>
        <button className="category-btn" onClick={onBack}>
          <ExitIcon />
        </button>
      </div>
    </div>
  );
}
