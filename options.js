'use strict';
console.log("option");

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

function constructOptions(kButtonColors) {
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({
        color: item
      }, function() {
        console.log('color is ' + item);
      })
    });
    //page.appendChild(button);
  }
}

constructOptions(kButtonColors);

document.getElementById("importAccountButton").addEventListener("click", function() {

  console.log('ok');

  const senderPrivateKey = document.getElementById("skInput").value;
  const senderPublicKey = EthCrypto.publicKeyByPrivateKey(senderPrivateKey);
  const senderAddress = EthCrypto.publicKey.toAddress(senderPublicKey);

  const account = {
    address: senderAddress,
    privateKey: senderPrivateKey,
    publicKey: senderPublicKey
  }

  document.getElementById("result").innerHTML = account
  chrome.storage.sync.set({
    account: account
  }, function() {
    console.log('account is ' + account);
  })

});
