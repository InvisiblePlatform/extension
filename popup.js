var query = {
    active: true,
    currentWindow: true
};
var iframe = document.getElementById("invisible-frame");
var now = (new Date).getTime();
var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)"
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
var useBG = false;
var allowUpdate;
const phoneRegex = /iPhone/i;
const chrRegex = /Chr/i;
const frRegex = /Firefox/i;
var voteStatus, hashforsite, currentTab;

if (phoneRegex.test(navigator.userAgent))
    mode = 1;

if (chrRegex.test(navigator.userAgent)){
    browser = chrome;
    identifier = "fafojfdhjlapbpafdcoggecpagohpono"

}
if (frRegex.test(navigator.userAgent))
    identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"

//  Formatted version of a popular md5 implementation
//  Original copyright (c) Paul Johnston & Greg Holt.
//  The function itself is now 42 lines long.

function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}

function sendToPage(data){
    var msgObj = data;
    voteStatus = msgObj["status"];
    var message = {
        message: "VoteUpdate",
        voteStatus: msgObj["status"],
        utotal: msgObj["up_total"],
        dtotal: msgObj["down_total"]
    };
    if (debug == true) console.log(message, data);
    iframe.contentWindow.postMessage(message, '*');
}

let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let localIndex = browser.runtime.getURL('index.json');
var IVLocalIndex;
var lookup = {}; 
var headers = new Headers();
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};

browser.storage.local.get(function(localdata) {
	blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
});


fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => lookup = data)

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
    });
    if (allowUpdate) fetch(updateJSON)
        .then(response => response.json())
        .then(data => browser.storage.local.set({ "data": data }))
        .then(browser.storage.local.set({ "time": now }));
}

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

function callback(tabs) {
    if (sourceString == "") {
        currentTab = tabs[0]; // there will be only one in this array
        var aSiteYouVisit = currentTab.url;
        console.log(currentTab.url)
        if (useBG) {
            var bgresponse;
            browser.runtime.sendMessage( 
                identifier,
            {
                "IVHASH": aSiteYouVisit,
            }, function(response){
                bgresponse = JSON.parse(response);
                sourceString = bgresponse['sourceString'];
                domainString = bgresponse['domainString'];
                hashforsite = bgresponse['hashforsite'];
                var pattern = "/" + sourceString + "/";
                if (hashforsite === undefined)
                    hashforsite = md5(sourceString);
                console.log(sourceString, hashforsite);
                iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now().toString();
                if (mode == 0) iframe.style.width = distance + 'px';
                if (mode == 0) iframe.style.height = '100em';
                if (mode == 1) iframe.style.width = '100vw';
                if (mode == 1) iframe.style.height = '100vh';
            })
        } else {
            bgresponse = JSON.parse(lookupDomainHash(aSiteYouVisit));
            sourceString = bgresponse['sourceString'];
            domainString = bgresponse['domainString'];
            hashforsite = bgresponse['hashforsite'];
            var pattern = "/" + sourceString + "/";
            if (hashforsite === undefined)
                hashforsite = md5(sourceString);
            console.log(sourceString, hashforsite);
            iframe.src = aSiteWePullAndPushTo + "/db/" + sourceString + "/" + "?date=" + Date.now().toString();
            if (mode == 0) iframe.style.width = distance + 'px';
            if (mode == 0) iframe.style.height = '100em';
            if (mode == 1) iframe.style.width = '100vw';
            if (mode == 1) iframe.style.height = '100vh';

        }
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
    distance = (distance == 160) ? 640 : 160;

    if (x == "close")
        distance = 0;
    if (x == "network")
        distance = 840;

    iframe.style.width = distance + 'px';
    voting = true; 
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

browser.runtime.onMessageExternal.addListener(msgObj => {
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
                const respond =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteUnvote": hashforsite });
                sendToPage(respond);
            })();
        } else {
            (async () => {
                const respond =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteUpvote": hashforsite });
                sendToPage(respond);
            })();
        }
    }
    if (e.data.type == 'IVDislike' && e.data.data != '') {
        if (debug == true) console.log(e.data.type + " Stub");
        if (voteStatus == "down") {
            (async () => {
                const respond =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteUnvote": hashforsite });
                sendToPage(respond);
            })();
        } else {
            (async () => {
                const respond =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteDownvote": hashforsite });
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
    if (hashforsite === undefined) {
    } else if (voting == true) {
        (async () => {
        const response =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteTotal": hashforsite });
        sendToPage(response);
        })();
    }
});

function onError(e){
    console.error(`Error: ${e}`);
};

console.log(identifier);
fetchIndex();
browser.tabs.query(query).then(callback, onError);
