// "Simple" code that gets the job done by Orange
//
var debug; var allowUpdate = true;
// Set up environment 
var aSiteWePullAndPushTo = "https://test.reveb.la";
//var aSiteWePullAndPushTo = "http://orange-nuc.local:4000";
var now = (new Date).getTime();
var headers = new Headers();
var globalCode = "";
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};
var updateJSON; // Request
var IVLocalIndex = false;
var mode = 0

// Set browser to chrome if chromium based
const chrRegex = /Chr/i;
const frRegex = /Firefox/i;
const phoneRegex = /iPhone/i;

browser = chrome || browser;

if (chrRegex.test(navigator.userAgent)) identifier = "fafojfdhjlapbpafdcoggecpagohpono"
if (frRegex.test(navigator.userAgent)) identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"
if (phoneRegex.test(navigator.userAgent)) mode = 1;

// Various Lookups
let localReplace = browser.runtime.getURL('replacements.json');
let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let buttonSvg = browser.runtime.getURL('button.svg');
let psl = browser.runtime.getURL('public_suffix_list.dat');
let localIndex = browser.runtime.getURL('index.json');

var lookup = {}; 

var dontOpen = false;
var level = 0;

// The Elements we inject
var globalCode, code, hashforsite, domainString, sourceString, open, iframe;
var domainInfo;
var bgresponse;
var username, pretty_name;
var voteCode;

var aSiteYouVisit = window.location.href;
var buttonOffsetVal = 16;
var buttonOffset = buttonOffsetVal + "px";

var settingsState;

var backgroundColor = "#fff";
var textColor = "#343434";
var heavyTextColor = "#111";

var voteUrl = "https://assets.reveb.la";
var voteStatus;
var blockedHashes = [];

var IVBlock = false;
var bubbleMode = 0;
var loggedIn;

if (window.matchMedia && !!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (debug) console.info('[ Invisible Voice ]: Dark Theme detected 🌒 ');
    darkMode = true;
    backgroundColor = "#343434";
    textColor = "#fff";
    heavyTextColor = "#AAA";
}

const tagLookup = {
    "l": "Glassdoor",
    "b": "BCorp",
    "P": "TOS;DR",
    "m": "MBFC",
    "t": "TrustPilot",
    "s": "TrustScam"
}
const idLookup = {
    "Glassdoor": "glassdoor",
    "BCorp": "bcorp",
    "TOS;DR": "tosdr",
    "MBFC": "mbfc",
    "TrustPilot": "trust-pilot",
    "TrustScam": "trust-scam"
}

keyconversion = {
    'bcorp_rating': "b",
    'connections': "c",
    'glassdoor_rating': "l",
    'goodonyou': "g",
    'isin': "i",
    'mbfc': "m",
    'osid': "o",
    'polalignment': "a",
    'polideology': "p",
    'ticker': "y",
    'tosdr': "P",
    'trust-pilot': "t",
    'trustcore:': "s",
    'wikidata_id': "w",
}

// Default user preferences with type, min, max, and labels for each tag
const defaultUserPreferences = {
   "l": { type: "range", min: 0, max: 10 },                                           
   "b": { type: "range", min: 0, max: 150 },                                          
   "P": { type: "range", min: 1, max: 6 },                                            
   "s": { type: "range", min: 0, max: 100 },                                          
   "t": { type: "range", min: 0, max: 100 },
   "m": { type: "label", labels: [ "conspiracy-pseudoscience", "left",
"left-center", "pro-science", "right", "right-center", "satire",
"censorship", "conspiracy", "failed-fact-checks", "fake-news", "false-claims",
"hate", "imposter", "misinformation", "plagiarism", "poor-sourcing", "propaganda", "pseudoscience"
  ] },
};

// Step 1: Load user preferences from browser.storage.local or set defaults
browser.storage.local.get("userPreferences", function (localdata) {
  const loadedPreferences = localdata.userPreferences || {};

  // Merge default preferences with loaded preferences
  const mergedPreferences = { ...defaultUserPreferences, ...loadedPreferences };

  // Update user preferences in browser.storage.local
  browser.storage.local.set({ "userPreferences": mergedPreferences });
});

