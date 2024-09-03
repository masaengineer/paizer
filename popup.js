document.addEventListener('DOMContentLoaded', () => {
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', displayRecords);
  displayRecords();
});

function displayRecords() {
  chrome.storage.sync.get('records', (data) => {
    const records = data.records || [];
    const sortedRecords = sortRecords(records);
    const recordsList = document.getElementById('recordsList');
    recordsList.innerHTML = '';

    sortedRecords.forEach(record => {
      const recordElement = createRecordElement(record);
      recordsList.appendChild(recordElement);
    });
  });
}

function sortRecords(records) {
  const sortMethod = document.getElementById('sortSelect').value;
  if (sortMethod === 'wrongCount') {
    return records.sort((a, b) => getWrongCount(b) - getWrongCount(a));
  } else {
    return records.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

function getWrongCount(record) {
  return record.isWrong ? 1 : 0;
}

function createRecordElement(record) {
  const div = document.createElement('div');
  div.className = 'card mb-2';
  div.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">
        <a href="${record.url}" target="_blank">${record.title}</a>
      </h5>
      <p class="card-text">
        状態: ${record.isWrong ? '間違えた' : '正解した'}<br>
        日時: ${new Date(record.date).toLocaleString()}
      </p>
    </div>
  `;
  return div;
}
