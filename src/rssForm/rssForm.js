import axios from 'axios';
import { string, setLocale } from 'yup';
import genirateFormWatcher from './formView.js';
import genirateFeedsWatcher from './feedsView.js';
import parseRss from '../utilites/rssParser.js';

setLocale({
  mixed: {
    notOneOf: () => ({ key: 'rss_form.error_messages.already_exists' }),
    required: () => ({ key: 'rss_form.error_messages.field_required' }),
  },
  string: {
    url: () => ({ key: 'rss_form.error_messages.not_valid_url' }),
  },
});

const createRssSchema = (arr) => string().url().notOneOf(arr).required();

const downloadRssStream = (url, i18n) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .catch(() => { throw new Error(i18n.t('rss_form.error_messages.network_error')); })
  .then((response) => parseRss(response.data.contents))
  .catch(() => { throw new Error(i18n.t('rss_form.error_messages.not_contain_valid_rss')); });

export default (state, i18n) => {
  const rssInput = document.querySelector('#rss-input');
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const submitBtn = document.querySelector('form button');
  const feedsBlock = document.querySelector('.feeds');
  const postsBlock = document.querySelector('.posts');
  const elements = {
    rssInput,
    feedback,
    form,
    submitBtn,
    feedsBlock,
    postsBlock,
  };

  const watchedFormState = genirateFormWatcher(state.formState, elements, i18n);
  const watchedFeedsState = genirateFeedsWatcher(state.feedsData, elements, i18n);

  rssInput.addEventListener('change', (e) => {
    watchedFormState.processState = 'filling';
    watchedFormState.inputValue = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedFormState.processState = 'sending';
    const url = watchedFormState.inputValue;
    const schema = createRssSchema(watchedFeedsState.urls);

    schema.validate(url)
      .catch((res) => {
        const errorMessage = i18n.t(res.errors.map((err) => i18n.t(err.key)));
        watchedFormState.isValid = false;
        throw new Error(errorMessage);
      })
      .then(() => {
        watchedFormState.isValid = true;
        return downloadRssStream(url, i18n);
      })
      .then((data) => {
        watchedFeedsState.urls.push(url);
        watchedFeedsState.feeds.push(data.feed);
        watchedFeedsState.posts = [...watchedFeedsState.posts, ...data.posts];
        watchedFormState.errors = [];
        watchedFormState.processState = 'success';
      })
      .catch((error) => {
        watchedFormState.errors = error.message;
        watchedFormState.processState = 'failed';
      });
  });

  rssInput.value = '';
  rssInput.focus();
};
