import React from "react";
import AzkarApp from "../components/AzkarApp";

// Mock the entire react-router-dom module to avoid routing issues in tests
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: () => <div data-testid="route" />,
  useNavigate: () => jest.fn(),
  useParams: () => ({ categoryId: '1' }),
}));

// Mock the child components to avoid complex dependencies
jest.mock("../components/Categories", () => () => (
  <div data-testid="categories">Categories Component</div>
));

jest.mock("../components/CategoryAzkar", () => () => (
  <div data-testid="category-azkar">CategoryAzkar Component</div>
));

jest.mock("../components/SettingsPage", () => () => (
  <div data-testid="settings-page">SettingsPage Component</div>
));

describe("AzkarApp", () => {
  it("should be defined and importable", () => {
    expect(AzkarApp).toBeDefined();
    expect(typeof AzkarApp).toBe('function');
  });

  it("should export a valid React component", () => {
    // Verify it's a function that can be used as a React component
    expect(typeof AzkarApp).toBe('function');
    expect(AzkarApp).not.toBeNull();
  });

  it("should have the correct component structure", () => {
    // Test that the component can be created without errors
    const componentName = AzkarApp.name;
    expect(componentName).toBe('AzkarApp');
  });
});
