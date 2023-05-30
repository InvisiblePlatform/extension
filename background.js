var voteUrl = "https://assets.reveb.la";
var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)"
if (chrome){
    browser = chrome;
    identifier = "fafojfdhjlapbpafdcoggecpagohpono"
}
var localIndex = browser.runtime.getURL('index.json');

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

function loopupDomainHash(domain){
    sourceString = domain.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '').replace(/\./g, "");
    domainString = domain.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '');
    hashforsite = lookup[domainString];
    return JSON.stringify({
        "sourceString": sourceString, 
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
	console.log(msgObj, sender, sendResponse);
    objectkey = Object.keys(msgObj)[0] ? Object.keys(msgObj)[0] : false ;
    tabId = msgObj["tabId"] ? msgObj["tabId"] : false;
    if (msgObj == "IVICON"){
	    console.log("show icon");
	// browser.browserAction.setIcon({
	// 	imageData:  browser.runtime.getURL('iconShow.png'),
	// 	tabId: sender.tab.id
	// })
    }
    if (msgObj == "InvisibleVoiceRefresh") {
	    console.log("refreshed");
    }
    console.log("bonk!",objectkey);
    if (objectkey == "InvisibleVoteUnvote") {
    console.log("bonk!",objectkey);
        (async function(){
	            var data = await vote(msgObj[objectkey], "un");
                console.log(data);
                sendResponse(data);
        })();
        return true;
    }
    if (objectkey == "InvisibleVoteUpvote") {
    console.log("bonk!",objectkey);
        (async function(){
	            var data = await vote(msgObj[objectkey], "up");
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (objectkey == "InvisibleVoteDownvote") {
    console.log("bonk!",objectkey);
        (async function(){
	            var data = await vote(msgObj[objectkey], "down");
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (objectkey == "InvisibleVoteTotal") {
    console.log("bonk!",objectkey);
        (async function(){
	            var data = await getTotal(msgObj[objectkey]);
                console.log(data);
                sendResponse(data);
            })()
        return true;
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceReblock") {
        setTimeout(function(){
		    hashtoadd = msgObj[objectkey];
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
    if (Object.keys(msgObj)[0] == 'IVHASH'){
        data = loopupDomainHash(msgObj[objectkey]);
        tab = msgObj["tabId"];
        sendResponse(data);
    }
});

setInterval(blockCheck, 10000);
