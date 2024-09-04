console.log('Content script loaded');

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  addButtons();
});


function addButtons() {
  try {
    console.log('Adding buttons');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'paiza-tracker-buttons';

    const wrongButton = createButton('間違えた', 'btn-danger', recordWrong);
    const correctButton = createButton('正解した', 'btn-success', recordCorrect);

    buttonContainer.appendChild(wrongButton);
    buttonContainer.appendChild(correctButton);

    // ボタンを配置する適切な場所を特定し、追加する
    const targetElement = document.querySelector('.d-challenges-ready__box__section-txt3');
    if (targetElement) {
      targetElement.appendChild(buttonContainer);
      console.log('Buttons added');
    }
  } catch (error) {
    console.error('Error in addButtons:', error);
  }
}

function createButton(text, className, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = `btn ${className} mr-2`;
  button.addEventListener('click', onClick);
  return button;
}

function recordWrong() {
  saveRecord(true);
}

function recordCorrect() {
  saveRecord(false);
}

function saveRecord(isWrong) {
  const problemTitle = document.querySelector('.problem-title').textContent;
  const problemUrl = window.location.href;

  const record = {
    date: new Date().toISOString(),
    isWrong: isWrong,
    title: problemTitle,
    url: problemUrl,
  };

  chrome.runtime.sendMessage({ action: 'saveRecord', record: record });
}
