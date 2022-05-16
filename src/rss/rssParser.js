import _ from 'lodash';

export default (contentStr) => {
  const xml = new window.DOMParser();
  const contentDom = xml.parseFromString(contentStr, 'text/xml');

  const feedTitle = contentDom.querySelector('title').textContent;
  const feedDescription = contentDom.querySelector('description').textContent;
  const feedId = _.uniqueId();
  const feed = {
    id: feedId,
    title: feedTitle,
    description: feedDescription,
  };

  const items = contentDom.querySelectorAll('item');
  const posts = [...items].map((item) => ({
    id: _.uniqueId(),
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
    feedId,
  }));

  return { feed, posts };
};
