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
var domainString, sourceString, aSiteYouVisit;
var notifcations;
var voteCode;
var debug = true;
var graphOpen = false;
var distance = 160;
var voting = false;
var settingsState;
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

// Various Lookups
let localReplace = browser.runtime.getURL('replacements.json');
let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let buttonSvg = browser.runtime.getURL('button.svg');
let psl = browser.runtime.getURL('public_suffix_list.dat');
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


// fetch(new Request(localSite, init))
//     .then(response => response.json())
//     .then(data => lookup = data)

// Domain handling
// PSL 2023/06/23 updated
async function parsePSL(pslStream, lookup, aSiteYouVisit) {
  browser.storage.local.get(function(data){
        pretty_name = data.pretty_name;
        username = data.username;
        loggedIn = (username != undefined) ? true : false;
        if (loggedIn) console.log(`user ${username}/${pretty_name} is logged in`)
        settingsState["loggedIn"] = loggedIn
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
    return longestMatch.suffix;
}

var coded;
function lookupDomainHash(domain, lookup){
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


// Mode 0 is Desktop, Mode 1 is mobile
// Bubble Mode 0 is bubble, 1 is no bubble, 2 is no bubble or bar
function domainChecker(domains, lookupList){
	let domainList = domains
    if (lookupList[sourceString]){
        globalCode = sourceString;
        createObjects();
        return lookup[sourceString];
    };
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
    bgresponse = JSON.parse(lookupDomainHash(aSiteYouVisit, lookup));
    sourceString = bgresponse['sourceString'];
    domainString = bgresponse['domainString'];
    hashforsite = bgresponse['hashforsite'] ? bgresponse['hashforsite'] : false;
    var pattern = "/" + sourceString + "/";
    if (debug == true) console.log("[ IV ] " + domainString + " : " + hashforsite + " : " + pattern);
    browser.storage.local.get("data", function(data) {
        try {
            if (data.data[hashforsite] === undefined){
                fetch(new Request(localHash, init))
			    	.then(response => response.json())
			    	.then(subdata => subdata[hashforsite])
			    	.then(possibileDomains => domainChecker(possibileDomains, data.data))
            } else {
			    globalCode = sourceString;
                createObjects();
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


function callback(tabs) {
    if (sourceString === undefined) {
        currentTab = tabs[0]; // there will be only one in this array
        aSiteYouVisit = currentTab.url;
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
                ourdomain = `${aSiteWePullAndPushTo}/db/${sourceString}/`
                if (settingsState["loggedIn"]) ourdomain += `&username=${pretty_name}`;
	            if (addingId != '#'){
	              ourdomain += addingId
	              distance = 640;
	            }
                iframe.src = ourdomain + "&app=true";
                if (mode == 0) iframe.style.width = distance + 'px';
                if (mode == 0) iframe.style.height = '100em';
                if (mode == 1) iframe.style.width = '100%';
                if (mode == 1) iframe.style.height = '100%';
            })
        } else {
            fetch(new Request(localSite, init))
                .then(response => response.json())
                .then(lookup => startDataChain(lookup, aSiteYouVisit))
        }
    }
    return true
}

function createObjects(){
    console.log(sourceString, hashforsite);
    ourdomain = `${aSiteWePullAndPushTo}/db/${globalCode}/`
    ourdomain += "?date=" + Date.now() + "&vote=true";
    if (settingsState["loggedIn"]) ourdomain += `&username=${pretty_name}`;
	if (addingId != '#'){
	  ourdomain += addingId
	  distance = 640;
	}
    iframe.src = ourdomain + "&app=true";

    if (mode == 0) iframe.style.width = distance + 'px';
    if (mode == 0) iframe.style.height = '100em';
    if (mode == 1) iframe.style.width = '100%';
    if (mode == 1) iframe.style.height = '100%';
}

var addingId = '#';
var isSet = false;
let resize = function(x) {
    if(typeof(x)==='undefined') x = "";
    if (mode == 0) {
    if (isSet == false) {
        ourdomain = `${aSiteWePullAndPushTo}/db/${globalCode}/`
        ourdomain += "?date=" + Date.now() + "&vote=true";
        if (settingsState["loggedIn"]) ourdomain += `&username=${pretty_name}`;
	      if (addingId != '#'){
	        ourdomain += addingId
	        distance = 640;
	      }
        iframe.src = ourdomain + "&app=true";
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
function sendMessageToPage(message){
    if (typeof(iframe) !== 'undefined'){
        iframe.contentWindow.postMessage(message, '*');
    } else {
        window.postMessage(message, '*');
    }
	console.log(`sent ${message.message}`)
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
    sendMessageToPage(message);
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
    sendMessageToPage(message)
}
function forwardPost(x){
    if (debug == true) console.log(x);
    if (typeof(x) == 'undefined') return;
    utotal = ( 'up_total' in x ) ? x["up_total"] : x["utotal"];
    dtotal = ( "down_total" in x ) ? x["down_total"] : x["dtotal"] ;
    ptotal = ( "post_total" in x ) ? x["post_total"] : 0;
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
    sendMessageToPage(message);
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
    sendMessageToPage(message);
}

window.addEventListener('message', function (e) {
  if (e.data.type === undefined) return;

  if (debug) console.log(e.data.type + " Stub " + e.data.data);

  switch (e.data.type) {
	case 'IVSettingsReq':
	   const message = {
			message: "SettingsUpdate",
			data: settingsState
	   }
       sendMessageToPage(message)
	   break;
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
            sending.then(forwardPost, onError)
          }
      break;
    case 'IVMakePost':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleMakePost": e.data.data}) 
            sending.then(onError, onError)
          }
      break;
    case 'IVPostStuff':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleModuleInfo": e.data.data}) 
            sending.then(forwardPosts, onError)
          }
      break;
    case 'IVPostVoteUp':
    case 'IVPostVoteDown':
    case 'IVPostVoteUnvote':
          if (e.data.data != ''){
            if (debug) console.log(e.data.data)
            const sending = browser.runtime.sendMessage({"InvisibleModuleVote": e.data.data, "type": e.data.type}) 
            sending.then(forwardPosts, onError)
          }
      break;


    case 'IVVoteStuff':
      if (e.data.data != '') {
          console.log(`IVVOTESTUFF ${e.data.data}`)
          if (voteCode == undefined){
              voteCode = e.data.data;
              console.log("VoteCodeSet")
              const sending = browser.runtime.sendMessage({"InvisibleVoteTotal": voteCode}) 
              sending.then(forwardVotes, onError)
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
              sending.then(forwardVote, onError)
              
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
    try {
    settingsState = await browser.storage.local.get("settings_obj").then(function(obj){
        return JSON.parse(obj["settings_obj"])
    });
    } catch(e){
        console.log(e)
        settingsState = defaultSettingsState;
    }
    debug = settingsState["debugMode"]
    console.log(settingsState);
}


iframe.addEventListener('load', function(e){
    if (hashforsite === undefined) {
    } else if (voting == true) {
        (async () => {
        const response =  await browser.runtime.sendMessage(identifier, { "InvisibleVoteTotal": hashforsite });
        sendToPage(response);
        })();
    }
});
const tagLookup = {
    "l": "Glassdoor",
    "b": "BCorp",
    "P": "TOS;DR",
    "m": "MBFC",
    "t": "TrustPilot",
    "s": "TrustScam"
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

function onError(e){
    console.error(`Error: ${e}`);
};

function startDataChain(lookup){
    console.log("chain")
    processSettingsObject().then(fetch(new Request(psl, init))
        .then(response => parsePSL(response.body, lookup, aSiteYouVisit)));
}

console.log(identifier);
browser.tabs.query(query).then(callback, onError);
