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

  if (!selectedCategory) {
    if (SettingsShow) {
      return <SettingsPage onBack={() => setSettingsShow(false)} />;
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
    />
  );
}
