import rssForm from './rssForm/rssForm.js';

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

  rssForm(state, i18n);
};
