let problems = {};

document.addEventListener('DOMContentLoaded', function() {
  loadProblems();

  document.getElementById('sortSelect').addEventListener('change', function() {
    sortAndDisplayProblems();
  });

  document.getElementById('listViewButton').addEventListener('click', function() {
    openListView();
  });
});

function loadProblems() {
  chrome.storage.sync.get(['problems'], function(result) {
    problems = result.problems || {};
    sortAndDisplayProblems();
  });
}

function sortAndDisplayProblems() {
  const sortMethod = document.getElementById('sortSelect').value;
  let sortedProblems = Object.entries(problems).sort((a, b) => {
    if (sortMethod === 'wrongCount') {
      return b[1].wrongCount - a[1].wrongCount;
    } else if (sortMethod === 'lastAttempt') {
      return new Date(b[1].lastAttempt) - new Date(a[1].lastAttempt);
    }
  });

  const recordsList = document.getElementById('recordsList');
  recordsList.innerHTML = '';

  for (let [url, problem] of sortedProblems) {
    const listItem = document.createElement('div');
    listItem.className = 'record-item';
    listItem.innerHTML = `
      <h3>${problem.title}</h3>
      <p>間違えた回数: ${problem.wrongCount}回</p>
      <p>正解した回数: ${problem.correctCount}回</p>
      <p>最後の挑戦: ${new Date(problem.lastAttempt).toLocaleString()}</p>
      <a href="${url}" target="_blank">問題を開く</a>
      <button class="reset-button" data-url="${url}">リセット</button>
    `;
    recordsList.appendChild(listItem);
  }

  // リセットボタンにイベントリスナーを追加
  document.querySelectorAll('.reset-button').forEach(button => {
    button.addEventListener('click', function() {
      resetProblem(this.getAttribute('data-url'));
    });
  });
}

function resetProblem(url) {
  chrome.runtime.sendMessage({action: "resetProblem", url: url}, function(response) {
    if (response.success) {
      problems[url].wrongCount = 0;
      problems[url].correctCount = 0;
      sortAndDisplayProblems();
    } else {
      console.error('Failed to reset problem:', response.error);
    }
  });
}

function openListView() {
  const sortMethod = document.getElementById('sortSelect').value;
  const listViewUrl = chrome.runtime.getURL('problem-list.html') + `?sort=${sortMethod}`;
  chrome.tabs.create({ url: listViewUrl });
}
