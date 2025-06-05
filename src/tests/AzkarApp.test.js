import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AzkarApp from "../components/AzkarApp";

jest.mock("../components/Categories", () => (props) => (
  <>
    <button onClick={() => props.onCategorySelect("cat1")}>
      Select Category
    </button>
    {props.onOpenSettings && (
      <button onClick={props.onOpenSettings}>Open Settings</button>
    )}
  </>
));
jest.mock("../components/CategoryAzkar", () => (props) => (
  <>
    <div>CategoryAzkar: {props.categoryId}</div>
    {props.onBack && <button onClick={props.onBack}>Back</button>}
  </>
));
jest.mock("../components/SettingsPage", () => (props) => (
  <button onClick={props.onBack}>Back from Settings</button>
));

describe("AzkarApp best case", () => {
  it("renders Categories, selects a category, and shows CategoryAzkar", () => {
    render(<AzkarApp />);
    expect(screen.getByText("Select Category")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Select Category"));
    expect(screen.getByText("CategoryAzkar: cat1")).toBeInTheDocument();
  });

  it("shows SettingsPage when settings is opened and returns to Categories on back", () => {
    render(<AzkarApp />);
    fireEvent.click(screen.getByText("Open Settings"));
    expect(screen.getByText("Back from Settings")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back from Settings"));
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });

  it("shows CategoryAzkar and returns to Categories on back", () => {
    render(<AzkarApp />);
    fireEvent.click(screen.getByText("Select Category"));
    expect(screen.getByText("CategoryAzkar: cat1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });

  it("shows SettingsPage and returns to Categories on back", () => {
    render(<AzkarApp />);
    fireEvent.click(screen.getByText("Open Settings"));
    expect(screen.getByText("Back from Settings")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Back from Settings"));
    expect(screen.getByText("Open Settings")).toBeInTheDocument();
  });

  it("shows Categories when no category is selected and settings is not open", () => {
    render(<AzkarApp />);
    expect(screen.getByText("Select Category")).toBeInTheDocument();
  });
});
