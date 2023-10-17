// "Simple" code that gets the job done by Orange
//
var debug = false; var allowUpdate = true;
// Set up environment 
var aSiteWePullAndPushTo = "https://test.reveb.la";
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
var IVLocalIndex;
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

var aSiteYouVisit = window.location.href;
var buttonOffsetVal = 16;
var buttonOffset = buttonOffsetVal + "px";

var darkMode = false;
var backgroundColor = "#fff";
var textColor = "#343434";
var heavyTextColor = "#111";

var voteUrl = "https://assets.reveb.la";
var voteStatus;
var blockedHashes = [];

var IVBlock = false;
var bubbleMode = 0;

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
    "P": "TOS;DR"
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
    'wikidata_id': "w"
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

var notificationsToShow = false;
var notificationsDismissed = false;
function enableNotifications(){
    if (notificationsDismissed) return;
    notificationShade = document.createElement("section");
    notificationShade.id = "IVNotification";
    notificationShade.onclick = addItemToNotification;
    notificationOverlay = document.createElement("div");
    notificationOverlay.classList.add("IVNotOverlay");
    notivlogo = document.createElement("img");
    notivlogo.classList.add("IVNotLogo");
    notivlogo.src = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3e%3ccircle cx='20' cy='20' r='18' fill='none'/%3e%3cpath fill='%231A1A1A' d='M18.201 14.181h3.657v14.536a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817V14.181ZM18.201 10.547c0-1.003.819-1.817 1.829-1.817s1.828.814 1.828 1.817a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817Z'/%3e%3cpath fill='%231A1A1A' d='m10.318 21.634 1.292-1.285a1.836 1.836 0 0 1 2.586 0l8.402 8.351-2.585 2.57-9.696-9.636Z'/%3e%3cpath fill='%231A1A1A' d='M25.804 20.349a1.836 1.836 0 0 1 2.586 0l1.293 1.285-9.696 9.636-2.585-2.57 8.402-8.351Z'/%3e%3cpath fill='%231A1A1A' fill-rule='evenodd' d='M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20ZM20 37.46c9.643 0 17.46-7.817 17.46-17.46S29.643 2.54 20 2.54 2.54 10.357 2.54 20 10.357 37.46 20 37.46Z' clip-rule='evenodd'/%3e%3c/svg%3e"
    notificationOverlay.appendChild(notivlogo);
    hovernotice = document.createElement("div");
    hovernotice.classList.add("IVHoverNotice");
    hovernotice.innerHTML = "hover to see more";
    notificationOverlay.appendChild(hovernotice)
    ivnotclose = document.createElement("div");
    ivnotclose.classList.add("IVNotClose");
    ivnotclose.onclick = dismissNotification;
    ivnotclose.innerHTML = "+";
    notificationOverlay.appendChild(ivnotclose);
    notificationShade.appendChild(notificationOverlay);

    browser.storage.local.get(function(localdata){
        const tags = localdata.notificationTags.split('').reverse().join('') || '';
        var matchedTags = [];
        const siteTags = localdata.data[domainString.replace(/\./g,"")]["k"];
        for (const tag of tags) {
           if (siteTags.includes(tag)) {
              matchedTags += tag;
           }
        }
        // Get data
        console.log("notifications are on" + localdata.data[domainString.replace(/\./g,"")]["k"]);
        if (matchedTags.length > 0){
        currentState = localdata.siteData || {};
        if (currentState[domainString.replace(/\./g, "")]){
            data = currentState[domainString.replace(/\./g,"")];
            for (const tag of matchedTags){
                // Display data
                addItemToNotification(null, tagLookup[tag], data[tag]);
            }
            console.log("local notification data");
        } else {
            requestList = [domainString.replace(/\./g,"")]
            // Generate 8 different posabilites  
            const indexList = localdata.data;
            const tagArray = [...matchedTags];
            if (typeof indexList === 'object' && indexList !== null ){
                const filteredList = Object.keys(indexList).filter(key => {
                    const item = indexList[key];
                    if (typeof item.k === 'string'){
                    return tagArray.some(substring =>
                        item.k.includes(substring)
                    )
                    }
                })
                while (requestList.length < 9){
                    const randomIndex = Math.floor(Math.random() * filteredList.length);
                    if (!requestList.includes(filteredList[randomIndex])){
                        requestList.push(filteredList[randomIndex]);
                    }
                }
            }
            shuffleArray(requestList);
            for (const domain of requestList){
                dataRequest = new Request(aSiteWePullAndPushTo + "/db/" + domain + "/index.json", init); 
                fetch(dataRequest)
                    .then(response => response.json())
                    .then(function(data) {
                        try {
                            currentState = broswer.storage.local.get("siteData");
                        } catch (e) {}
                        currentState[domain] = data.data;
                        browser.storage.local.set({ "siteData": currentState });
                        if (domain == domainString.replace(/\./g,"")){
                            for (const tag of matchedTags){
                                // Display data
                                addItemToNotification(null, tagLookup[tag], data.data[tag]);
                            }
                        }
                    })
                }
            }
        }
    })
    // browser.storage.local.get("siteData").then(data => console.log(data));
    // addItemToNotification(null, "Example", "B+");

}
var notifications = false;
function createObjects() {
    // if (aSiteYouVisit == "http://example.com/") enableNotifications();
    browser.storage.local.get(function(localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        blockCheck();
        if (localdata.bobbleMode == "true") {
            bubbleMode = 1;
        }
        notifications = localdata.notifications;
        if (notifications == "true") {
            enableNotifications();
        }
    });
    if (debug) console.log("[ Invisible Voice ]: creating " + mode);
    if ((bubbleMode == 0 && mode == 1) || debug == true){
        browser.storage.local.get(function(localdata) {
            if (localdata.bobbleMode != "true") {
                bobble = document.createElement("div");
                buttonSize = 40;
                bobble.style.cssText = `bottom: 10px;left: 60px;position:fixed;padding:0;margin:0;
                border-radius:0;width:${buttonSize}px;background-color: transparent;background-image:url(${buttonSvg});object-fit:1;height:${buttonSize}px;background-size: ${buttonSize}px ${buttonSize}px;`;
                // bobble.setAttribute("onclick", this.remove());
                bobble.id = "InvisibleVoice-bobble";

                document.documentElement.appendChild(bobble);
                dragElement(document.getElementById("InvisibleVoice-bobble"));
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
    if (mode == 1) return;
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
    console.log(hashforsite)
    return JSON.stringify({
        "sourceString": domainString.replace(/\./g,""), 
        "domainString": domainString, 
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
function domainChecker(domains, lookupList){
	let domainList = domains
    try {
        if (lookupList[sourceString]){
            globalCode = sourceString;
            createObjects();
            return lookup[sourceString];
        };
    } catch(e){
        fetchIndex()
        if (lookupList[sourceString]){
            globalCode = sourceString;
            createObjects();
            return lookup[sourceString];
        };
    }
	for (domain in domains){
		let pattern = domains[domain].split('.').join('')
		check = lookupList[pattern]
		if (check){
			sourceString = pattern;
			globalCode = pattern;
            createObjects();
			return check;
		}
	}
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

var Loaded = false;
let resize = function(x) {
    if(typeof(x)==='undefined') x = "";
    if (mode == 1) return;
    open.style.transform = "translateX(16px)";
    open.style.transition = "right 0.2s";
    iframe.style.transition = "width 0.2s";
    if (distance == 0) {
        distance = 160;
    } else if (distance == 160) {
        distance = 640;
    } else {
        distance = 160;
    }
    if (x == "close") {
        distance = 0;
        iframe.src = "about:blank";
        Loaded = false;
        notificationShade = document.getElementById("IVNotification");
        if (notificationShade === null){
        }else{
            console.log(notificationShade)
            notificationShade.style.opacity = 1;
        }
        open.style.transform = "translateX(0px)";
        open.style.transition = "transform 0.2s";
        iframe.style.transition = "none";
    } else {
        if (notificationShade === null){
        }else{
            notificationShade.style.opacity = 0;
        }
    }
    if (x == "network") distance = 840;
    if (iframe === undefined) return
    open.style.right = distance + 'px';
    iframe.style.width = distance + 'px';
    if (x == "load" && !Loaded) {
        ourdomain = aSiteWePullAndPushTo + "/db/" + globalCode + "/" + "?date=" + Date.now() + "&vote=true";
        iframe.src = ourdomain;
		console.log(globalCode)
        Loaded = true;
    }
    if (distance > 160) browser.runtime.sendMessage({ "InvisibleVoteTotal": hashforsite });
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

var graphOpen = false;
window.addEventListener('message', function(e) {
    if (e.data.type === undefined) return
    if (debug == true) console.log(e.data.type + " Stub " + e.data.data);
    if (e.data.type == 'IVLike' && e.data.data != '') {
        if (debug == true) console.log(voteStatus);
        if (voteStatus == "up") {
            browser.runtime.sendMessage({
                "InvisibleVoiceUnvote": hashforsite
            });
        } else {
            browser.runtime.sendMessage({
                "InvisibleVoiceUpvote": hashforsite
            });
        }
    }
    if (e.data.type == 'IVDislike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (voteStatus == "down") {
            browser.runtime.sendMessage({
                "InvisibleVoiceUnvote": hashforsite
            });
        } else {
            browser.runtime.sendMessage({
                "InvisibleVoiceDownvote": hashforsite
            });
        }
    }
    if (e.data.type == 'IVBoycott' && e.data.data != '') {
        blockedHashes.push(hashforsite);
        browser.storage.local.set({
            "blockedHashes": blockedHashes
        });
        aSiteYouVisit = window.location.href;
        window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
    }
    if (e.data.type == 'IVClicked' && e.data.data != '' && e.data.data != 'titlebar') {
        if (debug == true) console.log("resize stub " + e.data.data, hashforsite);
        if (level2.includes(e.data.data)) {
            if (debug == true) console.log("level2 resize");
            resize();
        }
        if (e.data.data == 'antwork' || e.data.data == 'graph-box') {
            resize("network");
        } else {
            if (e.data.data == 'back') {
                resize();
            } else {
                if (distance == 160) resize();
            };
        };
    }
    if (e.data.type == 'IVDarkModeOverride') {
        if (debug == true) console.log("DarkMode stub", e.data.data);
    }
    if (e.data.type == 'IVNotificationsTags') {
        console.log("Tags stub", e.data.data);
        browser.storage.local.set({ "notificationTags": e.data.data })
        if (notifications == "true") dismissNotification();
        notificationsDismissed = false;
        enableNotifications();
    }

    if (e.data.type == 'IVNotifications') {
        console.log("Notifications stub", e.data.data);
        browser.storage.local.set({"notifications": e.data.data })
        if (e.data.data == "true") {
            notificationsDismissed = false;
            console.log("notifications were " + notifications);
            if(document.getElementById("IVNotification") == null){
                enableNotifications();
            }
            notifications = "true";
        } else {
            if (notifications == "true") dismissNotification();
            notifications = "false";
        }
    }
    if (e.data.type == 'IVKeepOnScreen') {
        if (debug == true) console.log("keep on screen stub", e.data.data);
        if (e.data.data == "true") {
            distance = 0;
            resize("load");
        }
    }

    if (e.data.type == 'IVClose') resize("close");
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
    fetch(new Request(psl, init))
        .then(response => parsePSL(response.body, lookup));
}


function addItemToNotification(event, labelName = "BaddyScore" , score = "91" ){
    if (notificationsDismissed) return;
    try {
        newItem = document.createElement("div");
        newItem.classList.add("IVNotItem");
        newItem.innerHTML = `<h1>${labelName}</h1><h2>${score}</h2>`;
        notificationShade.appendChild(newItem);
        if(document.getElementById("IVNotification") == null)
                document.documentElement.appendChild(notificationShade);

    } catch(e)  {
    }
}
function dismissNotification(){
    notificationsDismissed = true;
    if (document.getElementById("IVNotification") != null)
        document.getElementById("IVNotification").remove();
    console.log("notification dismissed")
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
