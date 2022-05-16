import app from './app.js';

export default (i18n) => {
  const state = {
    formState: {
      isValid: true,
      errors: [],
      inputValue: '',
      processState: null,
    },
    feedsData: {
      urls: [],
      feeds: [],
      posts: [],
    },
  };

  app(state, i18n);
};
