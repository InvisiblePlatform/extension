var debug = true;
var aSiteWePullAndPushTo = "https://test.reveb.la";
var voteUrl = "https://assets.reveb.la";
var now = (new Date).getTime();

var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)"
if (chrome){
    browser = chrome;
    identifier = "fafojfdhjlapbpafdcoggecpagohpono"
}
const frRegex = /Firefox/i;
if (frRegex.test(navigator.userAgent)){
    identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"
}

var localIndex = browser.runtime.getURL('index.json');
var IVLocalIndex = false;
var updateJSON; // Request

var localHash = browser.runtime.getURL('hashtosite.json');
var localSite = browser.runtime.getURL('sitetohash.json');
var blockedHashes=[];
var headers = new Headers();
var lookup; 
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

function fetchIndex(updateJSON) {
    fetch(updateJSON)
        .then(response => response.json())
        .then(data => browser.storage.local.set({
            "data": data
        }))
        .then(browser.storage.local.set({
            "time": now
        }));
}

function getFromLocalData(){
    browser.storage.local.get(function(localdata) {
        if (debug) console.log(localdata);
        if (debug && !IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + aSiteWePullAndPushTo);
        if (debug && IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
        updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
        if ((localdata.time + 480000) < now) triggerUpdate();
        // Prevent page load
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
    });
}

getFromLocalData();
fetchIndex();

function loopupDomainHash(domain){
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

function blockCheck(){
    browser.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            browser.tabs.sendMessage(tab.id, "InvisibleVoiceBlockCheck");
        });
    });
}

async function vote(site, direction){
   var voteHeaders = new Headers({
   	'site': site,
   	'direction': direction
   });
   var voteVars = {
       method: 'POST',
       headers: voteHeaders,
       mode: 'cors',
   };
   console.log(site, direction);
   var data = await fetch(
       new Request(voteUrl + "/vote", voteVars)
   ).then(response => response.json()
   ).then(data => {
       return data;
   }
   );
   return data;
}

async function getTotal(site){
   var voteHeaders = new Headers({
   	'site': site
   });
   var voteVars = {
       method: 'GET',
       headers: voteHeaders,
       mode: 'cors',
   };
   var data = await fetch(
       new Request(voteUrl + "/get-data", voteVars)
   ).then(response => response.json()
   ).then(data => {
       return data;
   }
   );
    return data;
}

browser.runtime.onMessage.addListener(function(msgObj, sender, sendResponse) {
	console.log(msgObj);
    // objectkey = (Object.keys(msgObj)[0] != "") ? Object.keys(msgObj)[0] : false ;
    if (Object.keys(msgObj)[0] == "InvisibleVoteUnvote") {
    console.log("bonk!",Object.keys(msgObj)[0]);
        (async function(){
	            var data = await vote(msgObj[Object.keys(msgObj)[0]], "un");
                console.log(data);
                sendResponse(data);
        })();
        return true;
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoteUpvote") {
    console.log("bonk!",Object.keys(msgObj)[0]);
        (async function(){
	            var data = await vote(msgObj[Object.keys(msgObj)[0]], "up");
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoteDownvote") {
    console.log("bonk!",Object.keys(msgObj)[0]);
        (async function(){
	            var data = await vote(msgObj[Object.keys(msgObj)[0]], "down");
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoteTotal") {
    console.log("bonk!",Object.keys(msgObj)[0]);
        (async function(){
	            var data = await getTotal(msgObj["InvisibleVoteTotal"]);
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceReblock") {
        setTimeout(function(){
		    hashtoadd = msgObj[Object.keys(msgObj)[0]];
		    browser.storage.local.get(function(localdata) {
    	    		blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
		    });
		    blockedHashes.push(hashtoadd);
            browser.storage.local.set({ "blockedHashes": blockedHashes });
		    console.log("block: ", hashtoadd);
		    console.log("block: ", blockedHashes);
	    }, 1000);
	    blockCheck();
    }
    if (Object.keys(msgObj)[0] == "IVHASH"){
        data = loopupDomainHash(msgObj["IVHASH"]);
        sendResponse(data);
    }
});

setInterval(blockCheck, 10000);
