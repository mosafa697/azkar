import React, { useState, useEffect } from "react";
import ZekrCard from "./ZekrCard";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementIndex,
  setIsLastPhrase,
  setPhasesLengthCount,
} from "../store/indexCountSlice.js";
import { azkar } from "../mappers/azkarMapper";
import { setPhases, shufflePhases } from "../store/phasesSlice";

export default function CategoryAzkar({ categoryId, onBack }) {
  const dispatch = useDispatch();
  const index = useSelector((state) => state.indexCount.value);

  const categoryAzkar = azkar.find((item) => item.id === categoryId);
  const shuffle = useSelector((state) => state.phases.shuffle);
  const wasShuffled = useSelector((state) => state.phases.wasShuffled);

  useEffect(() => {
    if (categoryAzkar?.phrases?.length) {
      dispatch(setPhases(categoryAzkar.phrases));
      dispatch(setPhasesLengthCount(categoryAzkar.phrases.length - 1));
    }
  }, [categoryId, categoryAzkar, dispatch]);

  const categoryPhrases = useSelector((state) => state.phases.value);

  useEffect(() => {
    if (categoryPhrases.length > 0) {
      setClicks(Array(categoryPhrases.length).fill(0));
    }
  }, [categoryPhrases.length]);

  useEffect(() => {
    if (shuffle && !wasShuffled && categoryPhrases.length > 0) {
      dispatch(shufflePhases());
    }
  }, [shuffle, wasShuffled, categoryPhrases, dispatch]);

  useEffect(() => {
    dispatch(setIsLastPhrase(index === categoryPhrases.length - 1));
  }, [index, categoryPhrases.length, dispatch]);

  const [isAnimating, setIsAnimating] = useState(false);

  const [clicks, setClicks] = useState(Array(categoryPhrases.length).fill(0));

  const handlePhraseClick = () => {
    const newClicks = [...clicks];
    const phraseCount = categoryPhrases[index].count || 0;

    if (newClicks[index] < phraseCount) {
      setIsAnimating(true);
      newClicks[index] += 1;
      setClicks(newClicks);

      if (newClicks[index] === phraseCount) {
        setTimeout(() => dispatch(incrementIndex()), 300);
      }
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <>
      {categoryPhrases.length > 0 && categoryPhrases[index] && (
        <ZekrCard
          phrase={categoryPhrases[index]}
          counter={clicks[index] ?? 0}
          onPhraseClick={handlePhraseClick}
          isAnimating={isAnimating}
          onBack={onBack}
        />
      )}
    </>
  );
}
