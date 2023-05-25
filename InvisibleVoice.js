// Simple code that gets the job done by Orange
//
var debug = false;
// Set up environment 
var aSiteWePullAndPushTo = "https://test.reveb.la";
var aSiteYouVisit = window.location.href;
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
var IVEnabled, IVLocalIndex;

var svgloc = chrome.runtime.getURL('logo.svg');
var localReplace = chrome.runtime.getURL('replacements.json');
var localHash = chrome.runtime.getURL('hashtosite.json');
var localSite = chrome.runtime.getURL('sitetohash.json');

var found = false;
var isInjected = false;
var dontOpen = false;
var level = 0;

// var showButton, IVScoreEnabled;
// var propertyOrder;

var iframe, open; // The Elements we inject
var globalCode, code, hashforsite;
var sourceString = aSiteYouVisit.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/\./g, "");
var domainString = aSiteYouVisit.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0];


var buttonOffsetVal = 16;
var buttonOffset = buttonOffsetVal + "px";
var darkMode = false;
var backgroundColor = "#fff";
var textColor = "#343434";
var heavyTextColor = "#111";

var voteUrl = "https://assets.reveb.la";
var voteStatus;

var mode = 0
const phoneRegex = /iPhone/i;

if (phoneRegex.test(navigator.userAgent)){
    mode = 1;
    console.log("[ Invisible Voice ]: phone mode")
}

getFromLocalData();
if (mode != 1) fetchCodeForPattern(sourceString);

fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => data[domainString])
    .then(item => hashforsite = item)
    .then(hashforsite => console.log("[ IV ] " + domainString + " : " + hashforsite));

var blockedHashes = [];
var IVBlock = false;

if (window.matchMedia && !!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    if (debug) console.info('[ Invisible Voice ]: Dark Theme detected 🌒 ');
    darkMode = true;
    backgroundColor = "#343434";
    textColor = "#fff";
    heavyTextColor = "#AAA";
}


