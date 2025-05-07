import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShuffle } from "../store/phasesSlice";
import { toggleAppearance } from "../store/subTextSlice";
import { setTheme } from "../store/themeSlice";
import {
  ExitIcon,
  ShuffleIcon,
  OrderedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "../icons/iconRepo";
import { themeIcons } from "../mappers/themeIconsMapper";

export default function SettingsPage({ onBack }) {
  const dispatch = useDispatch();

  const shuffle = useSelector((state) => state.phases.shuffle);
  const theme = useSelector((state) => state.theme.value);
  const themeList = useSelector((state) => state.theme.list);
  const showSubText = useSelector((state) => state.subText.value);

  useEffect(() => {
    const root = document.documentElement;
    themeList.forEach((object) => root.classList.remove(object));
    root.classList.add(theme);
  }, [theme, themeList]);

  return (
    <div className="container">
      <div className="card">
        <div className="setting-card">
          <div className="setting-item">
            <span className="setting-label">سمة النظام</span>
            <div className="slider">
              {themeList.map((name) => (
                <button
                                    className="theme-btn"
                  style={{
                    border: `2px solid ${
                      theme === name
                        ? theme === "dark"
                          ? "#ffffff"
                          : theme === "light"
                          ? "#2563eb"
                          : "#00753a"
                        : "transparent"
                    }`,
                  }}
                  key={name}
                  onClick={() => dispatch(setTheme(name))}
                  title={name}
                >
                  {themeIcons[name]}
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
                checked={Boolean(showSubText)}
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
