import onChange from 'on-change';

const initContainer = (root, title) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const inner = `<div class="card-body">
      <h2 class="card-title h4">${title}</h2>
      <ul class="list-group border-0 rounded-0"></ul>
    </div>
  `;
  container.innerHTML = inner;
  root.replaceChildren(container);
  return container;
};

const renderFeeds = (feeds, elements) => {
  const { feedsRoot } = elements;

  const container = initContainer(feedsRoot, 'Фиды');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  const liItems = feeds.map((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const inner = `
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    `;
    li.innerHTML = inner;
    return li;
  });

  ul.append(...liItems);
  container.append(ul);
};

const createPostItem = (post, checkedPosts, i18n) => {
  const {
    id,
    link,
    title,
    description,
  } = post;

  const a = document.createElement('a');
  const linkClass = checkedPosts.includes(id) ? ['fw-normal', 'link-secondary'] : ['fw-bold'];
  a.classList.add(...linkClass);
  a.setAttribute('href', link);
  a.setAttribute('data-id', id);
  a.textContent = title;
  a.setAttribute('target', '_blank');
  a.addEventListener('click', () => checkedPosts.push(id));

  const button = document.createElement('button');
  button.setAttribute('fw-normal', 'link-secondary');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = i18n.t('post_button');
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#postModal';
  button.dataset.bsTitle = title;
  button.dataset.bsDescription = description;
  button.dataset.bsLink = link;
  button.dataset.bsId = id;

  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  li.append(a, button);
  return li;
};

const renderPosts = (posts, checkedLinks, elements, i18n) => {
  const { postsRoot } = elements;

  if (posts.length === 0) {
    postsRoot.innerHTML = '';
    return;
  }

  const container = initContainer(postsRoot, 'Посты');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const items = posts.map((post) => createPostItem(post, checkedLinks, i18n));
  ul.replaceChildren(...items);
  container.append(ul);
};

const genirateFeedsWatcher = (feedsData, uiState, elements, i18n) => (
  onChange(feedsData, (path, value) => {
    switch (path) {
      case 'feeds':
        renderFeeds(value, elements);
        break;
      case 'posts':
        renderPosts(value, uiState.checkedPosts, elements, i18n);
        break;
      default: break;
    }
  })
);

export default genirateFeedsWatcher;
