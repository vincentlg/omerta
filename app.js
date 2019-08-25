console.log("app");

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log("received message");
    console.log(msg)
    if (msg.text === 'secrets') {
        console.log(msg.secrets);
        localStorage.setItem("secrets", JSON.stringify(msg.secrets))
    }
    if (msg.text === 'mysecret') {
        console.log(msg.mysecret);
        localStorage.setItem("mysecret", msg.mysecret)
    }
});

// var s5 = document.createElement('script');
// s5.src = chrome.extension.getURL('cryptojs.js');
// (document.head || document.documentElement).appendChild(s5);
// s5.onload = function() {
//   s5.parentNode.removeChild(s5);
// };

var s = document.createElement('script');
s.src = chrome.extension.getURL('omerta.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
  s.parentNode.removeChild(s);
};
var retrievedObject = localStorage.getItem('secrets');
console.log('retrievedObject: ', JSON.parse(retrievedObject));
console.log(JSON.parse(retrievedObject));
