import onChange from 'on-change';

const creatContainer = (title) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const inner = `
    <div class="card-body">
      <h2 class="card-title h4">${title}</h2>
      <ul class="list-group border-0 rounded-0"></ul>
    </div>
  `;
  container.innerHTML = inner;
  return container;
};

const initContainers = (feedsData, elements) => {
  const { urls } = feedsData;
  const { feedsBlock, postsBlock } = elements;
  if (urls.length > 0) {
    if (feedsBlock.hasChildNodes()) {
      const feedsContainer = creatContainer('Фиды');
      feedsBlock.replaceChildren(feedsContainer);
    }
    if (postsBlock.hasChildNodes()) {
      const postsContainer = creatContainer('Посты');
      postsBlock.replaceChildren(postsContainer);
    }
  } else {
    feedsBlock.innerHTML = '';
    postsBlock.innerHTML = '';
  }
};

const renderFeeds = (feedsData, elements) => {
  const { feeds } = feedsData;
  const { feedsBlock } = elements;
  const container = feedsBlock.querySelector('div');

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
  ul.replaceChildren(...liItems);
  container.append(ul);
};

const onClickLink = (id, watchedFeedsState) => (e) => {
  e.preventDefault();
  watchedFeedsState.checkedPostsId.push(id);
  e.target.classList.add('fw-normal', 'link-secondary');
  e.target.classList.remove('fw-bold');
  window.open(e.target.href, '_blank');
};

const createPostItem = (feedsData) => (post) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

  const a = document.createElement('a');
  a.classList.add('fw-bold');
  a.setAttribute('href', post.link);
  a.setAttribute('data-id', post.id);
  a.setAttribute('data-bs-toggle', 'modal');
  a.setAttribute('data-bs-target', 'modal');
  a.checked = feedsData.checkedPostsId.includes(post.id);
  a.textContent = post.title;
  a.addEventListener('click', onClickLink(post.id, feedsData));

  const button = document.createElement('button');
  button.setAttribute('fw-normal', 'link-secondary');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = 'Просмотр';

  li.append(a, button);
  return li;
};

const renderPosts = (feedsData, elements) => {
  const { posts } = feedsData;
  const { postsBlock } = elements;
  const container = postsBlock.querySelector('div');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  const lis = posts.map(createPostItem(feedsData));
  ul.replaceChildren(...lis);
  container.append(ul);
};

const genirateFeedsWatcher = (feedsData, elements) => (
  onChange(feedsData, (path) => {
    switch (path) {
      case 'feeds':
      case 'posts':
        initContainers(feedsData, elements);
        renderPosts(feedsData, elements);
        renderFeeds(feedsData, elements);
        break;
      case 'checkedPostsId':
        break;
      default: break;
    }
  })
);

export default genirateFeedsWatcher;
