function addButton() {
  const button = document.createElement('button');
  button.textContent = 'Save Data';
  button.style.position = 'fixed';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '9999';

  button.addEventListener('click', () => {
    const data = {
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    chrome.runtime.sendMessage({action: "saveData", data: data}, (response) => {
      console.log(response.status);
    });
  });

  document.body.appendChild(button);
}

addButton();
