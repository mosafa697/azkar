// import azkarData from "../dataset/azkar.json";
import azkarData from "../dataset/azkar-sample.json";

const mapAzkarData = (data) => {
  return data.map((category) => ({
    id: category.id,
    title: category.category,
    // audio: category.audio,
    // filename: category.filename,
    phrases: category.array.map((phrase) => ({
      id: phrase.id,
      text: phrase.text,
      count: phrase.count,
      subtext: phrase.subtext,
      //   audio: phrase.audio,
      //   filename: phrase.filename,
    })),
  }));
};

export const azkar = mapAzkarData(azkarData);
