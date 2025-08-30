import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import "../styles/App.css";
import CategoryAzkar from "./CategoryAzkar";
import Categories from "./Categories";
import SettingsPage from "./SettingsPage";

// Wrapper component for Categories to handle navigation
function CategoriesPage() {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  return (
    <Categories
      onCategorySelect={handleCategorySelect}
      onOpenSettings={handleOpenSettings}
    />
  );
}

// Wrapper component for CategoryAzkar to handle navigation
function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <CategoryAzkar
      categoryId={parseInt(categoryId)}
      onBack={handleBack}
    />
  );
}

// Wrapper component for SettingsPage to handle navigation
function SettingsPageWrapper() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page in history
  };

  return <SettingsPage onBack={handleBack} />;
}

export default function AzkarApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/settings" element={<SettingsPageWrapper />} />
      </Routes>
    </Router>
  );
}
