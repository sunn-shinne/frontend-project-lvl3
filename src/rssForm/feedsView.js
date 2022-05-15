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

  if (feeds.length === 0) {
    feedsRoot.innerHTML = '';
    return;
  }

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

const createPostItem = (post) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = document.createElement('a');
  a.checked = post.checked;
  a.classList.add('fw-bold');
  // a.classList.add('fw-normal', 'link-secondary');

  a.setAttribute('href', post.link);
  a.setAttribute('data-id', post.id);
  a.setAttribute('data-bs-toggle', 'modal');
  a.setAttribute('data-bs-target', 'modal');
  a.textContent = post.title;

  const button = document.createElement('button');
  button.setAttribute('fw-normal', 'link-secondary');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = 'Просмотр';

  li.append(a, button);
  return li;
};

const renderPosts = (posts, elements) => {
  const { postsRoot } = elements;

  if (posts.length === 0) {
    postsRoot.innerHTML = '';
    return;
  }

  const container = initContainer(postsRoot, 'Посты');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const items = posts.map(createPostItem);
  ul.replaceChildren(...items);
  container.append(ul);
};

const genirateFeedsWatcher = (feedsData, elements) => (
  onChange(feedsData, (path, value) => {
    switch (path) {
      case 'feeds':
        renderFeeds(value, elements);
        break;
      case 'posts':
        renderPosts(value, elements);
        break;
      default: break;
    }
  })
);

export default genirateFeedsWatcher;
