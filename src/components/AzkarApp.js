import React, { useState } from "react";
import "../styles/App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (!selectedCategory) {
    return <Categories onCategorySelect={handleCategorySelect} />;
  }

  return <CategoryAzkar categoryId={selectedCategory} onBack={handleBack} />;
}
