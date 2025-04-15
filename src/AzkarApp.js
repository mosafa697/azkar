import React, { useState } from "react";
import "./App.css";
import { azkar } from "./mappers/azkarMapper";

export default function AzkarApp() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [index, setIndex] = useState(0);
  const [clicks, setClicks] = useState([]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIndex(0);
    setClicks(Array(azkar[category].length).fill(0));
  };

  const handlePhraseClick = () => {
    const newClicks = [...clicks];
    newClicks[index] += 1;
    setClicks(newClicks);
  };

  const handleNext = () => {
    if (index < azkar[selectedCategory].length - 1) {
      setIndex(index + 1);
    } else {
      alert("وصلت لآخر الذكر!");
    }
  };

  if (!selectedCategory) {
    return (
      <div className="container">
        <div className="card">
          <h2>اختر نوع الأذكار:</h2>
          {Object.values(azkar).map((category) => (
            <button
              key={category.id}
              className="next-btn"
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2 className="phrase" onClick={handlePhraseClick}>
          {azkar[selectedCategory][index]}
        </h2>
        <p className="counter">عدد الضغطات: {clicks[index]}</p>
        <button className="next-btn" onClick={handleNext}>
          التالي
        </button>
      </div>
    </div>
  );
}
