import { test, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';
import testingLibrary from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import init from '../src/init.js';
import i18nextCreateInstance from '../lib/i18next.js';

const { screen, waitFor } = testingLibrary;
const user = userEvent.setup();
const i18nextInstance = await i18nextCreateInstance();

nock.disableNetConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let elements;

beforeEach(() => {
  const pathToFixture = path.join(__dirname, '..', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToFixture).toString();
  document.body.innerHTML = initHtml;
  init(i18nextInstance);

  elements = {
    submitBtn: screen.getByText(/Добавить/),
    rssInput: screen.getByLabelText(/Ссылка RSS/),
    feedbackContainer: screen.getByTestId('feedback'),
  };
});

test('fresh rss form', async () => {
  expect(elements.submitBtn).toBeEnabled();
  expect(elements.rssInput).not.toHaveValue();
  expect(elements.rssInput).toHaveFocus();
  expect(elements.rssInput).not.toHaveClass('border', 'border-danger', 'is-invalid');
  expect(elements.feedbackContainer).not.toHaveTextContent();
  expect(elements.feedbackContainer).not.toHaveClass('text-danger');
});

test('validation works', async () => {
  expect(screen.queryByText('Ссылка должна быть валидным URL')).not.toBeInTheDocument();
  expect(screen.queryByText('RSS уже существует')).not.toBeInTheDocument();
  expect(screen.queryByText('Это обязательное поле')).not.toBeInTheDocument();

  await user.click(elements.submitBtn);

  expect(elements.submitBtn).toBeEnabled();
  expect(elements.rssInput).toHaveValue('');
  expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
  expect(elements.feedbackContainer).toHaveTextContent('Это обязательное поле');
  expect(elements.feedbackContainer).toHaveClass('text-danger');

  await user.type(elements.rssInput, 'Petya');
  console.log(elements.rssInput.value);
  await user.click(elements.submitBtn);

  expect(elements.submitBtn).toBeEnabled();
  expect(elements.rssInput).toHaveValue('Petya');
  expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
  expect(elements.feedbackContainer).toHaveTextContent('Ссылка должна быть валидным URL');
  expect(elements.feedbackContainer).toHaveClass('text-danger');

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://github.com/news.rss');
  await user.click(elements.submitBtn);

  expect(elements.submitBtn).toBeEnabled();
  expect(elements.rssInput).toHaveValue('');
  expect(elements.rssInput).toHaveFocus();
  expect(elements.rssInput).not.toHaveClass('border', 'border-danger', 'is-invalid');
  expect(elements.feedbackContainer).toHaveTextContent('RSS успешно загружен');
  expect(elements.feedbackContainer).not.toHaveClass('text-danger');

  await user.type(elements.rssInput, 'https://github.com/news.rss');
  await user.click(elements.submitBtn);

  expect(elements.submitBtn).toBeEnabled();
  expect(elements.rssInput).toHaveValue('https://github.com/news.rss');
  expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
  expect(elements.feedbackContainer).toHaveTextContent('RSS уже существует');
  expect(elements.feedbackContainer).toHaveClass('text-danger');

  await waitFor(() => {

  });
});
