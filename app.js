console.log("app");
// chrome.extension.onMessage.addListener(handleMessage);
//
// function handleMessage(request) {
//   console.log("handleMessage");
//   console.log(request.data);
// }

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'getDom') {
        console.log("getDom");
        sendResponse(document);
    }

    if (msg.text === 'replace_all') {
        console.log("replace_all");
        document.body.innerHTML = msg.body.innerHTML
        sendResponse("ok");
    }
});

var s3 = document.createElement('script');
s3.src = chrome.extension.getURL('web3.js');
(document.head || document.documentElement).appendChild(s3);
s3.onload = function() {
  s3.parentNode.removeChild(s3);
};

var s4 = document.createElement('script');
s4.src = chrome.extension.getURL('axios.js');
(document.head || document.documentElement).appendChild(s4);
s4.onload = function() {
  s4.parentNode.removeChild(s4);
};

var s2 = document.createElement('script');
s2.src = chrome.extension.getURL('eth-crypto.js');
console.log("s2.src");
console.log(s2.src);
(document.head || document.documentElement).appendChild(s2);
s2.onload = function() {
  s2.parentNode.removeChild(s2);
};

// var s5 = document.createElement('script');
// s5.src = chrome.extension.getURL('cryptojs.js');
// (document.head || document.documentElement).appendChild(s5);
// s5.onload = function() {
//   s5.parentNode.removeChild(s5);
// };

// var s = document.createElement('script');
// s.src = chrome.extension.getURL('inject.js');
// (document.head || document.documentElement).appendChild(s);
// s.onload = function() {
//   s.parentNode.removeChild(s);
// };


// chrome.runtime.onConnect.addListener(function(port) {
//   // port.onMessage.addListener(function(msg) {
//   console.log("received message");
//   console.log(port);
//   // port.postMessage({
//   //   counter: msg.counter + 1
//   // });
//   // });
// });

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//       "from a content script:" + sender.tab.url :
//       "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({
//         farewell: "goodbye"
//       });
//   });
