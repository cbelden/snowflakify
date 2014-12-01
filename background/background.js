(function(chrome) {
    chrome.browserAction.onClicked.addListener(toggleFlakes);

    function toggleFlakes(tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle-flakes'});
        });
    }
})(chrome);
