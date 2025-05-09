import React, { useState } from "react";
import { azkar } from "../mappers/azkarMapper";
import { ToothIcon } from "../icons/iconRepo";

export default function Categories({ onCategorySelect, onOpenSettings }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = Object.values(azkar).filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card">
        <button className="setting-btn" onClick={onOpenSettings}>
          <ToothIcon />
        </button>
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
        <div className="search-bar">
          <input
            type="text"
            placeholder="ابحث عن فئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="categories-container">
          {filteredCategories.map((category) => (
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
