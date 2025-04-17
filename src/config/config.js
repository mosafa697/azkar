const config = {
  font: {
    minSize: parseInt(process.env.REACT_APP_MIN_FONT_SIZE, 10),
    maxSize: parseInt(process.env.REACT_APP_MAX_FONT_SIZE, 10),
    defaultSize: parseInt(process.env.REACT_APP_DEFAULT_FONT_SIZE, 10),
    increment: parseInt(process.env.REACT_APP_FONT_SIZE_INCREMENT, 10),
  },
  app: {
    name: process.env.REACT_APP_APP_NAME,
    apiUrl: process.env.REACT_APP_API_URL,
  },
};

export default config;
