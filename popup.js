'use strict';

let prefix = "omerta"
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/18b3c51dbbdf42d1be2db61e945f88a9"));

function nullHandler(truc) {
  console.log("good");
}

chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
  chrome.storage.sync.get('account', async function(data) {
    let secrets = await getSecrets(data)
    console.log("send message");
    chrome.tabs.sendMessage(tabs[0].id, {text: 'secrets', secrets: secrets}, nullHandler);
  });
});

chrome.storage.sync.get('account', function(data) {
	console.log('---account change---');
  	document.getElementById("pubkey").innerHTML = 'your address: '+data.account.address
});

let showOptionBt = document.getElementById('showOptionBt');

showOptionBt.onclick = function(element) {
	chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
};

async function getSecrets(data) {
  try {
    const response = await axios.get('https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=' + data.account.address + '&startblock=0&endblock=99999999&sort=asc&apikey=a');
    console.log(response.data.result);
    let transactions = response.data.result
    let _secrets = new Object();
    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i].to.toLowerCase() == data.account.address.toLowerCase()) {
        console.log("to " + transactions[i].to);
        var str = web3.utils.hexToUtf8(transactions[i].input);
        console.log("data " + web3.utils.hexToUtf8(transactions[i].input));

        var res = str.split(":")
        if (res[0] == prefix) {
          console.log("omerta tx found");

          let secret = await decodeSecret(res[2], data.account.privateKey)
          if (secret != "") {
            _secrets[res[1]] = secret;
          }
        }
      }
    }
    return _secrets
  } catch (error) {
    console.error(error);
  }
}

async function decodeSecret(str, privateKey) {
  console.log(privateKey);
  try {
    let encodedSecret = EthCrypto.cipher.parse(str)
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encodedSecret
    );
    return decrypted
  } catch (e) {
    console.log(e);
    return ""
  }
}
