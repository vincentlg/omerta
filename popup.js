'use strict';


let secrets = new Object();
const network = 'ropsten'
var prefix = "omerta"
var fbID = "tangui.clairet"
const meAddress = '0x07AA1cBff46C82119e341524044052EFdaDA65BB'.toLowerCase()
const mePrivateKey = '8A13A41613E6997BCC5C072614E944D45F95F9A83DC94410067FA2A0A297F287'.toLowerCase()
var web3 = new Web3(new Web3.providers.HttpProvider("https://"+network+".infura.io/v3/18b3c51dbbdf42d1be2db61e945f88a9"));
const mePublicKey = EthCrypto.publicKeyByPrivateKey(mePrivateKey)

console.log("popup");
function doStuffWithDom(dom) {
    console.log('I received the body');
    // body.innerHTML = "hello";

    getSecrets()
    getUserContent(dom)



    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {text: 'replace_all', body:dom.body}, function noResponse(res) {
      });
    });
}

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {text: 'getDom'}, doStuffWithDom);
});

let changeColor = document.getElementById('changeColor');
chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  console.log('---hello---');
  let color = element.target.value;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id, {
        code: 'document.body.style.backgroundColor = "' + color + '";'
      });
  });

  console.log("ok");
  // sendTx();
};


async function sendTx() {

  const node = 'https://ropsten.infura.io/'
  const web3 = new Web3(new Web3.providers.HttpProvider(node))

  console.log('---omerta---');

  const senderPrivateKey = '772DB29DE0D7BFD6C6895CA5100A7326702844FE1B7BCDB248BCECEECB4BB404'
  const senderPublicKey = EthCrypto.publicKeyByPrivateKey(senderPrivateKey);
  const senderAddress = EthCrypto.publicKey.toAddress(senderPublicKey);

  const sender = {
    address: senderAddress,
    privateKey: senderPrivateKey,
    publicKey: senderPublicKey
  }

  let recipientPubKey = '95a8790bf509d0e1ba472813760e81d07b29455019a35026202b0d228116343d0b9bd084ff5f95a85250655615319225b8beec2252a910957008e27b5141e898'

  const recipientAddress = EthCrypto.publicKey.toAddress(recipientPubKey);

  const recipient = {
    address: recipientAddress,
    publicKey: recipientPubKey
  }

  const secretMessage = 'iloveyou';

  const encrypted = await EthCrypto.encryptWithPublicKey(
    recipient.publicKey, secretMessage // by encryping with bobs publicKey, only recipient can decrypt the payload with his privateKey
  );


  // we convert the object into a smaller string-representation
  const encryptedString = EthCrypto.cipher.stringify(encrypted);


  console.log('------encryptedString--------');
  console.log(encryptedString)



  let data = Web3.utils.utf8ToHex('omerta:tangui.clairet:' + encryptedString)

  // now we send the encrypted string to recipient over the internet...
  let nonce = await web3.eth.getTransactionCount(sender.address)

  console.log('------nonce--------');
  console.log(nonce)

  console.log('------data--------');
  console.log(data)

  let details = {
    "to": recipient.address,
    "value": 0,
    "gas": 70000,
    "gasPrice": 7,
    "nonce": nonce,
    "data": data,
  }

  EthereumTx = EthereumTx.Transaction

  const transaction = new EthereumTx(details, {
    chain: 'ropsten',
    hardfork: 'petersburg'
  }, )


  Buffer = Buffer.Buffer
  const privateKey = Buffer.from(
    sender.privateKey,
    'hex',
  )
  transaction.sign(privateKey)

  console.log('transaction')
  console.log(transaction)


  const serializedTransaction = transaction.serialize()

  console.log('serializedTransaction')
  console.log(serializedTransaction)


  web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
    .on('transactionHash', async function(hash) {
      console.log('------ok--------');
      console.log(hash);
    })
    .on('error', function(err) {
      console.log(err);
    })
}


// function init() {
//   console.log("inside init");
//   chrome.runtime.onMessage.addListener(
//     function(message, callback) {
//       if (message == "runContentScript") {
//         chrome.tabs.executeScript({
//           file: 'injected.js'
//         });
//       }
//     });
// }
//
// init()



async function getSecrets() {
  try {
    const response = await axios.get('https://api-' + network + '.etherscan.io/api?module=account&action=txlist&address=' + meAddress + '&startblock=0&endblock=99999999&sort=asc&apikey=a');
    transactions = response.data.result
    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i].to == meAddress) {
        var str = web3.utils.hexToUtf8(transactions[i].input);
        var res = str.split(":")
        if (res[0] == prefix) {
          console.log("omerta tx found");

          secret = await decodeSecret(res[2])
          if (secret != "") {
            secrets[res[1]] = secret;
          }
        }
      }
    }
    console.log(secrets);

  } catch (error) {
    console.error(error);
  }
}

const getUserContent = (dom) => {
  console.log(dom);
  const collection = dom.getElementsByClassName('userContent')
  const array = Array.from(collection)
  const filter = array.map((element) => {
    if (element.classList.contains('userContent') &&
      element.childNodes.length > 0 &&
      !element.classList.contains('omerta')
    ) {
      element.classList.add('omerta')
      id = getFacebookProfileID(element)

      // decode ici
      if (secret[id] != "") {
        element.childNodes.forEach((el) => {
          var encrypted = CryptoJS.AES.decrypt(el.innerHTML, "Secret Passphrase");
          el.innerHTML = encrypted
        })
      }
      return element
    }
  })
  if (filter.length > 0) {
    return filter
  }
  return null
}
