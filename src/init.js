import rssForm from './rssForm/rssForm.js';

export default () => {
  const state = {
    formState: {
      isValid: true,
      errors: [],
      rssUrl: '',
      processState: null,
    },
    feeds: [],
  };

  rssForm(state);
};
