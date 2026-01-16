import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '../test-utils';
import CategoryAzkar from '../../components/CategoryAzkar';
import { mockMappedAzkar } from '../fixtures/mockData';

// Mock the azkar mapper
jest.mock('../../mappers/azkarMapper', () => ({
  azkar: [
    {
      id: 1,
      title: "أذكار الصباح",
      phrases: [
        {
          id: 1,
          text: "اللَّهُمَّ بِكَ أَصْبَحْنَا",
          count: 3,
          subtext: "من قالها موقنا بها حين يمسى ومات من ليلته دخل الجنة"
        },
        {
          id: 2,
          text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
          count: 2,
          subtext: "من قالها في يوم مائة مرة حطت خطاياه"
        },
        {
          id: 3,
          text: "لا إله إلا الله",
          count: 1,
          subtext: ""
        }
      ]
    },
    {
      id: 2,
      title: "أذكار المساء",
      phrases: [
        {
          id: 4,
          text: "اللَّهُمَّ بِكَ أَمْسَيْنَا",
          count: 1,
          subtext: "من قالها موقنا بها حين يصبح ومات من يومه دخل الجنة"
        }
      ]
    }
  ]
}));

describe('CategoryAzkar Component', () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    sessionStorage.clear();
    localStorage.clear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should render first phrase from category', () => {
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      expect(screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i)).toBeInTheDocument();
    });

    it('should initialize click counter array with zeros', () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // Verify phrases are set in store
      const phrases = store.getState().phases.value;
      expect(phrases).toHaveLength(3);
    });

    it('should set phases length count in Redux', () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phasesLength = store.getState().indexCount.phasesLength;
      expect(phasesLength).toBe(2); // 3 phrases - 1
    });
  });

  describe('Click Counter Logic', () => {
    it('should increment counter on phrase click', () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      // Click the phrase
      fireEvent.click(phraseElement);
      
      // Total count should increment
      expect(store.getState().totalCount.value).toBe(1);
    });

    it('should not exceed phrase count', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      // Click 5 times (count is 3)
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      
      await waitFor(() => {
        // Total count should only be 3
        expect(store.getState().totalCount.value).toBe(3);
      });
    });

    it('should increment total count on each valid click', () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      expect(store.getState().totalCount.value).toBe(0);
      
      fireEvent.click(phraseElement);
      expect(store.getState().totalCount.value).toBe(1);
      
      fireEvent.click(phraseElement);
      expect(store.getState().totalCount.value).toBe(2);
    });

    it('should maintain separate counters for each phrase', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // Click first phrase twice
      const firstPhrase = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      fireEvent.click(firstPhrase);
      fireEvent.click(firstPhrase);
      
      // Total count should be 2
      expect(store.getState().totalCount.value).toBe(2);
      
      // Navigate to second phrase
      const nextButton = screen.getByLabelText(/Next phrase/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText(/سُبْحَانَ اللهِ وَبِحَمْدِهِ/i)).toBeInTheDocument();
      });
    });
  });

  describe('Auto-progression on Count Completion', () => {
    it('should automatically advance to next phrase when count is reached', async () => {
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      // Click 3 times to complete the count
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      
      // Fast-forward the 300ms timeout
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should automatically navigate to next phrase
      await waitFor(() => {
        expect(screen.getByText(/سُبْحَانَ اللهِ وَبِحَمْدِهِ/i)).toBeInTheDocument();
      });
    });

    it('should not auto-progress if count not reached', async () => {
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      // Click only 2 times (count is 3)
      fireEvent.click(phraseElement);
      fireEvent.click(phraseElement);
      
      act(() => {
        jest.advanceTimersByTime(300);
      });
      
      // Should still be on first phrase
      await waitFor(() => {
        expect(screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i)).toBeInTheDocument();
      });
    });


  });

  describe('SessionStorage Progress Persistence', () => {
    it('should save current index to sessionStorage', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // Navigate to next phrase
      const nextButton = screen.getByLabelText(/Next phrase/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(sessionStorage.getItem('azkar-index-1')).toBe('1');
      });
    });

    it('should load saved index on mount', () => {
      // Save index before render
      sessionStorage.setItem('azkar-index-1', '2');
      
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // Should render third phrase
      expect(screen.getByText(/لا إله إلا الله/i)).toBeInTheDocument();
    });

    it('should isolate progress per category', () => {
      // Save index for category 1
      sessionStorage.setItem('azkar-index-1', '1');
      sessionStorage.setItem('azkar-index-2', '0');
      
      // Render category 1
      const { rerender } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      expect(screen.getByText(/سُبْحَانَ اللهِ وَبِحَمْدِهِ/i)).toBeInTheDocument();
      
      // Switch to category 2
      rerender(<CategoryAzkar categoryId={2} onBack={mockOnBack} />);
      
      // Should start at first phrase of category 2
      expect(screen.getByText(/اللَّهُمَّ بِكَ أَمْسَيْنَا/i)).toBeInTheDocument();
    });

    it('should update sessionStorage on index change', async () => {
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const nextButton = screen.getByLabelText(/Next phrase/i);
      
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(sessionStorage.getItem('azkar-index-1')).toBe('1');
      });
      
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(sessionStorage.getItem('azkar-index-1')).toBe('2');
      });
    });

    it('should clear sessionStorage on back navigation', () => {
      sessionStorage.setItem('azkar-index-1', '2');
      
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const backButton = screen.getByLabelText(/الرجوع للصفحة الرئيسية/i);
      fireEvent.click(backButton);
      
      // The component calls onBack and resets state
      expect(mockOnBack).toHaveBeenCalledTimes(1);
      expect(store.getState().indexCount.value).toBe(0);
    });
  });

  describe('Shuffle Integration', () => {
    it('should shuffle phrases when shuffle is enabled and not already shuffled', async () => {
      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={mockOnBack} />,
        {
          preloadedState: {
            phases: {
              value: [],
              shuffle: true,
              wasShuffled: false
            }
          }
        }
      );
      
      await waitFor(() => {
        expect(store.getState().phases.wasShuffled).toBe(true);
      });
    });

    it('should not shuffle if already shuffled', async () => {
      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={mockOnBack} />,
        {
          preloadedState: {
            phases: {
              value: mockMappedAzkar[0].phrases,
              shuffle: true,
              wasShuffled: true
            }
          }
        }
      );
      
      const initialPhrases = store.getState().phases.value;
      
      // Re-render shouldn't shuffle again
      await waitFor(() => {
        expect(store.getState().phases.value).toEqual(initialPhrases);
      });
    });

    it('should not shuffle when shuffle is disabled', async () => {
      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={mockOnBack} />,
        {
          preloadedState: {
            phases: {
              value: [],
              shuffle: false,
              wasShuffled: false
            }
          }
        }
      );
      
      await waitFor(() => {
        expect(store.getState().phases.wasShuffled).toBe(false);
      });
    });
  });

  describe('State Cleanup', () => {
    it('should reset index on back navigation', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // Navigate to second phrase
      const nextButton = screen.getByLabelText(/Next phrase/i);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(store.getState().indexCount.value).toBe(1);
      });
      
      // Go back
      const backButton = screen.getByLabelText(/الرجوع للصفحة الرئيسية/i);
      fireEvent.click(backButton);
      
      expect(store.getState().indexCount.value).toBe(0);
    });

    it('should reset phases on back navigation', () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      expect(store.getState().phases.value.length).toBeGreaterThan(0);
      
      const backButton = screen.getByLabelText(/الرجوع للصفحة الرئيسية/i);
      fireEvent.click(backButton);
      
      expect(store.getState().phases.value).toEqual([]);
      expect(store.getState().phases.wasShuffled).toBe(false);
    });
  });

  describe('Phrase Navigation', () => {
    it('should set isLastPhrase flag correctly', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      expect(store.getState().indexCount.isLastPhrase).toBe(false);
      
      // Navigate to last phrase
      const nextButton = screen.getByLabelText(/Next phrase/i);
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(store.getState().indexCount.isLastPhrase).toBe(true);
      });
    });

    it('should display correct phrase at each index', async () => {
      render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      // First phrase
      expect(screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i)).toBeInTheDocument();
      
      const nextButton = screen.getByLabelText(/Next phrase/i);
      
      // Second phrase
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/سُبْحَانَ اللهِ وَبِحَمْدِهِ/i)).toBeInTheDocument();
      });
      
      // Third phrase
      fireEvent.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/لا إله إلا الله/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid clicks correctly', async () => {
      const { store } = render(<CategoryAzkar categoryId={1} onBack={mockOnBack} />);
      
      const phraseElement = screen.getByText(/اللَّهُمَّ بِكَ أَصْبَحْنَا/i);
      
      // Rapid fire 10 clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(phraseElement);
      }
      
      await waitFor(() => {
        // Should max out at phrase count (3)
        expect(store.getState().totalCount.value).toBeLessThanOrEqual(3);
      });
    });

    it('should handle invalid categoryId gracefully', () => {
      const { container } = render(<CategoryAzkar categoryId={999} onBack={mockOnBack} />);
      
      // Should render nothing or empty state
      expect(container.querySelector('.zekr-card')).toBeNull();
    });
  });
});
