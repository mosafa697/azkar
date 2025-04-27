import React, { useState, useEffect } from "react";
import { azkar } from "../mappers/azkarMapper";
import ZekrCard from "./ZekrCard";
import { useDispatch, useSelector } from "react-redux";
import {
  increamentIndex,
  setIsLastPhrase,
  setPhasesLengthCount,
} from "../store/indexCountSlice.js";

export default function CategoryAzkar({ categoryId, onBack }) {
  const dispatch = useDispatch();
  const index = useSelector((state) => state.indexCount.value);

  const categoryAzkar = azkar.find((item) => item.id === categoryId);

  useEffect(() => {
    dispatch(setPhasesLengthCount(categoryAzkar.phrases.length - 1));
    dispatch(setIsLastPhrase(index === categoryAzkar.phrases.length - 1));
  }, [categoryAzkar.phrases.length, index, dispatch]);

  const [isAnimating, setIsAnimating] = useState(false);

  const [clicks, setClicks] = useState(
    Array(categoryAzkar.phrases.length).fill(0)
  );

  const handlePhraseClick = () => {
    const newClicks = [...clicks];
    const phraseCount = categoryAzkar.phrases[index].count || 0;

    if (newClicks[index] < phraseCount) {
      setIsAnimating(true);
      newClicks[index] += 1;
      setClicks(newClicks);

      if (newClicks[index] === phraseCount) {
        setTimeout(() => dispatch(increamentIndex()), 300);
      }
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <ZekrCard
      phrase={categoryAzkar.phrases[index]}
      counter={clicks[index]}
      onPhraseClick={handlePhraseClick}
      isAnimating={isAnimating}
      onBack={onBack}
    />
  );
}
