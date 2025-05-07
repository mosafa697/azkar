const config = {
  font: {
    minScale: parseFloat(process.env.REACT_APP_MIN_FONT_SCALE) || 1.4,
    maxScale: parseFloat(process.env.REACT_APP_MAX_FONT_SCALE) || 4.0,
    defaultScale: parseFloat(process.env.REACT_APP_DEFAULT_FONT_SCALE) || 2.8,
    scaleIncrement: parseFloat(process.env.REACT_APP_FONT_SCALE_INCREMENT) || 0.2,
  },
  app: {
    name: process.env.REACT_APP_APP_NAME,
    apiUrl: process.env.REACT_APP_API_URL,
  },
};

export default config;
