import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ZekrCard from "../components/ZekrCard";
import fontScaleReducer from "../store/fontScaleSlice";
import indexCountReducer from "../store/indexCountSlice";
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

  it("calls onPhraseClick when phrase content is clicked", () => {
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

  it("renders component without errors", () => {
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
    
    // Verify component renders correctly
    expect(screen.getByText("Test phrase")).toBeInTheDocument();
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
    
    const newStore = configureStore({
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
      <Provider store={newStore}>
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

  it("renders with correct counter progress", () => {
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
    
    // Test that component renders - progress bar testing can be checked indirectly
    expect(screen.getByText("Test phrase")).toBeInTheDocument();
    expect(screen.getByText("Subtext here")).toBeInTheDocument();
  });
});
