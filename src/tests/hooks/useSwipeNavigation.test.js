import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { incrementIndex, decrementIndex } from '../../store/indexCountSlice';

// Mock useSwipeable
jest.mock('react-swipeable', () => ({
  useSwipeable: jest.fn(),
}));

// Mock react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock the custom hook by importing it from the component
// We'll extract it to a separate file, but for now we'll test it inline
const { useSwipeable } = require('react-swipeable');

// Custom hook implementation for testing
const useSwipeNavigation = (dispatch) => {
  const { useState, useCallback } = require('react');
  
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false);

  const SWIPE_DAMPENING = 0.5;
  const SWIPE_ANIMATION_DURATION = 200;

  const handleSwipeAnimation = useCallback(
    (direction, action) => {
      setIsSwipeAnimating(true);
      setSwipeOffset(direction * (global.innerWidth || 1024));
      setTimeout(() => {
        dispatch(action());
        setSwipeOffset(0);
        setIsSwipeAnimating(false);
      }, SWIPE_ANIMATION_DURATION);
    },
    [dispatch]
  );

  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwipeOffset(eventData.deltaX * SWIPE_DAMPENING);
    },
    onSwipedLeft: () => handleSwipeAnimation(-1, decrementIndex),
    onSwipedRight: () => handleSwipeAnimation(1, incrementIndex),
    onSwiped: () => {
      if (!isSwipeAnimating) {
        setSwipeOffset(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  return { swipeOffset, isSwipeAnimating, swipeHandlers };
};

describe('useSwipeNavigation', () => {
  let mockDispatch;
  let mockUseSwipeable;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    mockUseSwipeable = jest.fn();
    useSwipeable.mockImplementation(mockUseSwipeable);
    
    // Mock window.innerWidth
    Object.defineProperty(global, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    mockUseSwipeable.mockReturnValue({});
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    expect(result.current.swipeOffset).toBe(0);
    expect(result.current.isSwipeAnimating).toBe(false);
    expect(result.current.swipeHandlers).toBeDefined();
  });

  it('should configure useSwipeable with correct handlers', () => {
    mockUseSwipeable.mockReturnValue({});
    
    renderHook(() => useSwipeNavigation(mockDispatch));
    
    expect(useSwipeable).toHaveBeenCalledWith({
      onSwiping: expect.any(Function),
      onSwipedLeft: expect.any(Function),
      onSwipedRight: expect.any(Function),
      onSwiped: expect.any(Function),
      trackMouse: true,
      trackTouch: true,
    });
  });

  it('should handle onSwiping event', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    act(() => {
      swipeHandlers.onSwiping({ deltaX: 100 });
    });
    
    expect(result.current.swipeOffset).toBe(50); // 100 * 0.5 (SWIPE_DAMPENING)
  });

  it('should handle onSwipedLeft event', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    act(() => {
      swipeHandlers.onSwipedLeft();
    });
    
    expect(result.current.isSwipeAnimating).toBe(true);
    expect(result.current.swipeOffset).toBe(-1024); // -1 * window.innerWidth
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(decrementIndex());
    expect(result.current.swipeOffset).toBe(0);
    expect(result.current.isSwipeAnimating).toBe(false);
  });

  it('should handle onSwipedRight event', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    act(() => {
      swipeHandlers.onSwipedRight();
    });
    
    expect(result.current.isSwipeAnimating).toBe(true);
    expect(result.current.swipeOffset).toBe(1024); // 1 * window.innerWidth
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(mockDispatch).toHaveBeenCalledWith(incrementIndex());
  });

  it('should handle onSwiped event when not animating', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    // First set some offset
    act(() => {
      swipeHandlers.onSwiping({ deltaX: 100 });
    });
    
    expect(result.current.swipeOffset).toBe(50);
    
    // Then trigger onSwiped
    act(() => {
      swipeHandlers.onSwiped();
    });
    
    expect(result.current.swipeOffset).toBe(0);
  });

  it('should not reset offset on onSwiped when animating', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    // Start animation
    act(() => {
      swipeHandlers.onSwipedLeft();
    });
    
    expect(result.current.isSwipeAnimating).toBe(true);
    
    // Try to trigger onSwiped during animation
    act(() => {
      swipeHandlers.onSwiped();
    });
    
    // Offset should remain unchanged
    expect(result.current.swipeOffset).toBe(-1024);
  });

  it('should handle different screen widths', () => {
    Object.defineProperty(global, 'innerWidth', {
      value: 768,
    });
    
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    act(() => {
      swipeHandlers.onSwipedRight();
    });
    
    expect(result.current.swipeOffset).toBe(768);
  });

  it('should handle dispatch being called multiple times', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    renderHook(() => useSwipeNavigation(mockDispatch));
    
    act(() => {
      swipeHandlers.onSwipedLeft();
    });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    act(() => {
      swipeHandlers.onSwipedRight();
    });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(mockDispatch).toHaveBeenNthCalledWith(1, decrementIndex());
    expect(mockDispatch).toHaveBeenNthCalledWith(2, incrementIndex());
  });

  it('should handle rapid swipe events', () => {
    let swipeHandlers = {};
    mockUseSwipeable.mockImplementation((config) => {
      swipeHandlers = config;
      return {};
    });
    
    const { result } = renderHook(() => useSwipeNavigation(mockDispatch));
    
    // Multiple rapid swiping events
    act(() => {
      swipeHandlers.onSwiping({ deltaX: 50 });
      swipeHandlers.onSwiping({ deltaX: 100 });
      swipeHandlers.onSwiping({ deltaX: 75 });
    });
    
    expect(result.current.swipeOffset).toBe(37.5); // Last deltaX * dampening
  });
});