function processNotification(tag, value) {
  // Get user preferences
  browser.storage.local.get("userPreferences", function (localdata) {
    const preferences = localdata.userPreferences || {};
    // Check if user preferences exist for the tag
    if (preferences[tag]) {
      const { type } = preferences[tag];
      // Compare notification value based on the type
      if (type === "range" && isInRange(value, preferences[tag])) {
        // Display the notification with tag label and data
        displayNotification(tag, value);
      } else if (type === "label") {
        // Display the notification with tag label and data
        for (label of value){
            if (isMatchingLabel(label, preferences[tag]))
                displayNotification(tag, label);
        }
      }
    }
  });
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isInRange(value, preference) {
  const { min, max } = preference;

  // Convert both numeric and letter ratings to numeric values
  const numericValue = convertRatingToNumeric(value);
  const numericMin = convertRatingToNumeric(min);
  const numericMax = convertRatingToNumeric(max);

  return numericValue >= numericMin && numericValue <= numericMax;
}

function convertRatingToNumeric(rating) {
  // Check if the rating is numeric (1-6)
  if (!isNaN(rating)) {
    return Number(rating);
  }

  // If it's not numeric, attempt to convert it to a numeric value based on the letter ratings (A-F)
  const ratings = ["A", "B", "C", "D", "E", "F"];
  const index = ratings.indexOf(rating);
  if (index !== -1) {
    return index + 1;
  }

  // If the rating is neither numeric nor a valid letter rating, return NaN
  return NaN;
}

// {
//     "preferred_language": "en",
//     "loggedIn": false,
//     "debugMode": false,
//     "darkMode": true,
//     "keepOnScreen": true,
//     "userPreferences": [],
//     "bobbleOverride": false,
//     "notifications": "true",
//     "notificationsTags": "mtbPls",
//     "listOrder": "",
//     "experimentalFeatures": true
// }
 var defaultSettingsState = {                                                        
      "preferred_language": "en",                                                     
      "loggedIn": false,                                                              
      "debugMode": false,                                                             
      "darkMode": false,                                                              
      "keepOnScreen": false,                                                          
      "userPreferences": [],                                                          
      "bobbleOverride": false,                                                        
      "notifications": false,                                                         
      "notificationsTags":[],                                                         
      "listOrder": "",                                                                
      "experimentalFeatures": false,                                                  
  }        
async function processSettingsObject(){
    settingsState = await browser.storage.local.get("settings_obj").then(function(obj){
        if (typeof(obj) === 'undefined'){
            return defaultSettingsState 
        }
        return JSON.parse(obj["settings_obj"])
    });
    debug = settingsState["debugMode"]
    console.log(settingsState);
}

function isMatchingLabel(value, preference) {
  const { labels } = preference;
  return labels.includes(value);
}


function displayNotification(tag, value) {
  const tagLabel = tagLookup[tag]; // Get the label for the tag
  if (debug) console.log(`${tag},${value}`);

  const isSS = tag === 'm'; // Check if it's a special case for "m" tag

  addItemToNotification(null, tagLabel, value, isSS);
}


const ivLogoArrow = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3e%3ccircle cx='20' cy='20' r='18' fill='none'/%3e%3cpath fill='%231A1A1A' d='M18.201 14.181h3.657v14.536a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817V14.181ZM18.201 10.547c0-1.003.819-1.817 1.829-1.817s1.828.814 1.828 1.817a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817Z'/%3e%3cpath fill='%231A1A1A' d='m10.318 21.634 1.292-1.285a1.836 1.836 0 0 1 2.586 0l8.402 8.351-2.585 2.57-9.696-9.636Z'/%3e%3cpath fill='%231A1A1A' d='M25.804 20.349a1.836 1.836 0 0 1 2.586 0l1.293 1.285-9.696 9.636-2.585-2.57 8.402-8.351Z'/%3e%3cpath fill='%231A1A1A' fill-rule='evenodd' d='M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20ZM20 37.46c9.643 0 17.46-7.817 17.46-17.46S29.643 2.54 20 2.54 2.54 10.357 2.54 20 10.357 37.46 20 37.46Z' clip-rule='evenodd'/%3e%3c/svg%3e"

var notificationsToShow = false;
var notificationsDismissed = false;


function enableNotifications() {
  if (notificationsDismissed) return;

  notificationShade = document.createElement("section");
  notificationShade.id = "IVNotification";

  const notificationOverlay = document.createElement("div");
  notificationOverlay.classList.add("IVNotOverlay");

  const notivlogo = document.createElement("img");
  notivlogo.classList.add("IVNotLogo");
  notivlogo.src = ivLogoArrow;
  notificationOverlay.appendChild(notivlogo);

  const hovernotice = document.createElement("div");
  hovernotice.classList.add("IVHoverNotice");
  hovernotice.textContent = "hover to see more";
  hovernotice.style.visibility = "hidden";
  notificationOverlay.appendChild(hovernotice);

  const ivnotclose = document.createElement("div");
  ivnotclose.classList.add("IVNotClose");
  ivnotclose.onclick = dismissNotification;
  ivnotclose.textContent = "+";
  notificationOverlay.appendChild(ivnotclose);

  notificationShade.appendChild(notificationOverlay);
  
  browser.storage.local.get(localdata => {
    const tags = (settingsState.notificationsTags || '').split('').reverse().join('');
    const domainKey = domainString.replace(/\./g, "");
    const siteTags = localdata.data?.[domainKey]?.k || [];
    const matchedTags = tags.split('').filter(tag => siteTags.includes(tag));

    if (debug) console.log(domainKey);
    if (debug) console.log(tags);
    if (debug) console.log("notifications are on", siteTags);
    if (debug) console.log("matched tags", matchedTags);
    if (debug) console.log(localdata.data[domainKey])

    if (matchedTags.length > 0) {
      const currentState = localdata.siteData || {};
      if (currentState[domainKey]) {
        const data = currentState[domainKey];
        matchedTags.forEach(tag => processNotification(tag, data[tag]));
        if (debug) console.log("local notification data");
      } else {
        let requestList = [domainKey];
        const indexList = localdata.data;
        const tagArray = [...matchedTags];

        if (typeof indexList === 'object' && indexList !== null) {
          const filteredList = Object.keys(indexList).filter(key => {
            const item = indexList[key];
            if (typeof item.k === 'string') {
              return tagArray.some(substring => item.k.includes(substring));
            }
          });

          while (requestList.length < 9) {
            const randomIndex = Math.floor(Math.random() * filteredList.length);
            if (!requestList.includes(filteredList[randomIndex])) {
              requestList.push(filteredList[randomIndex]);
            }
          }
        }

        shuffleArray(requestList);

        requestList.forEach(domain => {
          const dataRequest = new Request(`${aSiteWePullAndPushTo}/db/${domain}/index.json`, init);
          fetch(dataRequest)
            .then(response => response.json())
            .then(data => {
              currentState[domain] = data.data;
              browser.storage.local.set({ "siteData": currentState });

              if (domain == domainKey) {
                matchedTags.forEach(tag => processNotification(tag, data[tag]));
              }
            });
        });
      }
    }
  });
}

var notifications = false;
function createObjects() {
    // if (aSiteYouVisit == "http://example.com/") enableNotifications();
    browser.storage.local.get(function(localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        blockCheck();
    });
    if (settingsState.bobbleMode == "true") {
        bubbleMode = 1;
    }
    notifications = settingsState.notifications;
    if (settingsState.notifications == "true") {
        enableNotifications();
    }
    if (debug) console.log("[ Invisible Voice ]: creating " + mode);
    if ((bubbleMode == 0 && mode == 1) || debug == true){
        browser.storage.local.get(function(localdata) {
            if (settingsState.bobbleMode != "true") {
                bobble = document.createElement("div");
                buttonSize = 40;
                bobble.style.cssText = `
                    width:${buttonSize}px;
                    background-image:url(${buttonSvg});
                    height:${buttonSize}px;
                    background-size: ${buttonSize}px ${buttonSize}px;`;
                // bobble.setAttribute("onclick", this.remove());
                bobble.id = "InvisibleVoice-bobble";


                document.documentElement.appendChild(bobble);
                dragElement(document.getElementById("InvisibleVoice-bobble"));
                bobble.onclick = browser.browserAction.openPopup()
                browser.storage.local.get('newplace', function(position) {
                     var pos = Object.values(position)[0].split(',');
                     // console.log("[ Invisible Voice ]: loading loc" + pos)
                     if (pos[0] > 1) pos[0] = 0.9;
                     if (pos[0] < 0) pos[0] = 0.1;
                     if (pos[1] > 1) pos[1] = 0.9;
                     if (pos[1] < 0) pos[1] = 0.1;
                     // console.log("[ Invisible Voice ]: loading loc" + (window.innerWidth * pos[1]) + "," + (window.innerHeight * pos[0]))
                     bobble.style.top = (window.innerHeight * pos[0]) + "px";
                     bobble.style.left = (window.innerWidth * pos[1]) + "px";
                })
            }
        })
    }
    if (mode == 1) return;
    iframe = document.createElement("iframe");
    open = document.createElement("div");
    open.id = "invisible-voice";
    open.style.cssText =
        `width: ${buttonOffset}!important;
         border-color:${textColor};
         background-color:${backgroundColor};
         color: ${textColor};`;
    iframe.id = "Invisible";
    iframe.style.cssText = `border-color:${textColor};background-color:${backgroundColor};`
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(open);
    resize("close");
    open.style.right = "0";
    if (mode == 0) iframe.style.width = distance + 'px';
    if (mode == 0) iframe.style.height = '100dvh';
};


// Domain handling
// PSL 2023/06/23 updated
async function parsePSL(pslStream, lookup) {
  browser.storage.local.get(function(data){
        pretty_name = data.pretty_name;
        username = data.username;
        loggedIn = (username != undefined) ? true : false;
        if (loggedIn) console.log(`user ${username}/${pretty_name} is logged in`)
  })
  const decoder = new TextDecoder();
  const reader = pslStream.getReader();
  let chunk;
  let pslData = '';

  while (!(chunk = await reader.read()).done) {
    const decodedChunk = decoder.decode(chunk.value, { stream: true });
    pslData += decodedChunk;
  }

  const lines = pslData.trim().split('\n');
  const publicSuffixes = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith('//')) {
      continue; // Ignore empty lines and comments
    }

    const isException = trimmedLine.startsWith('!');
    const domainOrRule = trimmedLine.substring(isException ? 1 : 0);
    const isWildcard = domainOrRule.startsWith('*');
    const suffix = isWildcard ? domainOrRule.substring(1) : domainOrRule;

    if (isException) {
      const lastSuffix = publicSuffixes[publicSuffixes.length - 1];
      if (lastSuffix && lastSuffix.exceptionRules) {
        lastSuffix.exceptionRules.push(suffix);
      } else {
        console.warn('Exception rule without preceding regular rule:', trimmedLine);
      }
    } else {
      publicSuffixes.push({ suffix, exceptionRules: [] });
    }
  }
  domainString = aSiteYouVisit.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '');
  domainInfo = parseDomain(domainString, publicSuffixes);
  fetchCodeForPattern(lookup);
  return domainInfo;
}

