import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import app from './init.js';
import i18nextCreateInstance from '../lib/i18next.js';

const runApp = async () => {
  const i18n = await i18nextCreateInstance();
  app(i18n);
};

runApp();
