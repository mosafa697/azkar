import React from "react";
import { azkar } from "../mappers/azkarMapper";
import "../styles/Categories.css";

export default function Categories({ onCategorySelect }) {
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <p>
            قال الله تعالى:{" "}
            <b>
              الَّذِينَ آمَنُواْ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللّهِ أَلاَ
              بِذِكْرِ اللّهِ تَطْمَئِنُّ الْقُلُوبُ
            </b>{" "}
            (الرعد:28).
          </p>
          <p>
            وقال رسول الله صلى الله عليه وسلم:{" "}
            <b>
            يقولُ اللَّهُ تَعالَى: أنا عِنْدَ ظَنِّ عَبْدِي بي، وأنا معهُ إذا ذَكَرَنِي، فإنْ ذَكَرَنِي في نَفْسِهِ ذَكَرْتُهُ في نَفْسِي، وإنْ ذَكَرَنِي في مَلَإٍ ذَكَرْتُهُ في مَلَإٍ خَيْرٍ منهمْ
            </b>
            . صحيح البخاري 7405 .
          </p>
        </div>

        <div className="categories-container">
          {Object.values(azkar).map((category) => (
            <button
              key={category.id}
              className="category-btn"
              onClick={() => onCategorySelect(category.id)}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
