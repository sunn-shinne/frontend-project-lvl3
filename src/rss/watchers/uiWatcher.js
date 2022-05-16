import onChange from 'on-change';

const checkLink = (idList) => {
  console.log(idList);
  idList.forEach((id) => {
    const link = document.querySelector(`[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const genirateUiStateWatcher = (uiState) => (
  onChange(uiState, (path, value) => {
    switch (path) {
      case 'checkedPosts':
        checkLink(value);
        break;
      default: break;
    }
  })
);

export default genirateUiStateWatcher;