function getData() {
    if (mode != 1) {
    now = (new Date).getTime();
    chrome.storage.local.get(function(topSiteOfTheWeek) {
        if (!topSiteOfTheWeek.time) triggerUpdate();
        if ((topSiteOfTheWeek.time + 480000) < now) triggerUpdate();
    });
    chrome.storage.local.get("data", function(data) {
        try {
            var test = data.data[100];
        } catch (error) {
            triggerUpdate();
        }
        if (debug) console.log("[ Invisible Voice ]: Running - " + sourceString);
    });
    }
}
function getFromLocalData(){
    if (mode != 1) chrome.storage.local.get(function(localdata) {
        IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
        if (debug) console.log(localdata);
        // IVScoreEnabled = localdata.scoreEnabled ? true : false;
        // propertyOrder = localdata.propertyOrder ? localdata.propertyOrder : ["bcorp", "goodonyou", "glassdoor", "mbfc"];
        if (debug && !IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString());
        if (debug && IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
        updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
        if (IVEnabled) getData();
        // Prevent page load
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        blockCheck();
    });
}

function fetchIndex(updateJSON) {
    fetch(updateJSON)
        .then(response => response.json())
        .then(data => chrome.storage.local.set({
            "data": data
        }))
        .then(chrome.storage.local.set({
            "time": now
        }));
}

function triggerUpdate() {
    if (IVLocalIndex) {
        if (debug) console.log("[ Invisible Voice ]: LocalIndex");
        updateJSON = new Request(localIndex, init);
        fetchIndex(updateJSON);
        return
    }
    if (debug) console.log("[ Invisible Voice ]: Updating " + aSiteWePullAndPushTo);
    try {
        fetchIndex(updateJSON);
    } catch (error) {
        error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
    }
}

var coded;
function run(globalCoded) {
    try {
        chrome.storage.local.get(globalCoded, function(id) {
            timeSince = Object.values(id)[0];
            // showButton = ((timeSince < now) || timeSince < (now - 480000)) ? false : true;
            chrome.storage.local.get("data", function(data) {
                coded = data.data[globalCoded];
                if (debug) console.log("[ Invisible Voice ]: coded");
            });
            createObjects();
            appendObjects();
            inject(globalCoded);
        });
    } catch (error) {
        console.log("[ Invisible Voice ]: " + error);
    }
}

function fetchCodeForPattern(sourceString) {
    chrome.storage.local.get("data", function(data) {
        pattern = "/" + sourceString + "/";
        try {
            if (debug) console.log(data.data);
            coded = data.data[sourceString];
            if (!coded) throw "no";
            globalCode = sourceString;
            if (coded) run(globalCode);
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

function inject(code) {
    if (IVEnabled) {
        document.head.prepend(changeMeta);
        if (isInjected == false) {
            if (debug) console.log("[ Invisible Voice ]: Injected - " + code);
            // iframe.src = aSiteWePullAndPushTo + "/" + code + "/" + "?date=" + Date.now();
            isInjected = true;
            found = true;
            chrome.runtime.sendMessage("IVICON");
        }
    }
}

var isCreated = false
var isSet = false

// Mode 0 is Desktop, Mode 1 is mobile
function createObjects(value, type) {
    if (!IVEnabled) return;
    if (mode == 1) return;
    if (debug) console.log("[ Invisible Voice ]: creating ");

    open = document.createElement("div");
    open.id = "invisible-voice-floating";
    open.innerHTML = "<div id='invisible-voice-float' " +
        "style='position: fixed;" +
        "width: " + buttonOffset + " !important;" +
        "border:" + textColor + " solid 1px !important;" +
        "background:" + backgroundColor + ";" +
        "height:-webkit-fill-available;" +
        "display:flex;" +
        "right: 0;" +
        "margin: auto;" +
        "align-items:center;" +
        "justify-content: center;'" +
        "> < </div>";

    open.style.cssText = "z-index: 2147483646;" +
        "position: fixed;" +
        "color: " + textColor + ";" +
        "font-family: 'Roboto', sans-serif;" +
        "font-size: 16px;" +
        "text-align:center;" +
        "height:100vh;" +
        "top:0px;" +
        "width:" + buttonOffset + ";" +
        "background:#eee;" +
        "transition: right .2s;";


    if (isCreated) return;
    iframe = document.createElement("iframe");
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
    iframe.id = "Invisible";

    isCreated = true
};

function appendObjects() {
    if (debug) console.log("mode", mode);
    if (!IVEnabled) return;
    if (mode == 1) return;
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(open);
    resize("close");
    open.style.right = "0";
};

document.addEventListener('fullscreenchange', function() {
    var isFullScreen = document.fullScreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen || (document.msFullscreenElement != null);
    if (isFullScreen) {
        floating = document.getElementById("invisible-voice-floating");
        floating.style.visibility = 'hidden';
    } else {
        floating = document.getElementById("invisible-voice-floating");
        floating.style.visibility = 'visible';
    };
});

let resize = function(x) {
    if(typeof(x)==='undefined') x = "";

    if (mode == 1) return;
    if (isSet == false) {
        iframe.src = aSiteWePullAndPushTo + "/db/" + globalCode + "/" + "?date=" + Date.now();
        isSet = true;
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
    }
    if (x == "network") {
        distance = 840;
    }
    iframe.style.width = distance + 'px';
    if (distance > 160) {
        chrome.runtime.sendMessage({
            "InvisibleVoteTotal": hashforsite
        });
    }
};

document.addEventListener('mouseup', function(event) {
    if (dontOpen != true) {
        // This is to reopen the box if it needs to be
        if (event.target.matches('#invisible-voice-float')) {
            var dismissData = {};
            dismissData[globalCode] = 0;
            chrome.storage.local.set(dismissData);
            inject(globalCode);
            resize();
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
        chrome.storage.local.set(dismissData);
        // console.log("[ Invisible Voice ]: Dismiss id ", globalCode);
        resize();
        open.style.right = distance + buttonOffsetVal + 'px';
    }
    dontOpen = false;

});

var distance = 0;

function blockCheck() {
    if (!IVEnabled) return;
    chrome.storage.local.get(function(localdata) {
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
        window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
    };
}

chrome.runtime.onMessage.addListener(msgObj => {
    if (msgObj == "InvisibleVoiceBlockCheck") {
        if (aSiteYouVisit != window.location.href) {
            blockCheck();
        };
    } else {
        if (debug == true) console.log(msgObj);
    }
    if (msgObj == "InvisibleVoiceRefresh") {
        if (IVEnabled) {
            ["invisible-voice-floating"].forEach(function(id) {
                try {
                    document.getElementById(id).remove();
                } catch (e) {
                    if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);
                };
            });
        };
        isInjected = false;
        found = false;
        getFromLocalData();
        getData();
        fetchCodeForPattern(sourceString);
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
            chrome.storage.local.get(function(localdata) {
                blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
            });
            blockedHashes.push(hashtoadd);
            chrome.storage.local.set({
                "blockedHashes": blockedHashes
            });
            if (debug == true) console.log("block: ", hashtoadd);
            if (debug == true) console.log("block: ", blockedHashes);
        }, 1000);
    }
    if (msgObj == "InvisibleVoiceOff") {
        if (IVEnabled) {
            ["Invisible", "invisible-voice-floating", "invisible-voice-button"].forEach(function(id) {
                try {
                    document.getElementById(id).remove();
                } catch (e) {
                    if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);
                };
            });
        };
        isCreated = false;
        chrome.storage.local.get(function(localdata) {
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
            // console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString(), IVScoreEnabled.toString());
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
    if (e.data.type == 'IVLike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (debug == true) console.log(voteStatus);
        if (voteStatus == "up") {
            chrome.runtime.sendMessage({
                "InvisibleVoiceUnvote": hashforsite
            });
        } else {
            chrome.runtime.sendMessage({
                "InvisibleVoiceUpvote": hashforsite
            });
        }
    }
    if (e.data.type == 'IVDislike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (voteStatus == "down") {
            chrome.runtime.sendMessage({
                "InvisibleVoiceUnvote": hashforsite
            });
        } else {
            chrome.runtime.sendMessage({
                "InvisibleVoiceDownvote": hashforsite
            });
        }
    }
    if (e.data.type == 'IVBoycott' && e.data.data != '') {
        blockedHashes.push(hashforsite);
        chrome.storage.local.set({
            "blockedHashes": blockedHashes
        });
        aSiteYouVisit = window.location.href;
        window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
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
    if (e.data.type == 'IVClose') {
        resize("close");
    }
    if (e.data.type == 'IVDarkModeOverride') {
        if (debug == true) console.log("DarkMode stub", e.data.data);
    }
    if (e.data.type == 'IVKeepOnScreen') {
        if (debug == true) console.log("keep on screen stub", e.data.data);
        if (e.data.data == "true") {
            distance = 0;
            resize();
        }
    }
});