function parseDomain(domain, publicSuffixes) {
  const parts = domain.split('.').reverse();
  const suffix = getSuffix(parts, publicSuffixes);
  if (suffix == null) return null
  const suffixSize = suffix.split('.').length;
  const suffixLessParts = parts.reverse().slice(suffixSize);
  const subdomains = suffixLessParts.slice(1);
  return {
    domain: domain,
    subdomains: subdomains,
    suffix: suffix
  };
}

function getSuffix(parts, publicSuffixes) {
    let domainParts = parts.reverse();
    let longestMatch = null;
    for (let i = 0; i < domainParts.length; i++) {
      const suffix = domainParts.slice(i).join('.');
      const match = publicSuffixes.find(ps => ps.suffix == suffix);
      if (match) {
        if (!longestMatch || suffix.length > longestMatch.length) {
          longestMatch = match;
        }
      }
    }
    if (longestMatch !== null) return longestMatch.suffix;
    return null
}

var coded;
function lookupDomainHash(domain, lookup){
    if (domainInfo == null) return null
    domainString = domainInfo.domain
    hashforsite = lookup[domainString];
    if (hashforsite === undefined && domainInfo.subdomains.length){
        domainString = domainInfo.domain.split('.').slice(-2).join('.');
        hashforsite = lookup[domainString];
    }
    // console.log(hashforsite)
    return JSON.stringify({
        "sourceString": domainString.replace(/\./g,""), 
        "domainString": domainString, 
        "subdomains": domainInfo.subdomains,
        "hashforsite": hashforsite
    });
}

