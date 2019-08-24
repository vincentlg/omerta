'use strict';

chrome.runtime.onInstalled.addListener(function() {

  // chrome.browserAction.onClicked.addListener(function (tab) {
  //   console.log("ici");
  //   chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
  // });

  // chrome.browserAction.onClicked.addListener(function(tab) {
  //   // for the current tab, inject the "inject.js" file & execute it
  //   chrome.tabs.executeScript(tab.ib, {
  //     file: 'inject.js'
  //   });
  //
  // });
  chrome.storage.sync.set({
    color: '#3aa757'
  }, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          urlContains: 'com'
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    console.log("send Message 2");
    chrome.tabs.sendMessage(tabs[0].id, {
      data: "some value"
    });
  });

  // chrome.tabs.executeScript({
  //   code: 'const world = "hellp c Tangui"'
  // });
  // console.log("background");
  // chrome.tabs.executeScript(tabs[0].id, {
  //   code: 'document.body.style.backgroundColor = "' + color + '";'
  // });
});
