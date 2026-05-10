import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShuffle } from "../store/phasesSlice";
import { toggleAppearance } from "../store/subTextSlice";
import { setTheme } from "../store/themeSlice";
import { resetTotalCount } from "../store/totalCountSlice";
import {
  ShuffleIcon,
  OrderedIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronLeftIcon,
  TrashIcon,
} from "../icons/iconRepo";
import { themeIcons } from "../mappers/themeIconsMapper";
import ContactMe from "./ContactMe";

export default function SettingsPage({ onBack }) {
  const dispatch = useDispatch();

  const shuffle = useSelector((state) => state.phases.shuffle);
  const theme = useSelector((state) => state.theme.value);
  const themeList = useSelector((state) => state.theme.list);
  const showSubText = useSelector((state) => state.subText.value);
  const totalCount = useSelector((state) => state.totalCount.value);

  const handleResetTotalCount = () => {
    if (window.confirm("هل أنت متأكد من إعادة تعيين عداد الأذكار؟")) {
      dispatch(resetTotalCount());
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    themeList.forEach((object) => root.classList.remove(object));
    root.classList.add(theme);
  }, [theme, themeList]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] px-8">
      <div className="flex flex-col gap-6 bg-[var(--card-bg-color)] rounded-2xl shadow-lg text-[var(--text-color)] max-w-md min-h-1/2 p-8 w-full text-center">
        <div className="flex justify-start items-center p-2 text-[2.6dvh] text-[var(--text-color)] direction-ltr">
          <button className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer py-1 px-1.5 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]" onClick={onBack} aria-label="الرجوع">
            <ChevronLeftIcon />
          </button>
        </div>
        <div className="bg-[var(--card-bg-color)] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col gap-6 p-6">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-color)]">سمة النظام</span>
            <div className="flex items-center justify-center gap-2">
              {themeList.map((name) => (
                <button
                  className="flex items-center justify-center rounded-full p-2 bg-transparent cursor-pointer tap-highlight-none"
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
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-color)]">ترتيب الأذكار</span>
            <label className="relative flex h-7 w-12 cursor-pointer tap-highlight-none">
              <input
                type="checkbox"
                checked={shuffle}
                onChange={() => dispatch(toggleShuffle())}
                aria-label="تبديل ترتيب الأذكار"
                className="peer h-0 w-0 opacity-0"
              />
              <span className="absolute flex items-center justify-center rounded-full h-7 w-12 bg-[var(--slider-bg)] text-[var(--icon-color)] cursor-pointer transition-colors duration-400 tap-highlight-none peer-checked:bg-[var(--slider-bg-active)] peer-checked:text-[var(--icon-color-active)]">
                {shuffle ? <OrderedIcon /> : <ShuffleIcon />}
              </span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-color)]">إظهار فضل الذكر</span>
            <label className="relative flex h-7 w-12 cursor-pointer tap-highlight-none">
              <input
                type="checkbox"
                checked={Boolean(showSubText)}
                onChange={() => dispatch(toggleAppearance())}
                aria-label="تبديل إظهار فضل الذكر"
                className="peer h-0 w-0 opacity-0"
              />
              <span className="absolute flex items-center justify-center rounded-full h-7 w-12 bg-[var(--slider-bg)] text-[var(--icon-color)] cursor-pointer transition-colors duration-400 tap-highlight-none peer-checked:bg-[var(--slider-bg-active)] peer-checked:text-[var(--icon-color-active)]">
                {showSubText ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-color)]">إجمالي الأذكار</span>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center justify-center bg-[var(--button-bg-color)] border border-[var(--button-border-color)] rounded-lg text-[var(--text-color)] cursor-pointer p-1 transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
                onClick={handleResetTotalCount}
                title="إعادة تعيين العداد"
              >
                <TrashIcon />
              </button>
              <span className="text-base font-bold text-[var(--icon-color)] py-1 px-2 bg-[var(--secondary-bg-color)] rounded-lg w-12 text-center">
                {totalCount.toLocaleString()}
              </span>
            </div>
          </div>
          <ContactMe />
        </div>
      </div>
    </div>
  );
}
