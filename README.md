

# omerta: code of silence
<img src="https://github.com/vincentlg/omerta/blob/master/omerta-logo.svg" align="left" width="100" >
This project is developed during the ETHBerlinZwei hackathon (2019).

*Omertà is a Southern Italian code of silence and code of honor that places importance on silence in the face of questioning by authorities or outsiders; non-cooperation with authorities, the government, or outsiders; [wikipedia](https://en.wikipedia.org/wiki/Omert%C3%A0)*

# Table of Contents
1. [Introduction](#Introduction)
2. [The Omerta diagram](#The-Omerta-diagram)
3. [What exactly did we do during the Hackatons?](#What-exactly-did-we-do-during-the-Hackatons?)
4. [The Demo](#the-demo)
5. [What we could not complete](#What-we-could-not-complete)
6. [Install & Test](#Install-&-test)
7. [The Team](#The-Team)
8. [Licence](#Licence)

## Introduction
####  Let's use Facebook, but with end-to-end encryption! 

This is not a troll, people use Twitter and Facebook and it is not going to change soon. People have their habits and above all, their friends and their network are on it and that create a significant retention of users.

Finally, in an ideal world we could continue to use our favorite social networks by adding a feature that would give us a real control of our data.

Starting from this idea, we imagined browser extension which resolve that, as smooth as possible, for users of these social networks.

#### The user experience with Omerta

Bob and Alice are friends on Facebook.
They install the Chrome browser extension "Omerta" and initialize it with their Ethereum account with enough Eth to make only 1 transaction on the mainnet.
And that's all.

#### The user experience with Omerta
When Bob installs the Omerta extension, he creates his mafia by filling the public keys of the member of his mafia (this step could be automated by allowing a Facebook app Omerta that would access the open graph API, we decided not to focus on this part during the Hackathon)

#### Bob should always be able to decide who can access his messages
How to make sure that only Alice can decode Bob's messages? (and not Mark)
Bob generates a secret locally, he encrypts it with Alice's public key, then sends a transaction to Alice with the encrypted secret in the data field of the transaction.(ECIES)

#### Facebook is an untrusted channel, so encrypt everything sent to him!
Thanks to the Omerta browser extension, when Bob posts a new status on Facebook, Omerta encrypts the message before sending it to Facebook's Backend.

#### Keep a great user experience for Alice
When Alice loads her Facebook Wall with the status of all her friends, Bob's encrypted status is decoded and replaced on the fly in HTML by the Omerta extension.

With this system, Bob and Alice have all the advantages of Facebook without the disadvantages.

From Facebook's point of view, this hijacking is not easy to detect and sensure, and techniques of offustation can always be added to Omerta to get a head start.

## The Omerta diagram
![omerta](https://github.com/vincentlg/omerta/blob/master/berlin-hack.svg)

## What exactly did we do during the Hackatons?
- Design a technical solution to meet the initial idea
- Try ECEIS implementation to validate that ethereum-identites could be used to share a secret onchain
- Create Scripts to interchange the event to send a message on Facebook / Twitter
- Create Crawler to identify encrypted messages and replace them on the fly.
- Create Scripts to restrieve a specific tx by a sheme in the data (omerta:userid:encryptedsecret)
- Create Chrome Extension who integrates and orchestrates all these scripts

## The Demo
Watch the video!

[![Watch the video](https://img.youtube.com/vi/PclnZebY-Wg/hqdefault.jpg)](https://www.youtube.com/watch?v=PclnZebY-Wg&feature=youtu.be)

## Install & Test
All the code of the extension is a the root of this repo (master tree) - (Warning, the code is quite instable)
The directory holding the manifest file can be added as an extension in developer mode in its current state.

- Open the Extension Management page by navigating to chrome://extensions.
- The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
- Enable Developer Mode by clicking the toggle switch next to Developer mode.
- Click the LOAD UNPACKED button and select the extension directory

<img src="https://github.com/vincentlg/omerta/blob/master/load_extension.png" width="300" >


The extension has been successfully installed

### Run Omerta for the first time
![omerta](https://github.com/vincentlg/omerta/blob/master/popup.png)
Clic on the Extension icon

![omerta](https://github.com/vincentlg/omerta/blob/master/option.png)
- Import your Eth Account by private Key
- import your Mafia members by ID (twitter or Facebook) and by their Public Key (not Address)


## What we could not complete
The script injection by the extension is not fully functional, but we have proved that it is technically possible, we ran out of time.

## The team

We are 3 developers (Backend / Blockchain) [Tangui Clairet](https://twitter.com/tangui_clairet), [Nicolas Law](https://twitter.com/nicolas_lyw), [Vincent Le Gallic](https://twitter.com/vincentLg), 
We work together at Rockside.io - We come from Paris and we are between 22 and 33 years old.

## Licence
MIT

