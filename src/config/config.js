const config = {
  font: {
    minScale: parseFloat(process.env.REACT_APP_MIN_FONT_SCALE) || 1.4,
    maxScale: parseFloat(process.env.REACT_APP_MAX_FONT_SCALE) || 4.0,
    defaultScale: parseFloat(process.env.REACT_APP_DEFAULT_FONT_SCALE) || 2.8,
    scaleIncrement: parseFloat(process.env.REACT_APP_FONT_SCALE_INCREMENT) || 0.2,
  },
  interaction: {
    counterGuardMs: parseInt(process.env.REACT_APP_COUNTER_GUARD_MS, 10) || 250,
    navButtonGuardMs:
      parseInt(process.env.REACT_APP_NAV_BUTTON_GUARD_MS, 10) || 250,
    freeTasbihTapGuardMs:
      parseInt(process.env.REACT_APP_FREE_TASBIH_TAP_GUARD_MS, 10) || 120,
    freeTasbihAnimationMs:
      parseInt(process.env.REACT_APP_FREE_TASBIH_ANIMATION_MS, 10) || 160,
    longPressMs: parseInt(process.env.REACT_APP_LONG_PRESS_MS, 10) || 600,
  },
  app: {
    name: process.env.REACT_APP_APP_NAME,
    apiUrl: process.env.REACT_APP_API_URL,
  },
};

export default config;
