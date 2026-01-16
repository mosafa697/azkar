// Mock test data for consistent testing
export const mockAzkarData = [
  {
    id: 1,
    category: "أذكار الصباح",
    array: [
      {
        id: 1,
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
        count: 1,
        subtext: "من قالها موقنا بها حين يمسى ومات من ليلته دخل الجنة"
      },
      {
        id: 2,
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
        count: 100,
        subtext: "من قالها في يوم مائة مرة حطت خطاياه"
      }
    ]
  },
  {
    id: 2,
    category: "أذكار المساء",
    array: [
      {
        id: 3,
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا",
        count: 1,
        subtext: "من قالها موقنا بها حين يصبح ومات من يومه دخل الجنة"
      }
    ]
  }
];

export const mockMappedAzkar = [
  {
    id: 1,
    title: "أذكار الصباح",
    phrases: [
      {
        id: 1,
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
        count: 1,
        subtext: "من قالها موقنا بها حين يمسى ومات من ليلته دخل الجنة"
      },
      {
        id: 2,
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
        count: 100,
        subtext: "من قالها في يوم مائة مرة حطت خطاياه"
      }
    ]
  },
  {
    id: 2,
    title: "أذكار المساء",
    phrases: [
      {
        id: 3,
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا",
        count: 1,
        subtext: "من قالها موقنا بها حين يصبح ومات من يومه دخل الجنة"
      }
    ]
  }
];

export const mockPhrase = {
  id: 1,
  text: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
  count: 3,
  subtext: "من قالها موقنا بها حين يمسى ومات من ليلته دخل الجنة"
};

export const mockCategory = {
  id: 1,
  title: "أذكار الصباح",
  phrases: [mockPhrase]
};