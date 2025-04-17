import React, { useState } from "react";
import "../styles/App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";
import config from "../config/config";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    return <Categories onCategorySelect={handleCategorySelect} />;
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
