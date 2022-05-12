import { string } from 'yup';
import genirateFormView from './rssFormView.js';

const createRssSchema = (arr) => string()
  .url('Ссылка должна быть валидным URL')
  .notOneOf(arr, 'RSS уже существует')
  .required('Это обязательное поле');

const validate = (value, schema) => schema.validate(value);

export default ({ formState, feeds }) => {
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

  const watchedFormState = genirateFormView(formState, elements);

  rssInput.addEventListener('change', (e) => {
    watchedFormState.processState = 'filling';
    watchedFormState.rssUrl = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedFormState.processState = 'sending';
    validate(watchedFormState.rssUrl, createRssSchema(feeds))
      .then(() => {
        feeds.push(formState.rssUrl);
        watchedFormState.errors = [];
        watchedFormState.isValid = true;
        watchedFormState.processState = 'success';
      })
      .catch((data) => {
        watchedFormState.errors = data.errors;
        watchedFormState.isValid = false;
        watchedFormState.processState = 'failed';
      });
  });

  rssInput.value = '';
  rssInput.focus();
};
