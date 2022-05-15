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
  const feedsRoot = document.querySelector('.feeds');
  const postsRoot = document.querySelector('.posts');
  const elements = {
    rssInput,
    feedback,
    form,
    submitBtn,
    feedsRoot,
    postsRoot,
  };

  const formState = genirateFormWatcher(state.formState, elements, i18n);
  const feedsState = genirateFeedsWatcher(state.feedsData, elements, i18n);

  rssInput.addEventListener('change', (e) => {
    formState.processState = 'filling';
    formState.inputValue = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formState.processState = 'sending';
    const url = formState.inputValue;
    const schema = createRssSchema(feedsState.urls);

    schema.validate(url)
      .catch((res) => {
        const errorMessage = i18n.t(res.errors.map((err) => i18n.t(err.key)));
        formState.isValid = false;
        throw new Error(errorMessage);
      })
      .then(() => {
        formState.isValid = true;
        return downloadRssStream(url, i18n);
      })
      .then((data) => {
        feedsState.urls.push(url);
        feedsState.feeds.push(data.feed);
        feedsState.posts = [...feedsState.posts, ...data.posts];
        formState.errors = [];
        formState.processState = 'success';
        formState.inputValue = '';
      })
      .catch((error) => {
        formState.errors = error.message;
        formState.processState = 'failed';
      });
  });

  rssInput.value = '';
  rssInput.focus();
};
