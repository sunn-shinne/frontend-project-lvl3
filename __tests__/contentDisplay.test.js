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
    feeds: screen.getByTestId('feeds'),
    posts: screen.getByTestId('posts'),
  };
});

test('state without any content', async () => {
  expect(elements.feeds).toBeEmptyDOMElement();
  expect(elements.posts).toBeEmptyDOMElement();
});

test('dysplay content on requests', async () => {
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.feeds).toBeEmptyDOMElement();
    expect(elements.posts).toBeEmptyDOMElement();
  });

  await user.type(elements.rssInput, 'Petya');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.feeds).toBeEmptyDOMElement();
    expect(elements.posts).toBeEmptyDOMElement();
  });

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://example.com/news');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.feeds).toBeEmptyDOMElement();
    expect(elements.posts).toBeEmptyDOMElement();
  });

  await user.clear(elements.rssInput);
  await user.type(elements.rssInput, 'https://lorem-rss.herokuapp.com/feed');
  await user.click(elements.submitBtn);

  await waitFor(() => {
    expect(elements.feeds).toHaveTextContent('Фиды');
    expect(elements.feeds).toContainHTML('<ul class="list-group border-0 rounded-0"/>');
    expect(elements.posts).toHaveTextContent('Посты');
    expect(elements.posts).toContainHTML('<ul class="list-group border-0 rounded-0"/>');
  });
});
