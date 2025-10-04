import React from 'react';

// Enhanced mocks for react-router-dom
export const mockNavigate = jest.fn();
export const mockUseParams = jest.fn(() => ({ categoryId: '1' }));

export const BrowserRouter = ({ children }) => 
  React.createElement('div', { 'data-testid': 'browser-router' }, children);

export const MemoryRouter = ({ children, initialEntries = ['/'] }) => 
  React.createElement('div', { 
    'data-testid': 'memory-router', 
    'data-initial-entries': initialEntries.join(',') 
  }, children);

export const Routes = ({ children }) => 
  React.createElement('div', { 'data-testid': 'routes' }, children);

export const Route = ({ element, path }) => 
  React.createElement('div', { 
    'data-testid': 'route', 
    'data-path': path 
  }, element);

export const useNavigate = () => mockNavigate;
export const useParams = () => mockUseParams();

// Reset function for tests
export const resetMocks = () => {
  mockNavigate.mockClear();
  mockUseParams.mockReturnValue({ categoryId: '1' });
};

const reactRouterDomMock = {
  BrowserRouter,
  MemoryRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
  resetMocks,
};

export default reactRouterDomMock;
