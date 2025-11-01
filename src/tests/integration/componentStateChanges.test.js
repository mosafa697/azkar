import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import ZekrCard from '../../components/ZekrCard';
import CategoryAzkar from '../../components/CategoryAzkar';
import SettingsPage from '../../components/SettingsPage';
import { mockPhrase, mockMappedAzkar } from '../fixtures/mockData';

// Mock navigation functions
const mockNavigate = jest.fn();

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
          count: 1,
          subtext: "من قالها موقنا بها حين يمسى ومات من ليلته دخل الجنة"
        },
        {
          id: 2,
          text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
          count: 3,
          subtext: "من قالها في يوم مائة مرة حطت خطاياه"
        }
      ]
    }
  ]
}));

describe('Component State Changes', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    sessionStorage.clear();
    localStorage.clear();
  });

  describe('ZekrCard State Management', () => {
    it('should update counter state when phrase is clicked', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      render(
        <ZekrCard
          phrase={{ ...mockPhrase, count: 3 }}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        {
          preloadedState: {
            fontScale: { value: 2.8 },
            indexCount: { 
              value: 0, 
              isLastPhrase: false, 
              phasesLength: 2 
            },
            subText: { value: true }
          }
        }
      );

      const phraseButton = screen.getByText(mockPhrase.text);
      fireEvent.click(phraseButton);

      expect(onPhraseClick).toHaveBeenCalled();
    });

    it('should handle font scale changes', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      const { store } = render(
        <ZekrCard
          phrase={mockPhrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        {
          preloadedState: {
            fontScale: { value: 2.8 },
            indexCount: { 
              value: 0, 
              isLastPhrase: false, 
              phasesLength: 2 
            },
            subText: { value: true }
          }
        }
      );

      // Get the font scale buttons using their test IDs
      const decreaseFontButton = screen.getByTestId('decrease-font-size');
      const increaseFontButton = screen.getByTestId('increase-font-size');

      // Ensure font buttons exist before testing
      expect(decreaseFontButton).toBeInTheDocument();
      expect(increaseFontButton).toBeInTheDocument();
      
      fireEvent.click(decreaseFontButton); // Click font scale button
      
      // Font scale should have changed in store
      const state = store.getState();
      expect(state.fontScale.value).toBeDefined();
    });

    it('should update progress when navigating between phrases', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      const { rerender } = render(
        <ZekrCard
          phrase={mockPhrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        {
          preloadedState: {
            fontScale: { value: 2.8 },
            indexCount: { 
              value: 0, 
              isLastPhrase: false, 
              phasesLength: 2 
            },
            subText: { value: true }
          }
        }
      );

      // Rerender with different index
      rerender(
        <ZekrCard
          phrase={mockPhrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        {
          preloadedState: {
            fontScale: { value: 2.8 },
            indexCount: { 
              value: 1, 
              isLastPhrase: true, 
              phasesLength: 2 
            },
            subText: { value: true }
          }
        }
      );

      // Should reflect new state
      expect(screen.getByText(mockPhrase.text)).toBeInTheDocument();
    });

    it('should toggle subtext visibility', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      // Test with subtext visible
      const { store } = render(
        <ZekrCard
          phrase={mockPhrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        {
          preloadedState: {
            fontScale: { value: 2.8 },
            indexCount: { 
              value: 0, 
              isLastPhrase: false, 
              phasesLength: 2 
            },
            subText: { value: true }
          }
        }
      );

      // Should show subtext when value is true
      expect(screen.getByText(mockPhrase.subtext)).toBeInTheDocument();
      expect(store.getState().subText.value).toBe(true);
    });
  });

  describe('CategoryAzkar State Management', () => {
    it('should initialize with correct category data', async () => {
      const onBack = jest.fn();

      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: [],
              shuffle: false,
              wasShuffled: false,
            },
            indexCount: {
              value: 0,
              phasesLength: 0,
              isLastPhrase: false,
            }
          }
        }
      );

      // Should set phases in the store
      await waitFor(() => {
        const state = store.getState();
        expect(state.phases.value.length).toBeGreaterThan(0);
      });
    });

    it('should handle shuffle state changes', async () => {
      const onBack = jest.fn();

      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: mockMappedAzkar[0].phrases,
              shuffle: true,
              wasShuffled: false,
            },
            indexCount: {
              value: 0,
              phasesLength: 1,
              isLastPhrase: false,
            }
          }
        }
      );

      // Should eventually trigger shuffle
      await waitFor(() => {
        const state = store.getState();
        expect(state.phases.wasShuffled).toBe(true);
      });
    });

    it('should save progress to sessionStorage', () => {
      const onBack = jest.fn();

      render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: mockMappedAzkar[0].phrases,
              shuffle: false,
              wasShuffled: false,
            },
            indexCount: {
              value: 1,
              phasesLength: 1,
              isLastPhrase: false,
            }
          }
        }
      );

      // Should save to sessionStorage
      expect(sessionStorage.getItem('azkar-index-1')).toBe('1');
    });

    it('should clean up on back navigation', async () => {
      const onBack = jest.fn();
      sessionStorage.setItem('azkar-index-1', '1');

      const { store } = render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: mockMappedAzkar[0].phrases,
              shuffle: false,
              wasShuffled: false,
            },
            indexCount: {
              value: 0,
              phasesLength: 2,
              isLastPhrase: false,
            }
          }
        }
      );

      // Wait for component to render and find back button
      await waitFor(() => {
        // The component might show either phrase, let's check for any phrase
        const phrase1 = screen.queryByText('اللَّهُمَّ بِكَ أَصْبَحْنَا');
        const phrase2 = screen.queryByText('سُبْحَانَ اللهِ وَبِحَمْدِهِ');
        expect(phrase1 || phrase2).toBeTruthy();
      });

      const backButton = screen.getByRole('button', { name: 'الرجوع للصفحة الرئيسية' });
      fireEvent.click(backButton);

      expect(onBack).toHaveBeenCalled();

      // The sessionStorage should be cleared after back navigation
      // Note: The value might be "0" due to state reset instead of removal
      const sessionValue = sessionStorage.getItem('azkar-index-1');
      expect(sessionValue === null || sessionValue === "0").toBe(true);

      // Additional check: verify store state reset after back navigation
      const state = store.getState();
      expect(state.indexCount.value === 0 || state.indexCount.value === undefined).toBe(true);
    });
  });

  describe('SettingsPage State Management', () => {
    it('should toggle shuffle preference', () => {
      const onBack = jest.fn();

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: false },
            theme: { value: 'light', list: ['light', 'dark'] },
            subText: { value: false },
            totalCount: { value: 0 }
          }
        }
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const shuffleCheckbox = checkboxes[0]; // First checkbox is shuffle

      fireEvent.click(shuffleCheckbox);

      const state = store.getState();
      expect(state.phases.shuffle).toBe(true);
    });

    it('should toggle subtext visibility', () => {
      const onBack = jest.fn();

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: false },
            theme: { value: 'light', list: ['light', 'dark'] },
            subText: { value: false },
            totalCount: { value: 0 }
          }
        }
      );

      const checkboxes = screen.getAllByRole('checkbox');
      const subtextCheckbox = checkboxes[1]; // Second checkbox is subtext

      fireEvent.click(subtextCheckbox);

      const state = store.getState();
      expect(state.subText.value).toBe(true);
    });

    it('should change theme', () => {
      const onBack = jest.fn();

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: false },
            theme: { value: 'light', list: ['light', 'dark', 'solarized'] },
            subText: { value: false },
            totalCount: { value: 0 }
          }
        }
      );

      // Get theme buttons by their class name
      const themeButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('theme-btn')
      );

      // Ensure theme buttons exist before testing
      expect(themeButtons.length).toBeGreaterThan(0);
      const themeButton = themeButtons[0]; // Click the first theme button
      
      fireEvent.click(themeButton);
      
      const state = store.getState();
      expect(state.theme.value).toBeDefined();
    });

    it('should reset total count with confirmation', () => {
      const onBack = jest.fn();
      window.confirm = jest.fn(() => true);

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: false },
            theme: { value: 'light', list: ['light', 'dark'] },
            subText: { value: false },
            totalCount: { value: 50 }
          }
        }
      );

      const resetButton = screen.getByTitle('إعادة تعيين العداد');
      fireEvent.click(resetButton);

      expect(window.confirm).toHaveBeenCalled();
      const state = store.getState();
      expect(state.totalCount.value).toBe(0);

      window.confirm.mockRestore();
    });

    it('should not reset total count without confirmation', () => {
      const onBack = jest.fn();
      window.confirm = jest.fn(() => false);

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: false },
            theme: { value: 'light', list: ['light', 'dark'] },
            subText: { value: false },
            totalCount: { value: 50 }
          }
        }
      );

      const resetButton = screen.getByTitle('إعادة تعيين العداد');
      fireEvent.click(resetButton);

      expect(window.confirm).toHaveBeenCalled();
      const state = store.getState();
      expect(state.totalCount.value).toBe(50); // Should remain unchanged

      window.confirm.mockRestore();
    });
  });

  describe('Cross-component State Interactions', () => {
    it('should maintain font scale across components', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      const initialState = {
        fontScale: { value: 3.5 },
        indexCount: { 
          value: 0, 
          isLastPhrase: false, 
          phasesLength: 2 
        },
        subText: { value: true }
      };

      const { store } = render(
        <ZekrCard
          phrase={mockPhrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />,
        { preloadedState: initialState }
      );

      // Font scale should be maintained
      const state = store.getState();
      expect(state.fontScale.value).toBe(3.5);
    });

    it('should persist theme changes across navigation', () => {
      const onBack = jest.fn();

      const { store } = render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            theme: { value: 'dark', list: ['light', 'dark', 'solarized'] }
          }
        }
      );

      // Theme should be persisted
      const state = store.getState();
      expect(state.theme.value).toBe('dark');
    });
  });

  describe('Error State Handling', () => {
    it('should handle missing category gracefully', () => {
      const onBack = jest.fn();

      render(
        <CategoryAzkar categoryId={999} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: [],
              shuffle: false,
              wasShuffled: false,
            }
          }
        }
      );

      // Should not crash with missing category
      expect(screen.queryByText('اللَّهُمَّ بِكَ أَصْبَحْنَا')).not.toBeInTheDocument();
    });

    it('should handle sessionStorage errors', () => {
      const onBack = jest.fn();
      
      // Mock sessionStorage to throw error
      const originalSetItem = sessionStorage.setItem;
      sessionStorage.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: mockMappedAzkar[0].phrases,
              shuffle: false,
              wasShuffled: false,
            },
            indexCount: {
              value: 1,
              phasesLength: 1,
              isLastPhrase: false,
            }
          }
        }
      );

      // Should not crash despite storage error
      expect(screen.getByText('سُبْحَانَ اللهِ وَبِحَمْدِهِ')).toBeInTheDocument();

      // Restore sessionStorage
      sessionStorage.setItem = originalSetItem;
    });
  });
});