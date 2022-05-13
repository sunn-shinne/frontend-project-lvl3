import i18next from 'i18next';
import ru from '../locales/ru.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  await i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });
  return i18nextInstance;
};
