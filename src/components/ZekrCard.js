import React from "react";
import "../styles/AzkarCard.css";

export default function ZekrCard({
  phrase,
  counter,
  onPhraseClick,
  onNext,
  onBack,
  isLastPhrase,
}) {
  return (
    <div className="container">
      <div className="card">
        <h2 className="phrase">{phrase}</h2>
        <button className="counter-btn" onClick={onPhraseClick}>
          {counter}
        </button>
        <div className="buttons-container">
          {!isLastPhrase && (
            <button className="next-btn" onClick={onNext}>
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
