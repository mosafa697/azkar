import React, { useState } from "react";
import { azkar } from "../mappers/azkarMapper";
import ZekrCard from "./ZekrCard";

export default function CategoryAzkar({
  categoryId,
  onBack,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
}) {
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

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const isLastPhrase = index === categoryAzkar.phrases.length - 1;

  return (
    <ZekrCard
      phrase={categoryAzkar.phrases[index]}
      counter={clicks[index]}
      onPhraseClick={handlePhraseClick}
      onNext={handleNext}
      onPrev={handlePrev}
      onBack={onBack}
      isLastPhrase={isLastPhrase}
      fontSize={fontSize}
      onIncreaseFontSize={onIncreaseFontSize}
      onDecreaseFontSize={onDecreaseFontSize}
    />
  );
}
