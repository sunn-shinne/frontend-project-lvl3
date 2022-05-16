import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import init from './rss/init.js';
import i18nextCreateInstance from '../lib/i18next.js';

const runApp = async () => {
  const i18n = await i18nextCreateInstance();
  init(i18n);
};

runApp();
