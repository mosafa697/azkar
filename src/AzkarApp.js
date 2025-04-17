import React, { useState } from "react";
import "./App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (!selectedCategory) {
    return <Categories onCategorySelect={handleCategorySelect} />;
  }

  return <CategoryAzkar category={selectedCategory} onBack={handleBack} />;
}
