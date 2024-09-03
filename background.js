chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveRecord") {
    saveRecord(request.record);
  }
});

function saveRecord(record) {
  chrome.storage.sync.get('records', (data) => {
    const records = data.records || [];
    records.push(record);
    chrome.storage.sync.set({records: records}, () => {
      console.log('Record saved');
    });
  });
}
