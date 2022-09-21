var localIndex = chrome.runtime.getURL('index.json');
var localReplace = chrome.runtime.getURL('replacements.json');
var localHash = chrome.runtime.getURL('hashtosite.json');
var localSite = chrome.runtime.getURL('sitetohash.json');
var blockedHashes=[];

chrome.storage.local.get(function(localdata) {
	blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
});

function blockCheck(){
    chrome.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, "InvisibleVoiceBlockCheck");
        });
    });
}

function vote(site, direction, tab){
   var voteHeaders = new Headers({
   	'site': site,
   	'direction': direction
   });
   var voteVars = {
       method: 'POST',
       headers: voteHeaders,
       mode: 'cors',
   };
   fetch(new Request(voteUrl + "/vote", voteVars))
   	.then(response => response.json()).then(data => {
		chrome.tabs.sendMessage(tab, {"InvisibleVote": data });
		console.log(data);
	});
}

function getTotal(site, tab){
   var voteHeaders = new Headers({
   	'site': site
   });
   var voteVars = {
       method: 'GET',
       headers: voteHeaders,
       mode: 'cors',
   };
   fetch(new Request(voteUrl + "/get-data", voteVars))
   	.then(response => response.json()).then(data => {
		chrome.tabs.sendMessage(tab, {"InvisibleVote": data });
		console.log(data);
	});
}

var voteUrl = "https://assets.reveb.la";
chrome.runtime.onMessage.addListener(function(msgObj, sender, sendResponse) {
	console.log(msgObj);
    if (msgObj == "InvisibleVoiceRefresh") {
	    console.log("refreshed");
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceUnvote") {
	objectkey = Object.keys(msgObj)[0];
	vote(msgObj[objectkey], "un", sender.tab.id);
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceUpvote") {
	objectkey = Object.keys(msgObj)[0];
	vote(msgObj[objectkey], "up", sender.tab.id);
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceDownvote") {
	objectkey = Object.keys(msgObj)[0];
	vote(msgObj[objectkey], "down", sender.tab.id);
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoteTotal") {
	objectkey = Object.keys(msgObj)[0];
	getTotal(msgObj[objectkey], sender.tab.id);
    }
    if (Object.keys(msgObj)[0] == "InvisibleVoiceReblock") {
	objectkey = Object.keys(msgObj)[0];
        setTimeout(function(){
		hashtoadd = msgObj[objectkey];
		chrome.storage.local.get(function(localdata) {
    			blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
		});
		blockedHashes.push(hashtoadd);
        	chrome.storage.local.set({ "blockedHashes": blockedHashes });
		console.log("block: ", hashtoadd);
		console.log("block: ", blockedHashes);
	}, 1000);
	blockCheck();
    }
});

setInterval(blockCheck, 10000);
