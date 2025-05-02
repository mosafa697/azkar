import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShuffle } from "../store/phasesSlice";
import { setTheme } from "../store/themeSlice";
import "../styles/Categories.css";
import {
  SunIcon,
  MoonIcon,
  ExitIcon,
  ShuffleIcon,
  OrderedIcon,
} from "../icons/iconRepo";

export default function SettingsPage({ onBack }) {
  const dispatch = useDispatch();

  const shuffle = useSelector((state) => state.phases.shuffle);
  const theme = useSelector((state) => state.theme.value);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, [theme]);

  return (
    <div className="container">
      <div className="card">
        <div className="setting-card">
          <div className="setting-item">
            <span className="setting-label">سمة النظام</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() =>
                  dispatch(setTheme(theme === "dark" ? "light" : "dark"))
                }
              />
              <span className="slider">
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>
            </label>
          </div>

          <div className="setting-item">
            <span className="setting-label">ترتيب الأذكار</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={() => dispatch(toggleShuffle())}
              />
              <span className="slider">
                {shuffle ? <OrderedIcon /> : <ShuffleIcon />}
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
