// "Simple" code that gets the job done by Orange
//
var debug = true;
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

browser = chrome || broswer;

if (chrRegex.test(navigator.userAgent)) identifier = "fafojfdhjlapbpafdcoggecpagohpono"
if (frRegex.test(navigator.userAgent)) identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"
if (phoneRegex.test(navigator.userAgent)) mode = 1;

// Various Lookups
let localReplace = browser.runtime.getURL('replacements.json');
let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let buttonSvg = browser.runtime.getURL('button.svg');
let localIndex = browser.runtime.getURL('index.json');
var lookup = {}; 
fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => lookup = data)

var dontOpen = false;
var level = 0;

// The Elements we inject
var globalCode, code, hashforsite, domainString, sourceString, open, iframe;
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

function fetchIndex(){
    browser.storage.local.get(function(localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        if ((localdata.time + 480000) < now) allowUpdate = true;
        if (debug) console.log(localdata);
        if (debug && !IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + aSiteWePullAndPushTo);
        if (debug && IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
        updateJSON = (IVLocalIndex) ? new Request(aSiteWePullAndPushTo + "/index.json", init) : new Request(localIndex, init);
        // Prevent page load
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        blockCheck();
    });
    if (allowUpdate) fetch(updateJSON)
        .then(response => response.json())
        .then(data => browser.storage.local.set({ "data": data }))
        .then(browser.storage.local.set({ "time": now }));
}


// Mode 0 is Desktop, Mode 1 is mobile
// Bubble Mode 0 is bubble, 1 is no bubble, 2 is no bubble or bar
function createObjects() {
    if (debug) console.log("[ Invisible Voice ]: creating " + mode);
    if (bubbleMode == 0){
        bobble = document.createElement("div");
        buttonSize = 40;
        bobble.style.cssText = `bottom: 10px;left: 10px;position:fixed;padding:0;margin:0;
        border-radius:0;width:${buttonSize}px;background-color: transparent;background-image:url(${buttonSvg});object-fit:1;height:${buttonSize}px;background-size: ${buttonSize}px ${buttonSize}px;`;
        // bobble.setAttribute("onclick", this.remove());
        document.documentElement.appendChild(bobble);
    }
    if (mode == 1) return;
    iframe = document.createElement("iframe");
    open = document.createElement("div");
    open.id = "invisible-voice";
    open.style.cssText =
        `position: fixed; width: ${buttonOffset}!important;
         border:${textColor} solid 1px !important;
         background:${backgroundColor};
         height:inherit;
         height:-webkit-fill-available;
         display:flex; right: 0; top: 0; padding: 0; border-radius: 0;
         color: ${textColor}; margin: auto; align-items:center;
         justify-content: center;`;
    open.innerHTML = "<";
    iframe.id = "Invisible";
    iframe.style.cssText = "border:" + textColor + " solid 1px;" +
        "border-right: none;" +
        "overflow-y: scroll;" +
        "overflow-x: hidden;" +
        "right: 0;" +
        "width: 0px;" +
        "top:0;" +
        "height: 100vh;" +
        "z-index: 2147483647;" +
        "box-shadow: rgba(0, 0, 0, 0.1) 0 0 100px;" +
        "position: fixed;" +
        "background-color:" + backgroundColor + ";" +
        "transition:width .2s;";
    if (mode == 1) return;
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(open);
    resize("close");
    open.style.right = "0";
    if (mode == 0) iframe.style.width = distance + 'px';
    if (mode == 0) iframe.style.height = '100em';
};

var coded;
function lookupDomainHash(domain){
    domainString = domain.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '');
    hashforsite = lookup[domainString];
    if (hashforsite === undefined)
        if (domainString.split('.').length > 2){
           domainString = domainString.split('.').slice(1).join('.');
           hashforsite = lookup[domainString];
        }
    return JSON.stringify({
        "sourceString": domainString.replace(/\./g,""), 
        "domainString": domainString, 
        "hashforsite": hashforsite
    });
}

function fetchCodeForPattern() {
    bgresponse = JSON.parse(lookupDomainHash(aSiteYouVisit));
    sourceString = bgresponse['sourceString'];
    domainString = bgresponse['domainString'];
    hashforsite = bgresponse['hashforsite'] ? bgresponse['hashforsite'] : false;
    var pattern = "/" + sourceString + "/";
    if (debug == true) console.log("[ IV ] " + domainString + " : " + hashforsite + " : " + pattern);
    // iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now().toString();

    browser.storage.local.get("data", function(data) {
        try {
            coded = data.data[sourceString];
            if (!coded) throw "no";
            globalCode = sourceString;
            // timeSince = Object.values(id)[0];
            // showButton = ((timeSince < now) || timeSince < (now - 480000)) ? false : true;
            if (coded) {
                document.head.prepend(changeMeta);
                createObjects();
                browser.runtime.sendMessage("IVICON");
            }
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
    floating = document.getElementById("invisible-voice-floating");
    floating.style.visibility = (isFullScreen) ? 'hidden' : 'visible';
});

var Loaded = false;
let resize = function(x) {
    if(typeof(x)==='undefined') x = "";
    if (mode == 1) return;
    if (x == "load" && !Loaded) {
        ourdomain = aSiteWePullAndPushTo + "/db/" + globalCode + "/" + "?date=" + Date.now();
        iframe.src = ourdomain;
        Loaded = true;
    }
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
    }
    if (x == "network") distance = 840;
    iframe.style.width = distance + 'px';
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
    if (e.data.type == 'IVKeepOnScreen') {
        if (debug == true) console.log("keep on screen stub", e.data.data);
        if (e.data.data == "true") {
            distance = 0;
            resize("load");
        }
    }

    if (e.data.type == 'IVClose') resize("close");
});

fetchCodeForPattern();