function fetchIndex(){
    browser.storage.local.get(function(localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        if ((localdata.time + 480000) < now) allowUpdate = true;
        if (debug) console.log(localdata);
        if (debug && !IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + aSiteWePullAndPushTo);
        if (debug && IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
        updateJSON = (IVLocalIndex) ? new Request(localIndex, init) : new Request(aSiteWePullAndPushTo + "/index.json", init); 
        // Prevent page load
        blockCheck();
        console.log("heythere");
        if (allowUpdate) fetch(updateJSON)
            .then(response => response.json())
            .then(data => browser.storage.local.set({ "data": data }))
            .then(browser.storage.local.set({ "time": now }));
    });
}


// Mode 0 is Desktop, Mode 1 is mobile
// Bubble Mode 0 is bubble, 1 is no bubble, 2 is no bubble or bar

function processDomain(pattern) {
  globalCode = pattern;
  createObjects();
  return lookup[pattern];
}

function domainChecker(domains, lookupList){
    try {
        if (lookupList[sourceString]) return processDomain(sourceString)
    } catch(e){
        fetchIndex()
        if (lookupList[sourceString]) return processDomain(sourceString)
    }
    try {

    for (const domain of domains) {
        const pattern = domain.split('.').join('');
        const check = lookupList[pattern];
        if (check) {
          return check;
        }
      }
    } catch(e){}
	return undefined
}

function fetchCodeForPattern(lookup) {
    bgjson = lookupDomainHash(aSiteYouVisit, lookup);
    if (bgjson == null) return null
    bgresponse = JSON.parse(bgjson);
    sourceString = bgresponse['sourceString'];
    domainString = bgresponse['domainString'];
    hashforsite = bgresponse['hashforsite'] ? bgresponse['hashforsite'] : false;
    var pattern = "/" + sourceString + "/";
    if (debug == true) console.log("[ IV ] " + domainString + " : " + hashforsite + " : " + pattern);
    browser.storage.local.get("data", function(data) {
        try {
            fetch(new Request(localHash, init))
				.then(response => response.json())
				.then(subdata => subdata[hashforsite])
				.then(possibileDomains => domainChecker(possibileDomains, data.data))
        } catch {
            try {
                fetch(new Request(localReplace, init))
                    .then(response => response.json())
                    .then(data, function(data) {
                        if (data[pattern]) {
                            return data[pattern]["t"].replace(/\//g, '');
                        }
                    });
            } catch {
                return;
            }
        }
    });
    return coded;
}

const loginCheck = async () => {                                                
        try{                                                                    
        postURL = `${voteUrl}/auth/am-i-logged-in`                            
        headers = new Headers({                                                 
                "content-type": 'application/json'                              
        });                                                                     
                                                                                
        const dataf = await fetch(postURL, {                                    
            method: "GET",                                                      
            headers: headers,                                                   
            credentials: 'include',                                             
        })                                                                      
        const response = await dataf.json()                                     
        if (response.hasOwnProperty("username")){                                
            const username = response.username;
            console.log(`Logged in as ${username}/${response.pretty_name}`)
            browser.storage.local.set({ "username": username, "pretty_name": response.pretty_name });
            console.log(browser.storage.local.get())
        }
        } catch (e){                                                            
            //console.log(e)                                                      
            var username;
            browser.storage.local.get("username", function(storedName) {
                username = storedName.username;
                if (username != undefined){
                    browser.storage.local.remove("username")
                    browser.storage.local.remove("pretty_name")
                    console.log(`[ IV ] "${username}" logged out of extension`)
                } else {
                    console.log(`not logged in`)
                }
            });
        }                                                                       
}      

if (aSiteYouVisit.includes(voteUrl)){
    console.log("[ IV ] Assets Site")
    loginCheck();

}

var changeMeta = document.createElement("meta");
changeMeta.setAttribute('http-equiv', "Content-Security-Policy");
changeMeta.setAttribute("content", "upgrade-insecure-requests");

document.addEventListener('fullscreenchange', function() {
    var isFullScreen = document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen || (document.msFullscreenElement != null);
    floating = document.getElementById("invisible-voice");
    floating.style.visibility = (isFullScreen) ? 'hidden' : 'visible';
});

var oldNetworkDistance;
var Loaded = false;
var addingId = '#'
let resize = function(x) {
    if (debug) console.log(x)
  if (typeof open == 'undefined') return;
  if (mode === 1) return;

  // Set default value for x
  if (typeof x === 'undefined') x = "";

  // Transition properties
  open.style.transition = "right 0.2s";
  iframe.style.transition = "width 0.2s";
  open.style.transform = "translateX(16px)";

  // Handle the different distance scenarios
  if (x === "close") {
    distance = 0;
    iframe.src = "about:blank";
    Loaded = false;

    // Handle notification shade if it exists
    let notificationShade = document.getElementById("IVNotification");
    if (notificationShade) {
      notificationShade.style.opacity = 1;
    }

    open.style.transform = "translateX(0px)";
    open.style.transition = "transform 0.2s";
    iframe.style.transition = "none";
  } else if (x === "network") {
    oldNetworkDistance = distance;
    distance = 840;
  } else if (distance === 160) {
    distance = 640;
  } else if (x === "oldnetwork"){
    distance = oldNetworkDistance;
  } else {
    distance = 160;
  }

  if (x !== "close") {
    // Handle notification shade if it exists
    let notificationShade = document.getElementById("IVNotification");
    if (notificationShade) {
      notificationShade.style.opacity = 0;
    }
  }


  if (x === "load" && !Loaded) {
    ourdomain = `${aSiteWePullAndPushTo}/db/${globalCode}/`
    ourdomain += "?date=" + Date.now() + "&vote=true";
    if (loggedIn) ourdomain += `&username=${pretty_name}`;
	if (addingId != '#'){
	  ourdomain += addingId
	  distance = 640;
	}
    
    iframe.src = ourdomain;
    console.log(globalCode);
    Loaded = true;
  }
  // Set the right and width values
  open.style.right = distance + 'px';
  iframe.style.width = distance + 'px';
  if (debug) console.log(`${x}, ${distance}, ${oldNetworkDistance}`)
};

document.addEventListener('mouseup', function(event) {
    if (dontOpen != true) {
        // This is to reopen the box if it needs to be
        if (event.target.matches('#invisible-voice')) {
            var dismissData = {};
            dismissData[globalCode] = 0;
            browser.storage.local.set(dismissData);
            resize("load");
        };
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('#invisible-voice-button')) return;

        var timeNow = new Date;
        now = timeNow.getTime();
        // Don't follow the link
        event.preventDefault();

        // Log the clicked element in the console
        // console.log(event.target);
        var dismissData = {};
        distance = 0;
        dismissData[globalCode] = now;
        browser.storage.local.set(dismissData);
        // console.log("[ Invisible Voice ]: Dismiss id ", globalCode);
        resize();
        open.style.right = distance + buttonOffsetVal + 'px';
    }
    dontOpen = false;
});

var distance = 0;
function blockCheck() {
    if (debug) console.log("Block Check");
    browser.storage.local.get(function(localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
    });
    // console.log(domainString);
    if (blockedHashes.includes(hashforsite)) {
        // lookup hash
        fetch(new Request(localHash, init))
            .then(response => response.json())
            .then(data => data[hashforsite]);
        // .then(global => console.log(global));
        // console.log(domainString);
        window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
    };
}

browser.runtime.onMessage.addListener(msgObj => {
    if (msgObj == "InvisibleVoiceBlockCheck") {
        if (aSiteYouVisit != window.location.href) blockCheck();
    } else {
        if (debug == true) console.log(msgObj);
    }
    if (msgObj == "InvisibleVoiceRefresh") {
        ["invisible-voice-floating"].forEach(function(id) {
            try {
                document.getElementById(id).remove();
            } catch (e) {
                if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);
            };
        });
    }
    if (Object.keys(msgObj)[0] == "InvisibleVote") {
        objectkey = Object.keys(msgObj)[0];
        if (debug == true) console.log(msgObj[objectkey]);
        voteStatus = msgObj[objectkey]["status"];
        var message = {
            message: "VoteUpdate",
            voteStatus: msgObj[objectkey]["status"],
            utotal: msgObj[objectkey]["up_total"],
            dtotal: msgObj[objectkey]["down_total"]
        };
        iframe.contentWindow.postMessage(message, '*');
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceReblock") {
        objectkey = Object.keys(msgObj)[0];
        setTimeout(function() {
            hashtoadd = msgObj[objectkey];
            browser.storage.local.get(function(localdata) {
                blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
            });
            blockedHashes.push(hashtoadd);
            browser.storage.local.set({
                "blockedHashes": blockedHashes
            });
            if (debug == true) console.log("block: ", hashtoadd);
            if (debug == true) console.log("block: ", blockedHashes);
        }, 1000);
    }
    if (msgObj == "InvisibleVoiceOff") {
        ["Invisible", "invisible-voice-floating"].forEach(function(id) {
            try {
                document.getElementById(id).remove();
            } catch (e) {
                if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);
            };
        });
    }
});

