import React, { useState } from "react";
import "../styles/App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";
import SettingsPage from "./SettingsPage";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [SettingsShow, setSettingsShow] = useState(false);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
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
      onBack={() => setSelectedCategory(null)}
    />
  );
}
