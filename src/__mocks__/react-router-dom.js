import React from 'react';

// Mock react-router-dom components and hooks
export const BrowserRouter = ({ children }) => 
  React.createElement('div', { 'data-testid': 'browser-router' }, children);

export const Routes = ({ children }) => 
  React.createElement('div', { 'data-testid': 'routes' }, children);

export const Route = ({ element }) => 
  React.createElement('div', { 'data-testid': 'route' }, element);

export const useNavigate = () => jest.fn();

export const useParams = () => ({ categoryId: '1' });

export default {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
};