level2 = ['wikipedia-first-frame',
    'isin ssd',
    'isin fas',
    'mbfc-header',
    'yahoo',
    'similar-site-wrapper',
    'glassdoor',
    'social-wikidata',
    'small-wikidata',
    'trust-pilot',
    'wikipedia-infocard-frame',
    'disclaimer',
    'settings'
];

function handleError(e){
    console.log(e)
}

function forwardVotes(x){
    if (debug == true) console.log(x);
    voteStatus = x["status"];
    var message = {
        message: "VoteUpdate",
        voteStatus: x["status"],
        utotal: x["up_total"],
        dtotal: x["down_total"]
    };
    iframe.contentWindow.postMessage(message, '*');
}
function forwardPosts(x){
    if (debug == true) console.log(x);
    voteStatus = x["status"];
    utotal = ( x["up_total"] == undefined   ) ? x["utotal"]   : x["up_total"];
    dtotal = ( x["down_total"] == undefined ) ? x["dtotal"] : x["down_total"];
    ptotal = ( x["comment_total"] == undefined ) ? 0 : x["comment_total"];
    var message = {
        message: "ModuleUpdate",
        location: x["location"],
        voteStatus: x["status"],
        up_total: utotal, 
        down_total: dtotal, 
        comment_total: ptotal,
        top_comment: x["top_comment"],
    };
    iframe.contentWindow.postMessage(message, '*');
}
function forwardPost(x){
    if (debug == true) console.log(x);
    utotal = ( x["up_total"] == undefined   ) ? x["utotal"]   : x["up_total"];
    dtotal = ( x["down_total"] == undefined ) ? x["dtotal"] : x["down_total"];
    ptotal = ( x["post_total"] == undefined ) ? 0 : x["post_total"];
    messageType = (x["topLevel"] == true) ? "PostUpdateTL" : "PostUpdate";
    comment = (messageType == "PostUpdate" && x["comment"])? true : false;
    var message = {
        message: messageType,
        location: x["location"],
        up_total: utotal, 
        down_total: dtotal, 
        comment_total: ptotal,
        author: x["author"],
        content: x["content"],
        comment: comment,
        uid: x["uid"]
    };
    iframe.contentWindow.postMessage(message, '*');
}

