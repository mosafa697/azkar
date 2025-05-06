import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShuffle } from "../store/phasesSlice";
import { toggleAppearance } from "../store/subTextSlice";
import { setTheme } from "../store/themeSlice";
import "../styles/Categories.css";
import {
  ExitIcon,
  ShuffleIcon,
  OrderedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "../icons/iconRepo";

export default function SettingsPage({ onBack }) {
  const dispatch = useDispatch();

  const shuffle = useSelector((state) => state.phases.shuffle);
  const theme = useSelector((state) => state.theme.value);
  const themeList = useSelector((state) => state.theme.list);
  const showSubText = useSelector((state) => state.subText.value);

  useEffect(() => {
    const root = document.documentElement;
    themeList.forEach((object) => root.classList.remove(object.name));
    root.classList.add(theme);
  }, [theme, themeList]);

  return (
    <div className="container">
      <div className="card">
        <div className="setting-card">
          <div className="setting-item">
            <span className="setting-label">سمة النظام</span>
            <div className="slider">
              {themeList.map(({ name, icon }) => (
                <button
                  className="theme-btn"
                  style={{
                    border:
                      theme === name
                        ? "2px solid rgb(0, 0, 0)"
                        : "2px solid transparent",
                  }}
                  key={name}
                  onClick={() => dispatch(setTheme(name))}
                  title={name}
                >
                  {icon}
                </button>
              ))}
            </div>
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
          <div className="setting-item">
            <span className="setting-label">إظهار فضل الذكر</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={showSubText}
                onChange={() => dispatch(toggleAppearance())}
              />
              <span className="slider">
                {showSubText ? <EyeSlashIcon /> : <EyeIcon />}
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
