import React from "react";
import { useSelector } from "react-redux";

const SubPhrase = ({ subPhraseText }) => {
  const fontScale = useSelector((state) => state.fontScale.value);

  return (
    <div>
      <h5
        className="text-[var(--secondary-text-color)] text-center tap-highlight-none"
        style={{
          fontSize: `${fontScale - 0.5}dvh`,
          whiteSpace: "pre-line",
        }}
      >
        {subPhraseText}
      </h5>
    </div>
  );
};

export default SubPhrase;
