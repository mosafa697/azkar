import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow, errorMessage }) => {
  if (shouldThrow) {
    throw new Error(errorMessage || 'Test error');
  }
  return <div>Normal rendering</div>;
};

// Component that throws during render
const BrokenComponent = () => {
  throw new Error('Component render error');
};

describe('ErrorBoundary Component', () => {
  const originalEnv = process.env.NODE_ENV;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console.error to avoid cluttering test output
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  describe('Normal Rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render multiple children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should not show error UI when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      expect(screen.queryByText(/حدث خطأ غير متوقع/)).not.toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('should catch errors from child components', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should display fallback UI when error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
      expect(screen.getByText(/عذراً، حدث خطأ في التطبيق/)).toBeInTheDocument();
    });

    it('should not render children when error is caught', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.queryByText('Normal rendering')).not.toBeInTheDocument();
    });

    it('should catch errors with custom messages', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Custom error message" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });
  });

  describe('Fallback UI', () => {
    it('should display warning emoji', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    });

    it('should display Arabic error message', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should display retry button', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /المحاولة مرة أخرى/ })).toBeInTheDocument();
    });

    it('should display reload button', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: /تحديث الصفحة/ })).toBeInTheDocument();
    });

    it('should have correct button roles', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });
  });

  describe('Retry Mechanism', () => {
    it('should reset error state when retry is clicked', () => {
      // Use a controllable throwing component
      let shouldThrow = true;
      const ControlledThrower = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Normal rendering</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ControlledThrower />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();

      // Change the flag before clicking retry
      shouldThrow = false;
      
      const retryButton = screen.getByRole('button', { name: /المحاولة مرة أخرى/ });
      fireEvent.click(retryButton);

      // Force rerender to pick up the new behavior
      rerender(
        <ErrorBoundary>
          <ControlledThrower />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/حدث خطأ غير متوقع/)).not.toBeInTheDocument();
      expect(screen.getByText('Normal rendering')).toBeInTheDocument();
    });

    it('should call window.reload when reload button is clicked', () => {
      // Mock window.location.reload
      delete window.location;
      window.location = { reload: jest.fn() };

      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      const reloadButton = screen.getByRole('button', { name: /تحديث الصفحة/ });
      fireEvent.click(reloadButton);

      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    it('should clear error and errorInfo on retry', () => {
      // Use a controllable throwing component
      let shouldThrow = true;
      const ControlledThrower = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>Recovered</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <ControlledThrower />
        </ErrorBoundary>
      );

      // Error state shown
      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
      
      // Change the flag before clicking retry
      shouldThrow = false;
      
      const retryButton = screen.getByRole('button', { name: /المحاولة مرة أخرى/ });
      fireEvent.click(retryButton);

      // Force rerender to pick up the new behavior
      rerender(
        <ErrorBoundary>
          <ControlledThrower />
        </ErrorBoundary>
      );

      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });
  });

  describe('Development vs Production Display', () => {
    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Development error" />
        </ErrorBoundary>
      );

      expect(screen.getByText(/Error Details \(Development Only\)/)).toBeInTheDocument();
    });

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Production error" />
        </ErrorBoundary>
      );

      expect(screen.queryByText(/Error Details \(Development Only\)/)).not.toBeInTheDocument();
    });

    it('should display error stack in development mode', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Stack trace error" />
        </ErrorBoundary>
      );

      const details = screen.getByText(/Error Details \(Development Only\)/);
      expect(details).toBeInTheDocument();
    });
  });

  describe('Error Logging', () => {
    it('should log errors in development mode', () => {
      process.env.NODE_ENV = 'development';
      consoleErrorSpy.mockRestore();
      const newSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Log test error" />
        </ErrorBoundary>
      );

      // React logs the error twice (once for the error, once for component stack)
      expect(newSpy).toHaveBeenCalled();

      newSpy.mockRestore();
    });

    it('should store error in state', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="State error" />
        </ErrorBoundary>
      );

      // Error UI is displayed, which means error was stored in state
      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should store errorInfo in state', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // If error details are shown, errorInfo must be in state
      expect(screen.getByText(/Error Details \(Development Only\)/)).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should call getDerivedStateFromError on error', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // If fallback UI is shown, getDerivedStateFromError was called
      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should call componentDidCatch on error', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="componentDidCatch test" />
        </ErrorBoundary>
      );

      // Error details shown means componentDidCatch set state
      expect(screen.getByText(/Error Details \(Development Only\)/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors in nested components', () => {
      render(
        <ErrorBoundary>
          <div>
            <div>
              <BrokenComponent />
            </div>
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should handle multiple ErrorBoundaries', () => {
      render(
        <ErrorBoundary>
          <ErrorBoundary>
            <BrokenComponent />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      // Inner boundary should catch the error
      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should handle errors after initial successful render', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Normal rendering')).toBeInTheDocument();

      // Now make it throw
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });

    it('should handle null error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage={null} />
        </ErrorBoundary>
      );

      expect(screen.getByText(/حدث خطأ غير متوقع/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
        expect(button).toBeVisible();
      });
    });

    it('should have readable text content', () => {
      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      const errorHeading = screen.getByText(/حدث خطأ غير متوقع/);
      expect(errorHeading).toBeVisible();
    });
  });
});
