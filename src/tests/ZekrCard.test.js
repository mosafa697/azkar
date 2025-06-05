import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ZekrCard from "../components/ZekrCard";
import fontScaleReducer, {
  incrementFontScale,
  decrementFontScale,
} from "../store/fontScaleSlice";
import indexCountReducer, {
  incrementIndex,
  decrementIndex,
} from "../store/indexCountSlice";
import subTextReducer from "../store/subTextSlice";

const phrase = { text: "Test phrase", count: 3, subtext: "Subtext here" };

describe("ZekrCard", () => {
  let store;
  let onBack, onPhraseClick;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        fontScale: fontScaleReducer,
        indexCount: indexCountReducer,
        subText: subTextReducer,
      },
      preloadedState: {
        fontScale: { value: 4 },
        indexCount: { value: 1, isLastPhrase: false, phasesLength: 5 },
        subText: { value: true },
      },
    });
    onBack = jest.fn();
    onPhraseClick = jest.fn();
  });

  it("renders phrase text and subtext", () => {
    render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    expect(screen.getByText("Test phrase")).toBeInTheDocument();
    expect(screen.getByText("Subtext here")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    const { container } = render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    const backButton = container.querySelector(".back-btn");
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });

  it("calls onPhraseClick when content is clicked", () => {
    render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    fireEvent.click(screen.getByText("Test phrase"));
    expect(onPhraseClick).toHaveBeenCalled();
  });

  it("dispatches incrementFontScale and decrementFontScale on font buttons", () => {
    const spy = jest.spyOn(store, "dispatch");
    const { container } = render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    const fontButtons = container.querySelectorAll(".font-btn");
    fireEvent.click(fontButtons[0]); // MinusIcon
    fireEvent.click(fontButtons[1]); // PlusIcon
    expect(spy).toHaveBeenCalledWith(decrementFontScale());
    expect(spy).toHaveBeenCalledWith(incrementFontScale());
  });

  it("shows subtext only if showSubText is true and phrase.subtext exists", () => {
    const { unmount } = render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    expect(screen.getByText("Subtext here")).toBeInTheDocument();
    unmount();
    store = configureStore({
      reducer: {
        fontScale: fontScaleReducer,
        indexCount: indexCountReducer,
        subText: subTextReducer,
      },
      preloadedState: {
        fontScale: { value: 4 },
        indexCount: { value: 1, isLastPhrase: false, phasesLength: 5 },
        subText: { value: false },
      },
    });
    render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    expect(screen.queryByText("Subtext here")).not.toBeInTheDocument();
  });

  it("dispatches incrementIndex and decrementIndex on navigation buttons", () => {
    const spy = jest.spyOn(store, "dispatch");
    const { container } = render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    const navButtons = container.querySelectorAll(".switch-btn");
    fireEvent.click(navButtons[0]); // right nav (decrementIndex)
    fireEvent.click(navButtons[1]); // left nav (incrementIndex)
    expect(spy).toHaveBeenCalledWith(decrementIndex());
    expect(spy).toHaveBeenCalledWith(incrementIndex());
  });

  it("counter bar width reflects progress", () => {
    render(
      <Provider store={store}>
        <ZekrCard
          phrase={phrase}
          counter={0}
          onPhraseClick={onPhraseClick}
          isAnimating={false}
          onBack={onBack}
        />
      </Provider>
    );
    const bar = document.querySelector(".counter-bar");
    expect(bar.style.width).toBe("20%");
  });
});
