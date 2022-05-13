import { string, setLocale } from 'yup';
import genirateFormView from './rssFormView.js';

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

const validate = (value, schema) => schema.validate(value);

export default ({ formState, feeds }, i18n) => {
  const rssInput = document.querySelector('#rss-input');
  const feedback = document.querySelector('.feedback');
  const form = document.querySelector('.rss-form');
  const submitBtn = document.querySelector('form button');
  const elements = {
    rssInput,
    feedback,
    form,
    submitBtn,
  };

  const watchedFormState = genirateFormView(formState, elements, i18n);

  rssInput.addEventListener('change', (e) => {
    watchedFormState.processState = 'filling';
    watchedFormState.rssUrl = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedFormState.processState = 'sending';
    const schema = createRssSchema(feeds);

    validate(watchedFormState.rssUrl, schema)
      .then(() => {
        feeds.push(formState.rssUrl);
        watchedFormState.errors = [];
        watchedFormState.isValid = true;
        watchedFormState.processState = 'success';
      })
      .catch((res) => {
        watchedFormState.errors = res.errors.map((err) => i18n.t(err.key));
        watchedFormState.isValid = false;
        watchedFormState.processState = 'failed';
      });
  });

  rssInput.value = '';
  rssInput.focus();
};
