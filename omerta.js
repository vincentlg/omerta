window.onload = () => {
  const PLATFORMS = {
    FACEBOOK: 1,
    TWITTER: 2,
    UNSUPPORTED: 3,
  }
  /*
  Helper functions
   */
  const getCurrentPlatform = () => {
    const hostname = window.location.hostname
    if (hostname.includes('facebook')) {
      return PLATFORMS.FACEBOOK
    } else if (hostname.includes('twitter')) {
      return PLATFORMS.TWITTER
    } else {
      return PLATFORMS.UNSUPPORTED
    }
  }

  const mergeInnerHTML = (children) => {
    return children.map((child) => {
      if (child.childNodes.length < 1) {
        return child.innerHTML
      } else {
        return child.firstChild.innerHTML
      }
    })
  }

  const getFacebookProfileID = (node) => {
    const parent = node.parentNode
    if (parent !== null) {
      const aProfile = parent.firstChild.firstChild.firstChild
      if (aProfile !== null) {
        const url = aProfile.getAttribute('href')
        if (url.length > 0) {
          return (url.split('?')[0]).replace('https://www.facebook.com/', '')
        }
      }
    }
    return null
  }

  const getTwitterProfileID = (node) => {
    if (node !== null) {
      const idSelector = node.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild
      if (idSelector !== null) {
        return idSelector.innerHTML
      }
    }
    return null
  }

  const decryptWithOmerta = () => {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        // TODO: Do something
        return
      case PLATFORMS.TWITTER:
        // TODO: Do something
        return
      default:
        console.error('Unsupported platform')
        return
    }
  }

  function facebookCopy () {
    const copyText = document.querySelector('span[data-text=true]')
    const textArea = document.createElement('textarea')
    textArea.value = 'Powned by Omerta'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }

  const encryptWithOmerta = () => {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        facebookCopy()
        return
      case PLATFORMS.TWITTER:
        // TODO: Do something
        return
      default:
        console.error('Unsupported')
    }
  }

  /*
    Observer Config
   */
  const config = {attributes: true, childList: true, subtree: true}

  /*
    Encrypt/Decrypt Facebook Statuses Observer
   */
  const parseFacebookUserFeed = () => {
    const collection = document.getElementsByClassName('userContent')
    const array = Array.from(collection) // Convert HTMLCollection to Array
    const filter = array.map((element) => {
      if (element.classList.contains('userContent') &&
        element.childNodes.length > 0 &&
        !element.classList.contains('omerta')
      ) {
        element.classList.add('omerta')
        const ID = getFacebookProfileID(element)
        element.childNodes.forEach((el) => {
          el.innerHTML = 'Hello from Omerta'
        })
        return element
      }
    })
    if (filter.length > 0) {
      return filter
    }
    return null
  }

  const parseTwitterUserFeed = () => {
    const collection = document.querySelectorAll('div[data-testid="tweet"]')
    const array = Array.from(collection) // Convert HTMLCollection to Array
    const filter = array.map((element) => {
      if (element.getAttribute('data-testid') === 'tweet' &&
        element.childNodes.length > 0 &&
        !element.classList.contains('omerta')
      ) {
        element.classList.add('omerta')
        const ID = getTwitterProfileID(element)
        const tweetData = element.lastChild.childNodes[1]
        if (tweetData.length > 1) {
          tweetData.innerHTML = 'Hello from Omerta!'
          return tweetData.innerHTML
          // const tweet = mergeInnerHTML(tweetData)
          // return tweet
        } else {
          tweetData.innerHTML = 'Hello From Omerta !'
          return tweetData.innerHTML
          // const tweet = tweetData.firstChild.innerHTML
          // return tweet
        }
      }
    })
    if (filter.length > 0) {
      return filter
    }
    return null
  }
  // Watch for DOM changes on document.body
  const targetNode = document.body

  function getPlatformUserFeedObserver () {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        console.log('Registering Facebook Observer')
        return new MutationObserver(parseFacebookUserFeed)
      case PLATFORMS.TWITTER:
        console.log('Registering Twitter Observer')
        return new MutationObserver(parseTwitterUserFeed)
      default:
        console.error('Unsupported operation')
        return null
    }
  }

  const encryptDecryptObserver = getPlatformUserFeedObserver()
  encryptDecryptObserver.observe(targetNode, config)

  /*
    RegisterOmertaButton Observer
   */
  const addFacebookOmertaButton = (type, id, value, name, fun, parent) => {
    var element = document.createElement('input')
    element.type = type
    element.value = value // Really? You want the default value to be the type string?
    element.name = name // And the name too?
    element.onclick = fun
    element.id = id
    element.setAttribute('data-testid', 'react-composer-post-button')
    element.setAttribute('class', '_1mf7 _4r1q _4jy0 _4jy3 _4jy1 _51sy _42ft _42fr')

    parent.appendChild(element)
  }

  const registerOmertaButtonFacebook = () => {
    if (document.getElementById('omerta-encrypt-toggle') === null) {
      const submitButton = document.querySelector('button[type="submit"][data-testid="react-composer-post-button"]')
      const divParent = submitButton.parentElement.parentElement
      const omertaParent = submitButton.parentElement.cloneNode(true)
      omertaParent.innerHTML = ''
      addFacebookOmertaButton('button', 'omerta-encrypt-toggle', 'Encrypt with Omerta & Copy to Clipboard', 'encrypt-omerta', encryptWithOmerta, omertaParent)
      divParent.insertBefore(omertaParent, submitButton.parentElement)
    }
  }

  const registerOmertaButtonTwitter = () => {
    if (document.getElementById('omerta-encrypt-toggle') === null) {
      const submitParent = document.querySelector('div[role="button"][data-testid="tweetButtonInline"]')
      const parent = submitParent.parentElement
      const omertaParent = submitParent.cloneNode(true)
      omertaParent.setAttribute('data-testid', 'tweetButtonInline')
      omertaParent.removeAttribute('disabled')
      omertaParent.removeAttribute('class')
      omertaParent.removeAttribute('aria-disabled')
      omertaParent.setAttribute('class', 'css-18t94o4 css-1dbjc4n r-urgr8i r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1un7vkp r-145lgeb r-9u3a9d r-1fneopy r-o7ynqc r-6416eg r-lrvibr')
      omertaParent.firstChild.firstChild.innerHTML = 'Omerta Encrypt&Copy'
      omertaParent.setAttribute('id', 'omerta-encrypt-toggle')
      omertaParent.addEventListener('click', () => {
        console.log('hellllooooooo')
      })
      parent.insertBefore(omertaParent, submitParent)
    }
  }

  /*
    Toggle Facebook Post Input Observer
   */
  switch (getCurrentPlatform()) {
    case PLATFORMS.FACEBOOK:
      const postComposer = document.getElementById('pagelet_composer')
      return postComposer.addEventListener('click', () => {
        setTimeout(registerOmertaButtonFacebook, 1500)
      })
    case PLATFORMS.TWITTER:
      return setTimeout(registerOmertaButtonTwitter, 1500)
    default:
      console.error('Unsupported platform')
  }
}
