console.log('Content script loaded');

// DOMContentLoadedイベントの処理を少し遅らせる
setTimeout(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButtons);
  } else {
    addButtons();
  }
}, 1000);

function addButtons() {
  console.log('Adding buttons');

  // ターゲット要素を探す
  const targetElement = document.querySelector('a.ch_button.green[href*="/works/challenges/"]');
  console.log('Target element:', targetElement);

  if (targetElement) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'paiza-tracker-buttons';
    buttonContainer.style.cssText = `
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
      gap: 10px;
    `;

    const wrongButton = createButton('間違えた', 'btn-danger', () => recordAnswer(true));
    const correctButton = createButton('正解した', 'btn-success', () => recordAnswer(false));

    buttonContainer.appendChild(wrongButton);
    buttonContainer.appendChild(correctButton);

    // ターゲット要素の後ろにボタンコンテナを挿入
    targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
    console.log('Buttons added successfully');
  } else {
    console.error('Failed to add buttons: Target element not found');

    // ページの変更を監視
    observePageChanges();
  }
}

function createButton(text, className, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = `btn ${className} mr-2`;
  button.addEventListener('click', onClick);
  return button;
}

function recordAnswer(isWrong) {
  saveRecord(isWrong);
  showFlashMessage(isWrong ? '間違えた問題として記録しました' : '正解した問題として記録しました');
}

function saveRecord(isWrong) {
  const problemTitle = document.querySelector('h1.ttlStyle1a > span')?.textContent || 'Unknown Problem';
  const problemUrl = window.location.href;

  const record = {
    date: new Date().toISOString(),
    isWrong: isWrong,
    title: problemTitle,
    url: problemUrl
  };

  chrome.runtime.sendMessage({action: "saveRecord", record: record});
}

function showFlashMessage(message) {
  const flashMessage = document.createElement('div');
  flashMessage.textContent = message;
  flashMessage.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 4px;
    z-index: 1000;
  `;

  document.body.appendChild(flashMessage);

  setTimeout(() => {
    flashMessage.style.opacity = '0';
    flashMessage.style.transition = 'opacity 0.5s';
    setTimeout(() => flashMessage.remove(), 500);
  }, 3000);
}

function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        for (let node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const targetElement = node.querySelector('a.ch_button.green[href="/works/challenges/*"]');
            if (targetElement) {
              console.log('Target element found after page change');
              observer.disconnect();
              addButtons();
              return;
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('Page observer started');
}
