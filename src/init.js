import rssForm from './rssForm/rssForm.js';

export default (i18n) => {
  const state = {
    formState: {
      isValid: true,
      errors: [],
      rssUrl: '',
      processState: null,
    },
    feeds: [],
  };

  rssForm(state, i18n);
};
