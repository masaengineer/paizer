// データを保存する関数
function saveRecord(record) {
  chrome.storage.sync.get(['problems'], function(result) {
    let problems = result.problems || {};
    if (!problems[record.url]) {
      problems[record.url] = {
        title: record.title,
        wrongCount: 0,
        correctCount: 0,
        lastAttempt: null
      };
    }

    if (record.isWrong) {
      problems[record.url].wrongCount++;
    } else {
      problems[record.url].correctCount++;
    }
    problems[record.url].lastAttempt = record.date;

    chrome.storage.sync.set({problems: problems}, function() {
      console.log('Record saved');
    });
  });
}

// 問題をリセットする関数
function resetProblem(url, callback) {
  chrome.storage.sync.get(['problems'], function(result) {
    let problems = result.problems || {};
    if (problems[url]) {
      problems[url].wrongCount = 0;
      problems[url].correctCount = 0;
      chrome.storage.sync.set({problems: problems}, function() {
        console.log('Problem reset');
        callback({success: true});
      });
    } else {
      callback({success: false, error: 'Problem not found'});
    }
  });
}

// メッセージリスナー
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "saveRecord") {
    saveRecord(request.record);
  } else if (request.action === "resetProblem") {
    resetProblem(request.url, sendResponse);
    return true;  // 非同期レスポンスを示すために true を返す
  }
});
