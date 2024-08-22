// content.js
console.log('Content script loaded');

function addButton() {
  console.log('addButton function called');

  const button = document.createElement('button');
  button.textContent = 'Save Data';
  button.style.marginLeft = '10px';
  button.style.padding = '5px 10px';
  button.style.fontSize = '14px';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.verticalAlign = 'middle';
  button.style.display = 'inline-block'; // インライン表示を確保

  button.addEventListener('click', () => {
    console.log('Button clicked');
    const data = {
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    chrome.runtime.sendMessage({action: "saveData", data: data}, (response) => {
      console.log(response.status);
    });
  });

  // 特定のクラスを持つh1要素を探す
  const targetHeading = document.querySelector('h1.d-challenges-ready__title-style');
  console.log('Target heading:', targetHeading);

  if (targetHeading) {
    // インライン表示を確保するためのスタイル調整
    targetHeading.style.display = 'flex';
    targetHeading.style.alignItems = 'center';
    targetHeading.style.flexWrap = 'wrap';

    // spanの後にボタンを挿入
    const spanElement = targetHeading.querySelector('span');
    if (spanElement) {
      spanElement.insertAdjacentElement('afterend', button);
      console.log('Button added after the span element');
    } else {
      // spanが見つからない場合はh1の中の最後に追加
      targetHeading.appendChild(button);
      console.log('Button added to the end of h1');
    }
  } else {
    console.log('Target heading not found');
  }
}

// DOMContentLoadedイベントでボタンを追加
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  addButton();
});

// 念のため、loadイベントでも試す
window.addEventListener('load', () => {
  console.log('Window load event fired');
  addButton();
});
