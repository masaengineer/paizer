chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveData") {
    // ここでデータベースへの保存処理を実装
    // 例:
    chrome.storage.local.set({key: request.data}, () => {
      console.log('Data saved');
    });
    console.log("Data to be saved:", request.data);
    sendResponse({status: "Data saved successfully"});
  }
});
