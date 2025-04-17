import React, { useState } from "react";
import { azkar } from "../mappers/azkarMapper";
import "../styles/CategoryAzkar.css";

export default function CategoryAzkar({ categoryId, onBack }) {
  const categoryAzkar = azkar.find((item) => item.id === categoryId);
  const [index, setIndex] = useState(0);
  const [clicks, setClicks] = useState(
    Array(categoryAzkar.phrases.length).fill(0)
  );

  const handlePhraseClick = () => {
    const newClicks = [...clicks];
    if (newClicks[index] < categoryAzkar.phrases[index].count) {
      newClicks[index] += 1;
      setClicks(newClicks);
    }
  };

  const handleNext = () => {
    if (index < categoryAzkar.phrases.length - 1) {
      setIndex(index + 1);
    }
  };

  const isLastPhrase = index === categoryAzkar.phrases.length - 1;

  return (
    <div className="container">
      <div className="card">
        <h2 className="phrase">{categoryAzkar.phrases[index].text}</h2>
        <button className="counter-btn" onClick={handlePhraseClick}>
          {clicks[index]}
        </button>
        <div className="buttons-container">
          {!isLastPhrase && (
            <button className="next-btn" onClick={handleNext}>
              التالي
            </button>
          )}
          <button className="back-btn" onClick={onBack}>
            العودة للقائمة
          </button>
        </div>
      </div>
    </div>
  );
}
