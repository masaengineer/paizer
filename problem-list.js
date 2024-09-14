document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const sortMethod = urlParams.get('sort') || 'wrongCount';

  chrome.storage.sync.get(['problems'], function(result) {
    const problems = result.problems || {};
    displaySortedProblems(problems, sortMethod);
  });
});

function displaySortedProblems(problems, sortMethod) {
  let sortedProblems = Object.entries(problems).sort((a, b) => {
    if (sortMethod === 'wrongCount') {
      return b[1].wrongCount - a[1].wrongCount;
    } else if (sortMethod === 'lastAttempt') {
      return new Date(b[1].lastAttempt) - new Date(a[1].lastAttempt);
    }
  });

  const problemList = document.getElementById('problemList');
  problemList.innerHTML = '';

  for (let [url, problem] of sortedProblems) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${problem.title}</td>
      <td>${problem.wrongCount}</td>
      <td>${problem.correctCount}</td>
      <td>${new Date(problem.lastAttempt).toLocaleString()}</td>
      <td><a href="${url}" target="_blank">問題を開く</a></td>
    `;
    problemList.appendChild(row);
  }
}
