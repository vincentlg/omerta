// (function() {
//   console.log("coucou");
//   alert('go');
//
// 	// just place a div at top right
// 	var div = document.createElement('div');
// 	div.style.position = 'fixed';
// 	div.style.top = 0;
// 	div.style.right = 0;
// 	div.textContent = 'Injected!';
// 	document.body.appendChild(div);
//
// 	alert('inserted self... giggity');
//
// })();
console.log("coucou");

// console.log("hello");
let user = {}

window.onload = () => {
  const network = 'ropsten'
  var prefix = "omerta"
  var fbID = "tangui.clairet"
  const meAddress = '0x07AA1cBff46C82119e341524044052EFdaDA65BB'.toLowerCase()
  const mePrivateKey = '8A13A41613E6997BCC5C072614E944D45F95F9A83DC94410067FA2A0A297F287'.toLowerCase()
  var web3 = new Web3(new Web3.providers.HttpProvider("https://"+network+".infura.io/v3/18b3c51dbbdf42d1be2db61e945f88a9"));
  const mePublicKey = EthCrypto.publicKeyByPrivateKey(mePrivateKey)



  /*
  Helper functions
   */

  let secrets = new Object();
  getSecrets()

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

  const getFacebookProfileID = (node) => {
    const parent = node.parentNode
    const aProfile = parent.firstChild.firstChild.firstChild
    const url = aProfile.getAttribute('href')
    const fbID = (url.split('?')[0]).replace('https://www.facebook.com/', '')
    console.warn("FBID: " + fbID)
    return fbID
  }

  const decryptWithOmerta = () => {
    //TODO: Decrypt data
  }

  const encryptWithOmerta = () => {
    const copyText = document.querySelector('span[data-text=true]')
    var textArea = document.createElement('textarea')
    textArea.value = 'Powned by Omerta'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }

  /*
    Observer Config
   */
  const config = {
    attributes: true,
    childList: true,
    subtree: true
  }

  /*
    Encrypt/Decrypt Facebook Statuses Observer
   */
  const getUserContent = () => {
    const collection = document.getElementsByClassName('userContent')
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
  const targetNode = document.body
  const encryptDecryptObserver = new MutationObserver(getUserContent)
  encryptDecryptObserver.observe(targetNode, config)

  /*
    RegisterOmertaButton Observer
   */
  const add = (type, id, value, name, fun, parent) => {
    var element = document.createElement('input')
    element.type = type
    element.value = value // Really? You want the default value to be the type string?
    element.name = name // And the name too?
    element.onclick = fun
    element.id = id
    element.setAttribute('data-testid', 'react-composer-post-button')
    element.setAttribute('class', '_1mf7 _4r1q _4jy0 _4jy3 _4jy1 _51sy _42ft')

    parent.appendChild(element)
  }

  const registerOmertaButton = () => {
    console.warn('Triggered registerOmertaButton')
    if (document.getElementById('omerta-encrypt-toggle') === null) {
      const submitButton = document.querySelector('button[type="submit"][data-testid="react-composer-post-button"]')
      const divParent = submitButton.parentElement.parentElement
      const omertaParent = submitButton.parentElement.cloneNode(true)
      omertaParent.innerHTML = ''
      add('button', 'omerta-encrypt-toggle', 'Encrypt with Omerta & Copy to Clipboard', 'encrypt-omerta', encryptWithOmerta, omertaParent)
      divParent.insertBefore(omertaParent, submitButton.parentElement)
    }
  }

  async function decodeSecret(str) {
    try {
      encodedSecret = EthCrypto.cipher.parse(str)
      const decrypted = await EthCrypto.decryptWithPrivateKey(
        mePrivateKey,
        encodedSecret
      );
      return decrypted
    } catch (e) {
      return ""
    }
  }
  /*
    Toggle Facebook Post Input Observer
   */
  // const post_composer = document.getElementById('pagelet_composer')
  // post_composer.addEventListener('click', () => {
  //   setTimeout(registerOmertaButton, 1500)
  // })
}
