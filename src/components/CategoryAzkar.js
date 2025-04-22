import React, { useState } from "react";
import { azkar } from "../mappers/azkarMapper";
import ZekrCard from "./ZekrCard";

export default function CategoryAzkar({
  categoryId,
  onBack,
  fontSize,
  onIncreaseFontSize,
  onDecreaseFontSize,
  // isShuffle,
  // shuffle,
}) {
  const categoryAzkar = azkar.find((item) => item.id === categoryId);

  // if (isShuffle) {
  //   categoryAzkar.phrases = shuffle(categoryAzkar.phrases);
  // }

  const [isAnimating, setIsAnimating] = useState(false);
  const [index, setIndex] = useState(0);
  const [clicks, setClicks] = useState(
    Array(categoryAzkar.phrases.length).fill(0)
  );
  const isLastPhrase = index === categoryAzkar.phrases.length - 1;

  const handlePhraseClick = () => {
    const newClicks = [...clicks];
    const phraseCount = categoryAzkar.phrases[index].count || 0;

    if (newClicks[index] < phraseCount) {
      setIsAnimating(true);
      newClicks[index] += 1;
      setClicks(newClicks);

      if (newClicks[index] === phraseCount) {
        setTimeout(handleNext, 300);
      }
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
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

  return (
    <ZekrCard
      phrase={categoryAzkar.phrases[index]}
      counter={clicks[index]}
      onPhraseClick={handlePhraseClick}
      isAnimating={isAnimating}
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
