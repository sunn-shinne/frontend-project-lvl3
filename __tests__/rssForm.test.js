import {
  test,
  expect,
  beforeEach,
  beforeAll,
} from '@jest/globals';
import '@testing-library/jest-dom';
import testingLibrary from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nock from 'nock';
import init from '../src/rss/init.js';
import i18nextCreateInstance from '../lib/i18next.js';

const { screen, waitFor } = testingLibrary;
const user = userEvent.setup();
const i18nextInstance = await i18nextCreateInstance();

nock.disableNetConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let elements;
let rssData;

beforeAll(() => {
  const pathToRssData = path.join(__dirname, '..', '__fixtures__', 'rssDataExample.xml');
  rssData = fs.readFileSync(pathToRssData).toString();

  nock('https://allorigins.hexlet.app')
    .get('/get')
    .query({
      url: 'https://example.com/news',
      disableCache: true,
    })
    .reply(404, 'Not Found');

  nock('https://allorigins.hexlet.app')
    .get('/get')
    .query({
      url: 'https://lorem-rss.herokuapp.com/feed',
      disableCache: true,
    })
    .reply(200, { contents: rssData });
});

beforeEach(() => {
  const pathToRssData = path.join(__dirname, '..', '__fixtures__', 'rssDataExample.xml');
  rssData = fs.readFileSync(pathToRssData).toString();

  const pathToHtml = path.join(__dirname, '..', '__fixtures__', 'index.html');
  const initHtml = fs.readFileSync(pathToHtml).toString();
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
  expect(screen.queryByText('Ссылка должна быть валидным URL')).not.toBeInTheDocument();
  expect(screen.queryByText('RSS уже существует')).not.toBeInTheDocument();
  expect(screen.queryByText('Ресурс не содержит валидный RSS')).not.toBeInTheDocument();
  expect(screen.queryByText('Не должно быть пустым')).not.toBeInTheDocument();
  expect(screen.queryByText('RSS успешно загружен')).not.toBeInTheDocument();
});

test('rss form validation', async () => {
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.submitBtn).toBeEnabled();
    expect(elements.rssInput).toHaveValue('');
    expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
    expect(elements.feedbackContainer).toHaveTextContent('Не должно быть пустым');
    expect(elements.feedbackContainer).toHaveClass('text-danger');
  });

  await user.type(elements.rssInput, 'Petya');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.submitBtn).toBeEnabled();
    expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
    expect(elements.feedbackContainer).toHaveTextContent('Ссылка должна быть валидным URL');
    expect(elements.feedbackContainer).toHaveClass('text-danger');
    expect(elements.rssInput).toHaveValue('Petya');
  });

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://example.com/news');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.submitBtn).toBeEnabled();
    expect(elements.rssInput).toHaveValue('https://example.com/news');
    expect(elements.rssInput).not.toHaveClass('border', 'border-danger', 'is-invalid');
    expect(elements.feedbackContainer).toHaveTextContent('Ресурс не содержит валидный RSS');
    expect(elements.feedbackContainer).toHaveClass('text-danger');
  });

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://lorem-rss.herokuapp.com/feed');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.submitBtn).toBeEnabled();
    expect(elements.rssInput).toHaveValue('');
    expect(elements.rssInput).toHaveFocus();
    expect(elements.rssInput).not.toHaveClass('border', 'border-danger', 'is-invalid');
    expect(elements.feedbackContainer).toHaveTextContent('RSS успешно загружен');
    expect(elements.feedbackContainer).not.toHaveClass('text-danger');
  });

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://lorem-rss.herokuapp.com/feed');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.submitBtn).toBeEnabled();
    expect(elements.rssInput).toHaveValue('https://lorem-rss.herokuapp.com/feed');
    expect(elements.rssInput).toHaveClass('border', 'border-danger', 'is-invalid');
    expect(elements.feedbackContainer).toHaveTextContent('RSS уже существует');
    expect(elements.feedbackContainer).toHaveClass('text-danger');
  });
});