function forwardVote(x){
    if (debug == true) console.log(x);
    voteStatus = x["status"];
    var message = {
        message: "VoteUpdate",
        voteStatus: x["status"],
        utotal: x["up_total"],
        dtotal: x["down_total"]
    };
    iframe.contentWindow.postMessage(message, '*');
}
var graphOpen = false;
window.addEventListener('message', function (e) {
  if (e.data.type === undefined) return;

  if (debug) console.log(e.data.type + " Stub " + e.data.data);

  switch (e.data.type) {
    case 'IVLike':
      if (e.data.data != '') {
        if (debug) console.log(voteStatus);
        const likeMessage = voteStatus === "up" ? "InvisibleVoiceUnvote" : "InvisibleVoiceUpvote";
        browser.runtime.sendMessage({ [likeMessage]: hashforsite });
      }
      break;

    case 'IVDislike':
      if (e.data.data != '') {
        if (debug) console.log(e.data.type + " Stub");
        const dislikeMessage = voteStatus === "down" ? "InvisibleVoiceUnvote" : "InvisibleVoiceDownvote";
        browser.runtime.sendMessage({ [dislikeMessage]: hashforsite });
      }
      break;

    case 'IVBoycott':
      if (e.data.data != '') {
        blockedHashes.push(hashforsite);
        browser.storage.local.set({ "blockedHashes": blockedHashes });
        aSiteYouVisit = window.location.href;
        window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
      }
      break;
    case 'IVGetPost':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleGetPost": e.data.data}) 
            sending.then(forwardPost, handleError)
          }
      break;
    case 'IVMakePost':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleMakePost": e.data.data}) 
            sending.then(handleError, handleError)
          }
      break;
    case 'IVPostStuff':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleModuleInfo": e.data.data}) 
            sending.then(forwardPosts, handleError)
          }
      break;
    case 'IVPostVoteUp':
    case 'IVPostVoteDown':
    case 'IVPostVoteUnvote':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleModuleVote": e.data.data, "type": e.data.type}) 
            sending.then(forwardPosts, handleError)
          }
      break;


    case 'IVVoteStuff':
      if (e.data.data != '') {
          console.log(`IVVOTESTUFF ${e.data.data}`)
          if (voteCode == undefined){
              voteCode = e.data.data;
              console.log("VoteCodeSet")
              const sending = browser.runtime.sendMessage({"InvisibleVoteTotal": voteCode}) 
              sending.then(forwardVotes, handleError)
          } else {
              var command;
              if (e.data.data == "up"){
                    command = "InvisibleVoteUpvote";
              } else if (e.data.data == "down") {
                    command = "InvisibleVoteDownvote";
              } else if (e.data.data == "un"){
                    command = "InvisibleVoteUnvote";
              }
              message = {}
              message[command] = voteCode
              const sending = browser.runtime.sendMessage(message) 
              sending.then(forwardVote, handleError)
              
          }
      }
      break;

    case 'IVClicked':
      if (e.data.data != '' && e.data.data != 'titlebar') {
        if (debug) console.log("resize stub " + e.data.data, hashforsite);
        if (level2.includes(e.data.data)) {
          if (debug) console.log("level2 resize");
          resize();
        }
        if (e.data.data == 'antwork' || e.data.data == 'graph-box') {
          resize("network");
        } else {
          if (e.data.data == 'back') {
            resize();
          } else if (e.data.data == 'unwork') {
            resize("oldnetwork");
          } else {
            if (distance === 160) resize();
          }
        }
      }
      break;

    case 'IVDarkModeOverride':
      if (debug) console.log("DarkMode stub", e.data.data);
      break;

    case 'IVIndexRefresh':
      fetchIndex();
      break;

    case 'IVNotificationsCacheClear':
      if (debug) console.log("NotCacheClear stub", e.data.data);
      browser.storage.local.set({ "siteData": {} });
      browser.storage.local.set({ "userPreferences": defaultUserPreferences });
      if (notifications == "true") dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotificationsPreferences':
      if (debug) console.log("UserPreference stub", e.data.data);
      browser.storage.local.set({ "userPreferences": e.data.data });
      break;

    case 'IVNotificationsTags':
      if (debug) console.log("Tags stub", e.data.data);
      browser.storage.local.set({ "notificationTags": e.data.data });
      if (notifications == "true") dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotifications':
      if (debug) console.log("Notifications stub", e.data.data);
      browser.storage.local.set({ "notifications": e.data.data });

      if (e.data.data == "true") {
        notificationsDismissed = false;
        if (debug) console.log("notifications were " + notifications);

        if (document.getElementById("IVNotification") === null) {
          enableNotifications();
        }

        notifications = "true";
      } else {
        if (notifications == "true") dismissNotification();
        notifications = "false";
      }
      break;

    case 'IVKeepOnScreen':
      if (debug) console.log("keep on screen stub", e.data.data);
      if (e.data.data == "true") {
        distance = 0;
        resize("load");
      }
      break;
    case 'IVSettingsChange':
      console.log("Settings Saved")
      browser.storage.local.set({"settings_obj": JSON.stringify(e.data.data)});
      processSettingsObject();
      break;

    case 'IVClose':
      resize("close");
      break;
  }
});

