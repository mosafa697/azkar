import React from "react";
import { render, screen } from "@testing-library/react";
import AzkarApp from "../components/AzkarApp";

// Mock the child components
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
  it("renders without crashing", () => {
    render(<AzkarApp />);
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
  });

  it("renders the router structure", () => {
    render(<AzkarApp />);
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });

  it("contains route components", () => {
    render(<AzkarApp />);
    // The app should render without errors and contain the router structure
    expect(screen.getByTestId("routes")).toBeInTheDocument();
  });
});
