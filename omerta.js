window.onload = () => {
  const PLATFORMS = {
    FACEBOOK: 1,
    TWITTER: 2,
  }
  // Facebook as default value
  let currentPlatform = PLATFORMS.FACEBOOK
  /*
  Helper functions
   */
  const getCurrentPlatform = () => {
    // TODO: check HREF
    return currentPlatform
  }
  const setCurrentPlatform = (platform) => {
    currentPlatform = platform
  }
  const getFacebookProfileID = (node) => {
    const parent = node.parentNode
    const aProfile = parent.firstChild.firstChild.firstChild
    const url = aProfile.getAttribute('href')
    const ID = (url.split('?')[0]).replace('https://www.facebook.com/', '')
    console.warn(`FBID: ${ID}`)
    return ID
  }

  // TODO: Get Twitter Profile ID
  const getTwitterProfileID = (node) => {
    return ''
  }

  const decryptWithOmerta = () => {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        return
      case PLATFORMS.TWITTER:
        return
      default:
        console.error('Unsupported platform')
        return
    }
    // TODO: Decrypt data
    return ''
  }

  const encryptWithOmerta = () => {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        const copyText = document.querySelector('span[data-text=true]')
        const textArea = document.createElement('textarea')
        textArea.value = 'Powned by Omerta'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('Copy')
        textArea.remove()
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
    const array = Array.from(collection)
    const filter = array.map((element) => {
      if (element.classList.contains('userContent') &&
        element.childNodes.length > 0 &&
        !element.classList.contains('omerta')
      ) {
        element.classList.add('omerta')
        getFacebookProfileID(element)
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

  // TODO: Get User Feed Message
  const parseTwitterUserFeed = () => {
    return null
  }
  // Watch for DOM changes on document.body
  const targetNode = document.body

  function getPlatformUserFeedObserver () {
    switch (getCurrentPlatform()) {
      case PLATFORMS.FACEBOOK:
        return new MutationObserver(parseFacebookUserFeed)
      case PLATFORMS.TWITTER:
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
  const add = (type, id, value, name, fun, parent) => {
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

  /*
    Toggle Facebook Post Input Observer
   */
  const post_composer = document.getElementById('pagelet_composer')
  post_composer.addEventListener('click', () => {
    setTimeout(registerOmertaButtonFacebook, 1500)
  })
}
