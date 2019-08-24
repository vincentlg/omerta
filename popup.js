'use strict';


let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

chrome.storage.sync.get('account', function(data) {
	console.log('---account change---');
  	document.getElementById("pubkey").innerHTML = 'your address: '+data.account.address
});

let showOptionBt = document.getElementById('showOptionBt');

showOptionBt.onclick = function(element) {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
};


  changeColor.onclick = function(element) {
  	console.log('---hello---');
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });

    
  };
  
