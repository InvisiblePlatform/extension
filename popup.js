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
var voting = false;
var mode = 0
const phoneRegex = /iPhone/i;

if (phoneRegex.test(navigator.userAgent)){
    mode = 1;
}

function callback(tabs) {
    if (sourceString == "") {
        var currentTab = tabs[0]; // there will be only one in this array
        var aSiteYouVisit = currentTab.url;
        sourceString = aSiteYouVisit.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/\./g, "");
        domainString = aSiteYouVisit.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0];
        var pattern = "/" + sourceString + "/";
        chrome.tabs.query(query, callback);
        console.log(sourceString);
        iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now().toString();
        if (mode == 0) iframe.style.width = distance + 'px';
        if (mode == 0) iframe.style.height = '100em';
        if (mode == 1) iframe.style.width = '100vw';
        if (mode == 1) iframe.style.height = '100vh';

    }
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
    if (distance > 160) {
        chrome.runtime.sendMessage({
            "InvisibleVoteTotal": hashforsite
        });
    }
    } else {
if (voting){
            chrome.runtime.sendMessage({
                "InvisibleVoteTotal": hashforsite
            });}
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
window.addEventListener('message', function(e) {
    if (e.data.type == 'IVLike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (vstatus == "up") {
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
        if (vstatus == "down") {
            chrome.runtime.sendMessage({
                "InvisibleVoiceUnvote": hashforsite
            });
        } else {
            chrome.runtime.sendMessage({
                "InvisibleVoiceDownvote": hashforsite
            });
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

chrome.tabs.query(query, callback);
