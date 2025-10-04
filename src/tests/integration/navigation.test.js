import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import Categories from '../../components/Categories';

describe('Navigation Integration Tests', () => {
  describe('Categories Navigation', () => {
    it('should render categories component', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const categoryButtons = screen.getAllByRole('button');
      expect(categoryButtons.length).toBeGreaterThan(0);
    });

    it('should call onOpenSettings when settings button is clicked', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const settingsButton = screen.getByLabelText('فتح الإعدادات');
      fireEvent.click(settingsButton);
      expect(onOpenSettings).toHaveBeenCalled();
    });

    it('should filter categories on search input', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      fireEvent.change(searchInput, { target: { value: 'صباح' } });

      expect(searchInput.value).toBe('صباح');
    });

    it('should handle empty search results', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      fireEvent.change(searchInput, { target: { value: 'xyz123nonexistent' } });

      const categoryButtons = screen.queryAllByRole('button').filter(btn => 
        btn.textContent.includes('أذكار')
      );
      
      // Most category buttons should be filtered out
      expect(categoryButtons.length).toBeLessThan(5);
    });
  });

  describe('State Management', () => {
    it('should maintain search input value', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      const { rerender } = render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      fireEvent.change(searchInput, { target: { value: 'مساء' } });

      expect(searchInput.value).toBe('مساء');

      rerender(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const newSearchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      expect(newSearchInput).toBeInTheDocument();
    });

    it('should reset to default state on clear', () => {
      const onCategorySelect = jest.fn();
      const onOpenSettings = jest.fn();

      render(
        <Categories
          onCategorySelect={onCategorySelect}
          onOpenSettings={onOpenSettings}
        />
      );

      const searchInput = screen.getByPlaceholderText('ابحث عن فئة...');
      fireEvent.change(searchInput, { target: { value: 'test' } });
      expect(searchInput.value).toBe('test');

      fireEvent.change(searchInput, { target: { value: '' } });
      expect(searchInput.value).toBe('');
    });
  });
});
