var query = {
    active: true,
    currentWindow: true
};
var iframe = document.getElementById("invisible-frame");
var testframe = document.getElementById("testout");
var defaultIndexURL = "https://test.reveb.la";
var aSiteWePullAndPushTo = defaultIndexURL;
var domainString = "";
var sourceString = "";
var debug = true;
var graphOpen = false;
var distance = 160;
var voting = true;
var mode = 0
const phoneRegex = /iPhone/i;
var voteStatus, hashforsite, currentTab;

if (phoneRegex.test(navigator.userAgent)){
    mode = 1;
}

function sendToPage(data){
    var msgObj = data;
    console.log(data);
    voteStatus = msgObj["status"];
    var message = {
        message: "VoteUpdate",
        voteStatus: msgObj["status"],
        utotal: msgObj["up_total"],
        dtotal: msgObj["down_total"]
    };
    if (debug == true) console.log(message);
    iframe.contentWindow.postMessage(message, '*');
}

function callback(tabs) {
    if (sourceString == "") {
        currentTab = tabs[0]; // there will be only one in this array
        var aSiteYouVisit = currentTab.url;
        var bgresponse;
        chrome.runtime.sendMessage( 
        {
            "IVHASH": aSiteYouVisit,
            "tabId": currentTab.id,
        }, function(response){
            bgresponse = JSON.parse(response);
            sourceString = bgresponse['sourceString'];
            domainString = bgresponse['domainString'];
            hashforsite = bgresponse['hashforsite'];
            var pattern = "/" + sourceString + "/";
            chrome.tabs.query(query, callback);
            console.log(sourceString);
            iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now().toString();
            if (mode == 0) iframe.style.width = distance + 'px';
            if (mode == 0) iframe.style.height = '100em';
            if (mode == 1) iframe.style.width = '100vw';
            if (mode == 1) iframe.style.height = '100vh';
        })
    }
    return true
}

var isSet = false;
let resize = function(x) {
    if(typeof(x)==='undefined') x = "";
    if (mode == 0) {
    if (isSet == false) {
        iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now();
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
    if (voting){
        (async () => {
        const response =  await chrome.runtime.sendMessage({ "InvisibleVoteTotal": hashforsite });
        sendToPage(response);
        })();
    }
    }
};

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

chrome.runtime.onMessage.addListener(msgObj => {
    console.log(msgObj, sender, sendResponse);
    if (Object.keys(msgObj)[0] == "InvisibleHash") {
        objectkey = Object.keys(msgObj)[0];
        if (debug == true) console.log(msgObj[objectkey]);
    }
})

window.addEventListener('message', function(e) {
    console.log(voteStatus);
    if (e.data.type == 'IVLike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (voteStatus == "up") {
            (async () => {
                const respond =  await chrome.runtime.sendMessage({ "InvisibleVoteUnvote": hashforsite });
                sendToPage(respond);
            })();
        } else {
            (async () => {
                const respond =  await chrome.runtime.sendMessage({ "InvisibleVoteUpvote": hashforsite });
                sendToPage(respond);
            })();
        }
    }
    if (e.data.type == 'IVDislike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (voteStatus == "down") {
            (async () => {
                const respond =  await chrome.runtime.sendMessage({ "InvisibleVoteUnvote": hashforsite });
                sendToPage(respond);
            })();
        } else {
            (async () => {
                const respond =  await chrome.runtime.sendMessage({ "InvisibleVoteDownvote": hashforsite });
                sendToPage(respond);
            })();
        }
    }
    if (e.data.type == 'IVClicked' && e.data.data != '') {
        if (debug == true) console.log("resize stub " + e.data.data);
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
iframe.addEventListener('load', function(e){
        (async () => {
        const response =  await chrome.runtime.sendMessage({ "InvisibleVoteTotal": hashforsite });
        sendToPage(response);
        })();
});

chrome.tabs.query(query, callback);
