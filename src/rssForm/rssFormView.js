import onChange from 'on-change';

const handleProcess = (processState, errors, elements) => {
  const { rssInput, feedback, submitBtn } = elements;
  switch (processState) {
    case 'filling':
      break;
    case 'sending':
      submitBtn.disabled = true;
      break;
    case 'success':
      submitBtn.disabled = false;
      feedback.textContent = 'RSS успешно загружен';
      rssInput.value = '';
      rssInput.focus();
      break;
    case 'failed':
      submitBtn.disabled = false;
      feedback.textContent = errors;
      break;
    default:
      throw new Error('unexpected process state');
  }
};

const handleIsValid = (isValid, elements) => {
  const { rssInput, feedback } = elements;
  if (isValid) {
    rssInput.classList.remove('border', 'border-danger', 'is-invalid');
    feedback.classList.remove('text-danger');
  } else {
    rssInput.classList.add('border', 'border-danger', 'is-invalid');
    feedback.classList.add('text-danger');
  }
};

const genirateFormView = (formState, elements) => (
  onChange(formState, (path, value) => {
    switch (path) {
      case 'processState':
        handleProcess(value, formState.errors, elements);
        break;
      case 'isValid':
        handleIsValid(value, elements);
        break;
      default: break;
    }
  })
);

export default genirateFormView;
