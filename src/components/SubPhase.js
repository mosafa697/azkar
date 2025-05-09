import React from "react";
import { useSelector } from "react-redux";

const SubPhrase = ({ subPhraseText }) => {
  const fontScale = useSelector((state) => state.fontScale.value);

  return (
    <div>
      <hr />
      <h5
        className="sub-phrase"
        style={{
          fontScale: `${fontScale - 0.5}vh`,
          whiteSpace: "pre-line",
        }}
      >
        {subPhraseText}
      </h5>
    </div>
  );
};

export default SubPhrase;
