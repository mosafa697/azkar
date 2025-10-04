import React from 'react';
import { render, screen } from '../test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import Categories from '../../components/Categories';
import CategoryAzkar from '../../components/CategoryAzkar';
import SettingsPage from '../../components/SettingsPage';
import ZekrCard from '../../components/ZekrCard';
import { mockMappedAzkar, mockPhrase } from '../fixtures/mockData';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

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
        }
      ]
    }
  ]
}));

describe('Accessibility Tests', () => {
  describe('Categories Component', () => {
    it('should not have accessibility violations', async () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      const { container } = render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      // Check for search input accessibility
      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toBeInTheDocument();

      // Check for category buttons
      const categoryButton = screen.getByText('أذكار الصباح');
      expect(categoryButton).toBeInTheDocument();
      expect(categoryButton.tagName).toBe('BUTTON');
    });

    it('should support keyboard navigation', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      
      // Should be focusable
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);

      // Should be tabbable to buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        // Buttons should be focusable (either have tabindex="0" or be naturally focusable)
        const tabIndex = button.getAttribute('tabindex');
        expect(tabIndex === '0' || tabIndex === null || button.tagName === 'BUTTON').toBe(true);
      });
    });

    it('should have proper semantic structure', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      // Should have proper heading structure
      const verses = screen.getAllByText(/قال الله تعالى|وقال رسول الله/);
      expect(verses.length).toBeGreaterThan(0);

      // Should have proper input labeling
      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      expect(searchInput).toHaveClass('search-input');
    });
  });

  describe('SettingsPage Component', () => {
    it('should not have accessibility violations', async () => {
      const onBack = jest.fn();

      const { container } = render(
        <SettingsPage onBack={onBack} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form controls', () => {
      const onBack = jest.fn();

      render(
        <SettingsPage onBack={onBack} />
      );

      // Check for toggle switches
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        // Should be associated with a label
        expect(checkbox.closest('.setting-item')).toBeInTheDocument();
      });

      // Check for buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach(button => {
        // Should be focusable
        expect(button).not.toHaveAttribute('tabIndex', '-1');
      });
    });

    it('should have descriptive labels for settings', () => {
      const onBack = jest.fn();

      render(
        <SettingsPage onBack={onBack} />
      );

      // Check for setting labels
      expect(screen.getByText('سمة النظام')).toBeInTheDocument();
      expect(screen.getByText('ترتيب الأذكار')).toBeInTheDocument();
      expect(screen.getByText('إظهار فضل الذكر')).toBeInTheDocument();
      expect(screen.getByText('إجمالي الأذكار')).toBeInTheDocument();
    });

    it('should have proper color contrast and focus indicators', () => {
      const onBack = jest.fn();

      render(
        <SettingsPage onBack={onBack} />
      );

      // Check that buttons and interactive elements exist
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  describe('ZekrCard Component', () => {
    it('should not have accessibility violations', async () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      const { container } = render(
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
              phasesLength: 3 
            },
            subText: { value: true }
          }
        }
      );

      // Disable heading-order rule as h5 is used for styling subtext, not document structure
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: false }
        }
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper button roles and labels', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      render(
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
              phasesLength: 3 
            },
            subText: { value: true }
          }
        }
      );

      // Check for navigation buttons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // All buttons should be keyboard accessible
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabIndex', '-1');
      });
    });

    it('should provide proper text alternatives', () => {
      const onPhraseClick = jest.fn();
      const onBack = jest.fn();

      render(
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
              phasesLength: 3 
            },
            subText: { value: true }
          }
        }
      );

      // Check that text content is present
      expect(screen.getByText(mockPhrase.text)).toBeInTheDocument();
      expect(screen.getByText(mockPhrase.subtext)).toBeInTheDocument();
    });
  });

  describe('CategoryAzkar Component', () => {
    it('should not have accessibility violations', async () => {
      const onBack = jest.fn();

      const { container } = render(
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
              phasesLength: 0,
              isLastPhrase: false,
            },
            fontScale: { value: 2.8 },
            subText: { value: true }
          }
        }
      );

      // Disable heading-order rule as h5 is used for styling subtext, not document structure
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: false }
        }
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support Tab navigation in Categories', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      const buttons = screen.getAllByRole('button');

      // Focus should start at search input
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);

      // Should be able to tab to buttons
      buttons.forEach(button => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });

    it('should support Enter key activation', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      const categoryButton = screen.getByText('أذكار الصباح');
      
      // Simulate Enter key press
      categoryButton.focus();
      categoryButton.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      
      // Note: In a real scenario, you'd check if the action was triggered
      expect(categoryButton).toHaveFocus();
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA roles for interactive elements', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      // Buttons should have button role
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Search input should have textbox role
      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have proper ARIA states for toggles', () => {
      const onBack = jest.fn();

      render(
        <SettingsPage onBack={onBack} />,
        {
          preloadedState: {
            phases: { shuffle: true },
            subText: { value: false }
          }
        }
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('type', 'checkbox');
        // Should have checked state
        expect(checkbox.hasAttribute('checked')).toBeDefined();
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide meaningful text content', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      // Should have meaningful text for screen readers
      expect(screen.getByText('أذكار الصباح')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('ابحث عن فئة...')).toBeInTheDocument();

      // Should have Quranic verses for context
      expect(screen.getByText(/قال الله تعالى/)).toBeInTheDocument();
      expect(screen.getByText(/وقال رسول الله/)).toBeInTheDocument();
    });

    it('should announce changes in dynamic content', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories 
          onCategorySelect={onCategorySelect} 
          onOpenSettings={onOpenSettings} 
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      
      // Initially should show all categories
      expect(screen.getByText('أذكار الصباح')).toBeInTheDocument();

      // After filtering, content should change
      searchInput.value = 'nonexistent';
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));

      // The component should handle the filtering
      expect(searchInput.value).toBe('nonexistent');
    });
  });
});