// Make the DIV element draggable:

function dragElement(elmnt) {
    if (debug) console.log(elmnt);
    if (debug) console.log("bobble enabled");
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    //if (document.getElementById(elmnt)) {
        // if present, the header is where you move the DIV from:
     //   document.getElementById(elmnt).onmousedown = dragMouseDown;
    //    document.getElementById(elmnt).ontouchstart = dragMouseDown;
    //} else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;
    //}

    function dragMouseDown(e) {
        if (debug) console.log("bobble mousedown");
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        if (debug) console.log(e);
        if (e.type != "touchstart"){
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            pos3 = e.clientX;
            pos4 = e.clientY;
        } else {
            document.ontouchend = closeDragElement;
            // call a function whenever the cursor moves:
            document.ontouchmove = elementDrag;
            console.log(e.changedTouches[0].clientX)
            pos3 = e.changedTouches[0].clientX;
            pos4 = e.changedTouches[0].clientY;
        }
    }

    function elementDrag(e) {
        dontOpen = true;
        e = e || window.event;
        if (e.type != "touchmove"){
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
        } else {
            pos1 = pos3 - e.changedTouches[0].clientX;
            pos2 = pos4 - e.changedTouches[0].clientY;
            pos3 = e.changedTouches[0].clientX;
            pos4 = e.changedTouches[0].clientY;
        }
        // calculate the new cursor position:
        // if (debug) console.log(pos1, pos2, pos3, pos4);
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	    elmnt.style.filter = "drop-shadow(.5rem .5rem 2rem #afa)";
	    elmnt.style.transition= "filter .5s transform .2s";
	    elmnt.style.transform = "scale(1,1)";
    }

    var id = null;

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.ontouchmove = null;
        clearInterval(id);
        id = setInterval(frame, 10);

        function frame() {
	    var pos2dir = 0,
	        pos1dir = 0;
	    var shadowColor = "inherit";
            if (pos2 > 0) {
                pos2 -= 1;
		pos2dir = 1;
            }
            if (pos2 < 0) {
                pos2 += 1;
		pos2dir = -1
            }

            if (pos1 > 0) {
                pos1 -= 1;
		pos1dir = 1;
            }
            if (pos1 < 0) {
                pos1 += 1;
		pos1dir = -1;
            }

            if (pos1 > 0 || pos1 < 0) elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            if (pos2 > 0 || pos2 < 0) elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

	    elmnt.style.transform = "scale(" + ( (pos1dir/4) + 1 ) + "," + ( (pos2dir/4) + 1 ) + ")";
	    elmnt.style.filter = "drop-shadow("+ pos1dir + "rem " + pos2dir + "rem 1rem" + shadowColor + ")";

            if (pos1 == 0 && pos2 == 0) {
                clearInterval(id);
		elmnt.style.filter = "drop-shadow(.25rem .25rem 1rem #afa)";
		elmnt.style.transform = "scale(1,1)";
            }
            if (elmnt.offsetTop > window.innerHeight || elmnt.offsetTop < 0) {
                pos2 *= -1;
	    	shadowColor = "#faa";
            }
            if (elmnt.offsetLeft > window.innerWidth || elmnt.offsetLeft < 0) {
                pos1 *= -1;
	    	shadowColor = "#faa";
            }

	    elmnt.style.transition = "filter .1s";
        }
        var topOffset = elmnt.offsetTop / window.innerHeight;
        var leftOffset = elmnt.offsetLeft / window.innerWidth;
        var placestore = {};
            // console.log("[ Invisible Voice ]: loading loc" + pos)
            if (topOffset > 0.95) topOffset = 0.9;
            if (topOffset < 0) topOffset = 0.1;
            if (leftOffset > 0.95) leftOffset = 0.9;
            if (leftOffset < 0) leftOffset = 0.1;
            elmnt.style.top = (window.innerHeight * topOffset) + "px";
            elmnt.style.left = (window.innerWidth * leftOffset) + "px";

        placestore['newplace'] = topOffset + "," + leftOffset;
        browser.storage.local.set(placestore);
    }
}

