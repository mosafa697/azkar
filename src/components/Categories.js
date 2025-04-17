import React from "react";
import { azkar } from "../mappers/azkarMapper";
import "../styles/Categories.css";

export default function Categories({ onCategorySelect }) {
  return (
    <div className="container">
      <div className="card">
        <h2>اختر نوع الأذكار:</h2>
        <div className="categories-container">
          {Object.values(azkar).map((category) => (
            <button
              key={category.id}
              className="category-btn"
              onClick={() => onCategorySelect(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
