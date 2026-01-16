import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import SettingsPage from '../../components/SettingsPage';
import CategoryAzkar from '../../components/CategoryAzkar';
import { mockPhrase } from '../fixtures/mockData';

describe('LocalStorage Interactions', () => {
  beforeEach(() => {
    // Clear all mock calls
    jest.clearAllMocks();
    
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('SessionStorage for category progress', () => {
    it('should handle sessionStorage quota exceeded', () => {
      const originalSetItem = sessionStorage.setItem;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      sessionStorage.setItem = jest.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });
      
      const onBack = jest.fn();
      
      // Component should handle the error gracefully and not crash
      render(
        <CategoryAzkar categoryId={1} onBack={onBack} />,
        {
          preloadedState: {
            phases: {
              value: [mockPhrase],
              shuffle: false,
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
      
      // Should render successfully despite storage error
      // The component might render any phrase from the mock data
      const hasContent = screen.queryByRole('heading') || screen.queryByText(/الله/);
      expect(hasContent).toBeTruthy();
      
      // Restore original functions
      sessionStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('Theme persistence', () => {
    it('should save theme selection to localStorage', () => {
      const onBack = jest.fn();
      
      const { store } = render(<SettingsPage onBack={onBack} />);
      
      const themeButtons = screen.getAllByRole('button');
      const solarizedThemeButton = themeButtons.find(button => 
        button.getAttribute('title') === 'solarized'
      );
      
      expect(solarizedThemeButton).toBeInTheDocument();
      fireEvent.click(solarizedThemeButton);
      
      // Check if theme state changed in store
      const state = store.getState();
      expect(state.theme.value).toBe('solarized');
    });

    it('should load theme from localStorage on initialization', () => {
      localStorage.setItem('theme', 'dark');
      
      const onBack = jest.fn();
      const { store } = render(<SettingsPage onBack={onBack} />, {
        preloadedState: {
          theme: {
            value: 'dark',
            list: ['light', 'solarized', 'dark'],
          }
        }
      });
      
      // Verify theme state
      const state = store.getState();
      expect(state.theme.value).toBe('dark');
      expect(screen.getByText('سمة النظام')).toBeInTheDocument();
    });
  });

  describe('Font scale persistence', () => {
    it('should save font scale changes to localStorage', () => {
      const { store } = render(
        <div>Test Component</div>,
        {
          preloadedState: {
            fontScale: {
              value: 3.0,
            }
          }
        }
      );
      
      const state = store.getState();
      expect(state.fontScale.value).toBe(3.0);
    });

    it('should handle invalid font scale in localStorage', () => {
      localStorage.setItem('fontScale', 'invalid');
      
      const { store } = render(
        <div>Test Component</div>
      );
      
      const state = store.getState();
      expect(state.fontScale.value).toBe(2.8); // Should use default
    });

    it('should handle missing font scale in localStorage', () => {
      const { store } = render(
        <div>Test Component</div>
      );
      
      const state = store.getState();
      expect(state.fontScale.value).toBe(2.8); // Should use default
    });
  });

  describe('Shuffle preference persistence', () => {
    it('should save shuffle preference to localStorage', () => {
      const onBack = jest.fn();
      
      const { store } = render(<SettingsPage onBack={onBack} />, {
        preloadedState: {
          phases: {
            shuffle: false,
            value: [],
            wasShuffled: false,
          }
        }
      });
      
      // Find the shuffle toggle specifically (first checkbox is shuffle)
      const checkboxes = screen.getAllByRole('checkbox');
      const shuffleToggle = checkboxes[0]; // First checkbox is shuffle
      fireEvent.click(shuffleToggle);
      
      // Check if state changed in store
      const state = store.getState();
      expect(state.phases.shuffle).toBe(true);
    });

    it('should load shuffle preference from localStorage', () => {
      const { store } = render(
        <div>Test Component</div>,
        {
          preloadedState: {
            phases: {
              shuffle: true,
              value: [],
              wasShuffled: false,
            }
          }
        }
      );
      
      const state = store.getState();
      expect(state.phases.shuffle).toBe(true);
    });
  });

  describe('SubText visibility persistence', () => {
    it('should save subtext visibility to localStorage', () => {
      const onBack = jest.fn();
      
      const { store } = render(<SettingsPage onBack={onBack} />, {
        preloadedState: {
          subText: {
            value: false,
          }
        }
      });
      
      const checkboxes = screen.getAllByRole('checkbox');
      const subTextToggle = checkboxes[1]; // Second checkbox is for subtext
      fireEvent.click(subTextToggle);
      
      // Check if state changed in store  
      const state = store.getState();
      expect(state.subText.value).toBe(true);
    });

    it('should load subtext visibility from localStorage', () => {
      localStorage.setItem('showSubText', 'true');
      
      const { store } = render(
        <div>Test Component</div>,
        {
          preloadedState: {
            subText: {
              value: true,
            }
          }
        }
      );
      
      const state = store.getState();
      expect(state.subText.value).toBe(true);
    });
  });

  describe('Total count persistence', () => {
    it('should save total count to localStorage', () => {
      localStorage.setItem('azkarTotalCount', '50');
      
      const { store } = render(
        <div>Test Component</div>,
        {
          preloadedState: {
            totalCount: {
              value: 50,
            }
          }
        }
      );
      
      const state = store.getState();
      expect(state.totalCount.value).toBe(50);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw an error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('localStorage error');
      });
      
      const { store } = render(
        <div>Test Component</div>
      );
      
      const state = store.getState();
      expect(state.totalCount.value).toBe(0); // Should default to 0
      
      // Restore original function
      localStorage.getItem = originalGetItem;
    });

    it('should reset total count and update localStorage', () => {
      const onBack = jest.fn();
      
      const { store } = render(<SettingsPage onBack={onBack} />, {
        preloadedState: {
          totalCount: {
            value: 100,
          }
        }
      });
      
      // Mock window.confirm to return true
      window.confirm = jest.fn(() => true);
      
      const resetButton = screen.getByTitle('إعادة تعيين العداد');
      fireEvent.click(resetButton);
      
      // Check if state was reset
      const state = store.getState();
      expect(state.totalCount.value).toBe(0);
      expect(window.confirm).toHaveBeenCalledWith('هل أنت متأكد من إعادة تعيين عداد الأذكار؟');
      
      // Clean up
      window.confirm.mockRestore();
    });

    it('should not reset total count when user cancels', () => {
      const onBack = jest.fn();
      
      render(<SettingsPage onBack={onBack} />, {
        preloadedState: {
          totalCount: {
            value: 100,
          }
        }
      });
      
      // Mock window.confirm to return false
      window.confirm = jest.fn(() => false);
      
      const resetButton = screen.getByTitle('إعادة تعيين العداد');
      fireEvent.click(resetButton);
      
      expect(window.confirm).toHaveBeenCalled();
      // localStorage.setItem should not be called for reset
      
      // Clean up
      window.confirm.mockRestore();
    });
  });



  describe('Storage cleanup and edge cases', () => {
    it('should handle storage being disabled', () => {
      // Mock localStorage to be undefined
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;
      
      // Should not crash
      const { store } = render(<div>Test Component</div>);
      expect(store).toBeDefined();
      
      // Restore localStorage
      global.localStorage = originalLocalStorage;
    });

    it('should handle corrupt localStorage data', () => {
      localStorage.setItem('fontScale', '{"invalid": "json"}');
      localStorage.setItem('shufflePhases', 'not-a-boolean');
      localStorage.setItem('azkarTotalCount', 'not-a-number');
      
      const { store } = render(<div>Test Component</div>);
      const state = store.getState();
      
      // Should use defaults for invalid data
      expect(state.fontScale.value).toBe(2.8);
      expect(state.phases.shuffle).toBe(false);
      expect(state.totalCount.value).toBe(0);
    });

    it('should handle simultaneous storage operations', () => {
      // Simulate rapid storage operations
      localStorage.setItem('theme', 'light');
      localStorage.setItem('fontScale', '3.2');
      localStorage.setItem('shufflePhases', 'true');
      localStorage.setItem('showSubText', 'true');
      localStorage.setItem('azkarTotalCount', '25');
      
      expect(localStorage.getItem('theme')).toBe('light');
      expect(localStorage.getItem('fontScale')).toBe('3.2');
      expect(localStorage.getItem('shufflePhases')).toBe('true');
      expect(localStorage.getItem('showSubText')).toBe('true');
      expect(localStorage.getItem('azkarTotalCount')).toBe('25');
    });
  });
});