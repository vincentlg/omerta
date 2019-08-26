
'use strict';


document.getElementById("importAccountButton").addEventListener("click", function(){
    const senderPrivateKey = document.getElementById("skInput").value;
    const senderPublicKey = EthCrypto.publicKeyByPrivateKey(senderPrivateKey);
    const senderAddress = EthCrypto.publicKey.toAddress(senderPublicKey);

    const account = {
      address: senderAddress,
      privateKey: senderPrivateKey,
      publicKey: senderPublicKey
    }

    document.getElementById("skResult").innerHTML = 'Your account is loaded:'+account.address
    chrome.storage.sync.set({account: account}, function() {})

    const secretMessage = Math.floor(1000000000 + Math.random() * 9000000000).toString(16)
    chrome.storage.sync.set({mysecret: secretMessage}, function() {})
});

document.getElementById("importPubKeyButton").addEventListener("click", function(){

    const pubKey = document.getElementById("pkInput").value;
    sendTxToPubKey(pubKey)
});

async function sendTxToPubKey(recipientPubKey) {
  chrome.storage.sync.get('account', function(data) {

    let sender = data.account;

    const recipientAddress = EthCrypto.publicKey.toAddress(recipientPubKey);

    const recipient = {
      address: recipientAddress,
      publicKey: recipientPubKey
    }
    chrome.storage.sync.get('mysecret', function(data2) {
      sendWithSecret(sender, recipient, data2.mysecret)
    })
  });
}

async function sendWithSecret(sender, recipient, secretMessage) {

  const node = 'https://ropsten.infura.io/'
  const web3 = new Web3( new Web3.providers.HttpProvider(node))

    const encrypted = await EthCrypto.encryptWithPublicKey(
        recipient.publicKey, secretMessage
    );
    const encryptedString = EthCrypto.cipher.stringify(encrypted);

    let data = Web3.utils.utf8ToHex('omerta:'+document.getElementById("socialID").value+':'+encryptedString)

    let nonce = await web3.eth.getTransactionCount(sender.address)

    let details = {
      "to": recipient.address,
      "value": 0,
      "gas": 70000,
      "gasPrice": 2,
      "nonce": nonce,
      "data": data,
    }

    let _EthereumTx = EthereumTx.Transaction

    const transaction = new _EthereumTx(details, { chain: 'ropsten', hardfork: 'petersburg' },)

    Buffer = Buffer.Buffer
    const privateKey = Buffer.from(
      sender.privateKey,
      'hex',
    )
    transaction.sign(privateKey)

    const serializedTransaction = transaction.serialize()


    web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
    .on('transactionHash', async function(hash){
      console.log(hash);

      document.getElementById("pubkeyResult").innerHTML = 'Your TX is on the road :'+hash
    })
    .on('error', function(err){
      console.log(err);
    })
}

chrome.storage.sync.get('account', function(data) {
  if(data.account)
  {
    document.getElementById("actualKey").innerHTML = 'Your actual address is:'+data.account.address
  }
});
