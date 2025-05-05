import React from "react";
import { useSelector } from "react-redux";

const SubPhrase = ({ subPhraseText }) => {
  const fontSize = useSelector((state) => state.fontSize.value);

  return (
    <div>
      <hr />
      <h5
        className="sub-phrase"
        style={{
          fontSize: `${fontSize - 0.5}vh`,
          whiteSpace: "pre-line",
        }}
      >
        {subPhraseText}
      </h5>
    </div>
  );
};

export default SubPhrase;
