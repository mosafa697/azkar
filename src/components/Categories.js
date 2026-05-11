import { useState } from "react";
import { azkar } from "../mappers/azkarMapper";

export default function Categories({ onCategorySelect, onOpenSettings }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = Object.values(azkar).filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center min-vh-100 bg-[var(--bg-color)] px-4 md:px-8 pt-8 pb-8">
      <div className="flex flex-col gap-6 bg-[var(--card-bg-color)] rounded-2xl shadow-lg text-[var(--text-color)] max-w-md min-h-1/2 p-4 md:p-8 w-full text-center">
        <div className="text-[2.3dvh] space-y-4 leading-9">
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
            . صحيح البخاري 7405.
          </p>
        </div>
        <div className="text-center my-4">
          <input
            type="text"
            placeholder="ابحث عن فئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-[400px] px-4 py-3 text-base font-[ScheherazadeNew,Cairo,sans-serif] border border-[var(--button-border-color)] rounded-lg bg-[var(--button-bg-color)] text-[var(--text-color)] outline-none transition-all focus:border-[var(--icon-color)] focus:shadow-[0_0_8px_rgba(0,117,58,0.3)]"
          />
        </div>
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          {filteredCategories.map((category) => (
            <button
              key={category.id}
              className="bg-[var(--button-bg-color)] border-0 rounded-lg text-[var(--text-color)] cursor-pointer text-[2.8dvh] font-bold font-[ScheherazadeNew,Cairo,sans-serif] px-4 py-3 text-center transition-colors duration-200 tap-highlight-none hover:bg-[var(--button-hover-bg-color)]"
              onClick={() => onCategorySelect(category.id)}
              tabIndex="0"
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
