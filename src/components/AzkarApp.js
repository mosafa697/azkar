import React, { useState } from "react";
import "../styles/App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";
import SettingsPage from "./SettingsPage";
import config from "../config/config";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [SettingsShow, setSettingsShow] = useState(false);
  const [fontSize, setFontSize] = useState(config.font.defaultSize);
  const [darkMode, setDarkMode] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) =>
      Math.min(prevSize + config.font.increment, config.font.maxSize)
    );
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) =>
      Math.max(prevSize - config.font.increment, config.font.minSize)
    );
  };

  // const shuffle = (phrases) => {
  //   if (!shuffled) {
  //     const texts = phrases.map((p) => p.text);

  //     for (let i = texts.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [texts[i], texts[j]] = [texts[j], texts[i]];
  //     }

  //     shuffled = !shuffled;

  //     return phrases.map((phrase, index) => ({
  //       ...phrase,
  //       text: texts[index],
  //     }));
  //   }
  // };

  if (!selectedCategory) {
    if (SettingsShow) {
      return (
        <SettingsPage
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          shuffled={shuffled}
          setShuffled={setShuffled}
          onBack={() => setSettingsShow(false)}
        />
      );
    }
    return (
      <Categories
        onCategorySelect={handleCategorySelect}
        onOpenSettings={() => setSettingsShow(true)}
      />
    );
  }

  return (
    <CategoryAzkar
      categoryId={selectedCategory}
      onBack={handleBack}
      fontSize={fontSize}
      onIncreaseFontSize={increaseFontSize}
      onDecreaseFontSize={decreaseFontSize}
      // isShuffle={true}
      // shuffle={shuffle}
    />
  );
}
