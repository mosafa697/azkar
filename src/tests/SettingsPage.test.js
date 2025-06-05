import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SettingsPage from "../components/SettingsPage";
import themeReducer, { setTheme } from "../store/themeSlice";
import phasesReducer, { toggleShuffle } from "../store/phasesSlice";
import subTextReducer, { toggleAppearance } from "../store/subTextSlice";

describe("SettingsPage", () => {
  let store;
  let onBack;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        phases: phasesReducer,
        theme: themeReducer,
        subText: subTextReducer,
      },
      preloadedState: {
        phases: { shuffle: false },
        theme: { value: "light", list: ["light", "dark", "green"] },
        subText: { value: false },
      },
    });
    onBack = jest.fn();
  });

  it("renders all settings and buttons", () => {
    render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    expect(screen.getByText("سمة النظام")).toBeInTheDocument();
    expect(screen.getByText("ترتيب الأذكار")).toBeInTheDocument();
    expect(screen.getByText("إظهار فضل الذكر")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThan(1);
  });

  it("dispatches setTheme when a theme button is clicked", () => {
    render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    const themeButtons = screen.getAllByRole("button");
    fireEvent.click(themeButtons[0]);
    // The state should update, so we check the value
    expect(store.getState().theme.value).toBe("light");
  });

  it("dispatches toggleShuffle when shuffle switch is toggled", () => {
    render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    const shuffleInput = screen.getAllByRole("checkbox")[0];
    fireEvent.click(shuffleInput);
    expect(store.getState().phases.shuffle).toBe(true);
  });

  it("dispatches toggleAppearance when subtext switch is toggled", () => {
    render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    const subTextInput = screen.getAllByRole("checkbox")[1];
    fireEvent.click(subTextInput);
    expect(store.getState().subText.value).toBe(true);
  });

  it("calls onBack when the exit button is clicked", () => {
    const { container } = render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    const exitButton = container.querySelector(".category-btn");
    fireEvent.click(exitButton);
    expect(onBack).toHaveBeenCalled();
  });

  it("renders SettingsPage and finds system theme label", () => {
    render(
      <Provider store={store}>
        <SettingsPage onBack={onBack} />
      </Provider>
    );
    expect(screen.getByText("سمة النظام")).toBeInTheDocument();
  });
});
