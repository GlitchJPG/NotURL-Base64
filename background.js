doneSound = new Audio();
doneSound.src = "done.wav";

// Function from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}

var idInt = 0;
chrome.browserAction.onClicked.addListener(function(tab) {
    idInt++;
    var data = b64EncodeUnicode(tab.url);
    var stringId = "notification" + idInt;
    chrome.notifications.create(
      stringId,
      {
        type: "basic",
        title: "NotURL Created!",
        message: "You can use your clipboard to paste the NotURL.",
        iconUrl: "checkmark.png",
      }
    );
    doneSound.play();
    var urlBox = document.createElement('input');
    urlBox.type = "text";
    urlBox.value = "?" + data + "?";
    document.body.appendChild(urlBox);
    urlBox.select();
    document.execCommand('copy', false, null);
});


chrome.tabs.onUpdated.addListener(function(tabId){
  chrome.tabs.executeScript(tabId, {
      file: "NotURLify.js",
      runAt: "document_end"
  });
});