function boycott() {
    aSiteYouVisit = window.location.href;
    window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
}

function startDataChain(lookup){
    processSettingsObject().then(fetch(new Request(psl, init))
        .then(response => parsePSL(response.body, lookup)));
}


function handleNotificationClick(event){
	if ( mode == 1 ){
		return;
	}
    ourNode = event.target
    if (ourNode.classList.contains("IVNotItem")){} else{
        ourNode = event.target.parentNode
    }
	addingId = `#${idLookup[ourNode.getAttribute("data-infotype")]}`
	console.log(idLookup[ourNode.getAttribute("data-infotype")])
    var dismissData = {};
    dismissData[globalCode] = 0;
    browser.storage.local.set(dismissData);
    resize("load");
}

function addItemToNotification(event, labelName = "BaddyScore", score = "91", isSS = false) {
  if (notificationsDismissed) return;

  try {
    const newItem = document.createElement("div");
    newItem.classList.add("IVNotItem");
    newItem.onclick = handleNotificationClick;
    if (isSS) newItem.classList.add("IVNotItemSS");
    newItem.innerHTML = `<h1>${labelName}</h1><h2${isSS ? ' style="font-size:1em"' : ''}>${score}</h2>`;
    newItem.setAttribute("data-infotype", labelName)
    notificationShade.appendChild(newItem);

    if (!document.getElementById("IVNotification")) {
      document.documentElement.appendChild(notificationShade);
    }

    const ivNotItems = document.getElementsByClassName("IVNotItem");
    if (ivNotItems.length > 0) {
      document.getElementsByClassName("IVHoverNotice")[0].style.visibility = "visible";
    }
  } catch (e) {}
}

function dismissNotification(){
    notificationsDismissed = true;
    if (document.getElementById("IVNotification") != null)
        document.getElementById("IVNotification").remove();
    if (debug) console.log("notification dismissed")
}

var lastScrollTop = 0;
var showButton = true;
window.addEventListener("scroll", function(){
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (document.getElementById("InvisibleVoice-bobble") != undefined){
    if (st > lastScrollTop) {
       if (showButton){
            bobble = document.getElementById("InvisibleVoice-bobble");
           bobble.style.display = "none";
           showButton = false;
       }
    } else if (st < lastScrollTop) {
       if (!showButton){
            bobble = document.getElementById("InvisibleVoice-bobble");
           showButton = true;
           bobble.style.display = "block";
       }
    } 
    }
    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);



fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(lookup => startDataChain(lookup))
