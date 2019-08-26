let secrets = {}

const mysecret = 'iloveyou'

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
        const idSelector = node.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.lastChild.firstChild
        if (idSelector !== null) {
            return idSelector.innerText
        }
    }
    return null
}

const copyText = () => {
    const secret = localStorage.getItem("mysecret");
    console.warn('Secret = ' + secret)
    let copyText
    if (getCurrentPlatform() == PLATFORMS.FACEBOOK) {
        copyText = document.querySelector('span[data-text=true]')
    } else if (getCurrentPlatform() == PLATFORMS.TWITTER) {
        copyText = document.querySelector('div[class="public-DraftStyleDefault-block public-DraftStyleDefault-ltr"]').firstChild.firstChild
    }
    const textArea = document.createElement('textarea')
    textArea.value = CryptoJS.AES.encrypt(copyText.innerText.toString(), secret)
    console.warn('Encoded = ' + textArea.value)
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
}

const encryptWithOmerta = () => {
    return copyText()
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
            console.warn('ID == ' + ID)
            if (secrets[ID]) {
                element.childNodes.forEach((el) => {
                    console.warn(`MESSAGE FOUND ${el.innerHTML}`)
                    const bytes = CryptoJS.AES.decrypt(el.innerHTML, secrets[ID])
                    const msg = bytes.toString(CryptoJS.enc.Utf8)
                    console.warn(`TWEET DECODE ${msg}`)
                    el.innerHTML = msg
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

const parseTwitterUserFeed = () => {
    secrets = JSON.parse(localStorage.getItem("secrets"));
    if (secrets.length != 0) {
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
                let tweet
                if (tweetData.length > 1) {
                    tweet = mergeInnerHTML(tweet)
                } else {
                    tweet = tweetData.firstChild.innerHTML
                }
                if (secrets[ID]) {
                    console.warn(`TWEET FOUND ${tweet}`)
                    const bytes = CryptoJS.AES.decrypt(tweet, secrets[ID])
                    const msg = bytes.toString(CryptoJS.enc.Utf8)
                    console.warn(`TWEET DECODE ${msg}`)
                    tweetData.innerHTML = msg
                } else {
                    tweetData.innerHTML = tweet
                }
            }
        })
        if (filter.length > 0) {
            return filter
        }
    }
    return null
}
// Watch for DOM changes on document.body
const targetNode = document.body

function getPlatformUserFeedObserver() {
    switch (getCurrentPlatform()) {
        case PLATFORMS.FACEBOOK:
            console.log('Registering Facebook Observer')
            return new MutationObserver(parseFacebookUserFeed)
        case PLATFORMS.TWITTER:
            console.log('Registering Twitter Observer')
            return new MutationObserver(parseTwitterUserFeed)
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
        omertaParent.addEventListener('click', encryptWithOmerta)
        parent.insertBefore(omertaParent, submitParent)
    }
}

/*
      Toggle Facebook Post Input Observer
     */
switch (getCurrentPlatform()) {
    case PLATFORMS.FACEBOOK:
        const postComposer = document.getElementById('pagelet_composer')
        postComposer.addEventListener('click', () => {
            setTimeout(registerOmertaButtonFacebook, 1500)
        })
    case PLATFORMS.TWITTER:
        setTimeout(registerOmertaButtonTwitter, 1500)
    default:
        console.error('Error creating observer button')
}
//}
