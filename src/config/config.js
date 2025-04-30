const config = {
  font: {
    minSize: parseFloat(process.env.REACT_APP_MIN_FONT_SIZE) || 1.4,
    maxSize: parseFloat(process.env.REACT_APP_MAX_FONT_SIZE) || 4.0,
    defaultSize: parseFloat(process.env.REACT_APP_DEFAULT_FONT_SIZE) || 2.4,
    increment: parseFloat(process.env.REACT_APP_FONT_SIZE_INCREMENT) || 0.2,
  },
  app: {
    name: process.env.REACT_APP_APP_NAME,
    apiUrl: process.env.REACT_APP_API_URL,
  },
};

export default config;
