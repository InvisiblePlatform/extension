// Simple code that gets the job done by Orange
//

// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = 480000;
var headers = new Headers();
var globalCode = "";
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};

var now = (new Date).getTime();
var found = false;
var isInjected = false;
var dontOpen = false;
var svgloc = chrome.runtime.getURL('logo.svg');
var localIndex = chrome.runtime.getURL('index.json');
var localReplace = chrome.runtime.getURL('replacements.json');
var localHash = chrome.runtime.getURL('hashtosite.json');
var localSite = chrome.runtime.getURL('sitetohash.json');
var voteUrl = "https://assets.reveb.la";
var level = 0;

var aSiteWePullAndPushTo;
var showButton, allKeys;
var IVEnabled, IVScoreEnabled;
var IVAutoOpen, IVLocalIndex;
var updateJSON;

var close, iframe, open;
var sourceString = aSiteYouVisit.replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/\./g,"");
var domainString = aSiteYouVisit.replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0];
var globablCode, globalSince, code;
var propertyOrder;
fetchCodeForPattern(sourceString);
var hashforsite;

fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => data[domainString])
    .then(global => hashforsite = global);
    // .then(hashforsite => console.log("[ IV ] "+ domainString + " : " + hashforsite));

var blockedHashes = [];
var IVBlock = false;

chrome.storage.local.get(function(localdata) {
    aSiteWePullAndPushTo = localdata.domainToPull || "https://test.reveb.la";
    IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    IVScoreEnabled = localdata.scoreEnabled ? true : false;
    propertyOrder = localdata.propertyOrder ? localdata.propertyOrder : [ "bcorp", "goodonyou", "glassdoor", "mbfc" ];
    IVAutoOpen = localdata.autoOpen ? true : false;
    IVLocalIndex = localdata.packagedData ? true : false;
    // if (!IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString(), IVScoreEnabled.toString());
    // if (IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
    if (IVLocalIndex) updateJSON = new Request(localIndex, init);
    if (!IVLocalIndex) updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
    if (IVEnabled) getData();
    // Prevent page load
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
    blockCheck();
});

function triggerUpdate(){
    if (IVLocalIndex){
    	// console.log("[ Invisible Voice ]: LocalIndex");
    	updateJSON = new Request(localIndex, init);
        fetch(updateJSON)
            .then(response => response.json())
            .then(data => chrome.storage.local.set({ "data": data }))
            .then(chrome.storage.local.set({ "time": now }));
	return

    }
    // console.log("[ Invisible Voice ]: Updating "+ aSiteWePullAndPushTo);
    try {
        fetch(updateJSON)
            .then(response => response.json())
            .then(data => chrome.storage.local.set({ "data": data }))
            .then(chrome.storage.local.set({ "time": now }));
    } catch (error) {
        error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
    }
}

var coded;

function run(globalCoded){
        try {
            chrome.storage.local.get(globalCoded, function(id) {
                timeSince = Object.values(id)[0];
                showButton = ((timeSince < now) || timeSince < (now - waitingTime)) ? false : true;
		chrome.storage.local.get("data", function(data){
			coded = data.data[globalCoded];
			// console.log("[ Invisible Voice ]: coded");
			// console.log(coded);
		});
	    if (IVScoreEnabled){
		let escapeOut = false;
		for (let x in propertyOrder){
			if (escapeOut) break;
			switch(propertyOrder[x]){
				case "bcorp":
			       	  try {
			             if (coded.bc == null) throw "no";
			        	createObjects(coded.bc,"bcorp");
					escapeOut = true;
			       	  } catch { }
				  break;
				case "goodonyou":
			       	  try {
			             if (coded.gr == null) throw "no";
			                createObjects(coded.gr,"goodonyou");
					escapeOut = true;
			       	  } catch { }
				  break;
				case "glassdoor":
			          try {
			             if (coded.dr == null) throw "no";
			        	createObjects(coded.dr,"glassdoor");
					escapeOut = true;
			       	  } catch {}
				  break;
				case "mbfc":
			          try {
			             if (coded.mr == null) throw "no";
			        	createObjects(coded.mr,"mbfc");
					escapeOut = true;
			       	  } catch {}
				  break;
			}
		}
		if (!escapeOut) createObjects();
	    } else {
	        createObjects();
	    };
                appendObjects();
                inject(globalCoded);
            });
        } catch (error) {console.log("[ Invisible Voice ]: "+ error);}
}

function fetchCodeForPattern(sourceString){
        chrome.storage.local.get("data", function(data) {
		pattern = "/" + sourceString + "/";
		try {
	    		coded = data.data[sourceString];
			if(!coded) throw "no";
            		globalCode = sourceString;
			if(coded) run(globalCode);
		} catch {
			try {
			fetch(new Request(localReplace, init))
			    .then(response => response.json())
			    .then(data => data[pattern]["t"].replace(/\//g,''))
		            .then(global => run(global));
			} catch {
				return;
			}
	    	}
	});
	return coded;
}

function getData() {
    now = (new Date).getTime();
    chrome.storage.local.get(function(topSiteOfTheWeek) {
        if (!topSiteOfTheWeek.time) triggerUpdate();
        if ((topSiteOfTheWeek.time + waitingTime) < now) triggerUpdate();
    });
    chrome.storage.local.get("data", function(data) {
        try{
    	 var test = data.data[100];
        } catch (error) {
    	  triggerUpdate();
        }
        // console.log("[ Invisible Voice ]: Running - " + sourceString, IVScoreEnabled);
    });
}

var changeMeta = document.createElement("meta");
changeMeta.httpEquiv = "Content-Security-Policy";
changeMeta.content = "upgrade-insecure-requests";

function inject(code) {
    if (IVEnabled) {
    document.head.prepend(changeMeta);
    if (isInjected == false) {
        // console.log("[ Invisible Voice ]: Injected - "+ code);
        iframe.src = aSiteWePullAndPushTo + "/" + code + "/" + "?date=" + Date.now();
        isInjected = true;
        found = true;
    }
    }
}

var isCreated = false
function createObjects(value, type) {
    if (!IVEnabled) return;
    // console.log("[ Invisible Voice ]: creating  - "+ IVScoreEnabled);

    open = document.createElement("div");
    open.id = "invisible-voice-floating";
    open.innerHTML = "<div id='invisible-voice-float' style='position: absolute; width:16px !important;background:#eee; height:-webkit-fill-available;display:flex; margin: auto; align-items:center; justify-content: center;'> < </div>";
    open.style.cssText = "overflow: visible; right: 16px; z-index: 2147483647; position: fixed; color: #111; font-family: 'Unica Reg', sans-serif; font-size: 24px; text-align:center; height:50%; top:0px; background:#eee; border-bottom:black solid 1px;transition: right .2s;";

    openFurther = document.createElement("div");
    openFurther.id = "invisible-voice-floating2";
    openFurther.innerHTML = "<div id='invisible-voice-float2' style='position: absolute; width:16px !important;background:#eee; height:-webkit-fill-available;display:flex; margin: auto; align-items:center; justify-content: center;'> > </div>";
    openFurther.style.cssText = "overflow: visible; right: 16px; z-index: 2147483647; position: fixed; color: #111; font-family: 'Unica Reg', sans-serif; font-size: 24px; text-align:center; height:50vh; bottom:0px; border-top:black solid 1px;transition: right .2s;";

    if (isCreated) return;
    close = document.createElement("div");
    close.id = "invisible-voice-button";
    close.innerHTML = " ";
    close.style.cssText = "top:0; left: auto; z-index: 2147483645; position: fixed; background-color: #98FB9821; visibility: hidden; width: 100%; height: 100%;";

    boycott = document.createElement("div");
    boycott.style.cssText = "visibility:hidden;font-size:1em;position:fixed;z-index:2147483647;bottom:0;height:32px;background-color:#eee;right:0;border:black solid 2px;width:320px;text-align:center;padding: calc(16px - 0.5em) 0 0 0;transition:width .2s;";
    boycott.id = "Invisible-boycott";
    boycott.innerHTML = "BOYCOTT ✊";

    vote = document.createElement("div");
    vote.style.cssText = "visibility:hidden;font-size:1em;width:324px;position:fixed;z-index:2147483647;bottom:36px;display:flex;background-color:#eee;right:0;justify-content:space-around;filter:saturate(6);text-align:center;transition:width .2s;";
    vote.id = "Invisible-vote";

    voteup = document.createElement("div");
    voteup.id = "Invisible-vote-up";
    voteup.innerHTML = "<div id='Invisible-vote-up' style='border:black solid 2px;width:-webkit-fill-available;padding: calc(16px - 0.5em) 0 0 0;white-space:nowrap;border-bottom:none;height:32px;'>LIKE 👍</div>";
    voteup.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
    votedown = document.createElement("div");
    votedown.id = "Invisible-vote-down";
    votedown.innerHTML = "<div id='Invisible-vote-down' style='border:black solid 2px;width:-webkit-fill-available;padding: calc(16px - 0.5em) 0 0 0;white-space:nowrap;border-bottom:none;height:32px;'>👎 DISLIKE</div>";
    votedown.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
    votenum = document.createElement("div");
    votenum.id = "Invisible-vote-num";
    votenum.innerHTML = " N/A ";
    votenum.style.cssText = 'border-top:black solid 2px;white-space:nowrap;flex-grow:0.3;padding: calc(16px - 0.5em) 0 0 0;';

    settings = "⚙️"


    iframe = document.createElement("iframe");
    iframe.style.cssText = "border: 0px; overflow: hidden; padding: 0px; right: 0; width: 0px; top:0px; height: 100%; z-index: 2147483646; box-shadow: rgba(0, 0, 0, 1) 0 0 4000px; position: fixed; background-color: rgba(255,255,255,0.95);transition:width .2s;";
    iframe.id = "Invisible";
    isCreated = true
};

function appendObjects() {
    if (!IVEnabled) return;
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(close);
    document.documentElement.appendChild(open);
    document.documentElement.appendChild(openFurther);
    document.documentElement.appendChild(vote);
    document.documentElement.appendChild(boycott);
    vote.appendChild(voteup);
    vote.appendChild(votenum);
    vote.appendChild(votedown);
    if (showButton || !IVAutoOpen ) {
        iframe.style.width = '0px';
        close.style.visibility = 'hidden';
	boycott.style.visibility = 'hidden';
        vote.style.visibility = 'hidden';
	open.style.right = '16px';
	openFurther.style.right = '16px';
    } else {
        iframe.style.width = '320px';
        close.style.visibility = 'visible';
        boycott.style.visibility = 'visible';
	open.style.right = '336px';
	openFurther.style.right = '336px';
	chrome.runtime.sendMessage({"InvisibleVoteTotal": hashforsite});
    }
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
        frame = document.getElementById("Invisible");
        if (frame.style.visibility == 'hidden') floating.style.visibility = 'visible';
    };
});


document.addEventListener('mouseup', function(event) {
        if (event.target.matches('#Invisible-vote-up')) {
		console.log("vote up");
    		if (voteup.style.cssText == "filter: grayscale(100%); cursor: pointer; flex-grow: 0.5;"){
	    		chrome.runtime.sendMessage({"InvisibleVoiceUpvote": hashforsite});
		} else {
	    		chrome.runtime.sendMessage({"InvisibleVoiceUnvote": hashforsite});
		};
        };
        if (event.target.matches('#Invisible-vote-down')) {
		console.log("vote down");
    		if (votedown.style.cssText == "filter: grayscale(100%); cursor: pointer; flex-grow: 0.5;"){
	    		chrome.runtime.sendMessage({"InvisibleVoiceDownvote": hashforsite});
		} else {
	    		chrome.runtime.sendMessage({"InvisibleVoiceUnvote": hashforsite});
		};
        };
    if (dontOpen != true) {
        // This is to reopen the box if it needs to be
        if (event.target.matches('#invisible-voice-float2')) {
	    if (distance == 140) {
		distance = 0;
            	close.style.visibility = 'hidden';
            	boycott.style.visibility = 'hidden';
            	vote.style.visibility = 'hidden';
	    } else if (distance == 320) {distance = 140;}
	      else if (distance == 640) {distance = 320;}
            iframe.style.width = distance + 'px';
	    open.style.right = distance + 16 + 'px';
	    openFurther.style.right = distance + 16 + 'px';
            vote.style.width = distance + 'px';
            boycott.style.width = distance - 4 + 'px';
	    if (distance > 140){
            	close.style.visibility = 'visible';
            	boycott.style.visibility = 'visible';
            	vote.style.visibility = 'visible';
	    	chrome.runtime.sendMessage({"InvisibleVoteTotal": hashforsite});
	    } else {
            	close.style.visibility = 'hidden';
            	boycott.style.visibility = 'hidden';
            	vote.style.visibility = 'hidden';
	    }
	}
        if (event.target.matches('#invisible-voice-float')) {
            var dismissData = {};
            dismissData[globalCode] = 0;
            chrome.storage.local.set(dismissData);
            inject(globalCode);
	    if (distance == 0) {distance = 140;}
	    else if (distance == 140) {distance = 320;}
	    else if (distance == 320) {distance = 640;}
            iframe.style.width = distance + 'px';
	    open.style.right = distance + 16 + 'px';
	    openFurther.style.right = distance + 16 + 'px';
	    if (distance > 140){
            	close.style.visibility = 'visible';
            	boycott.style.visibility = 'visible';
            	vote.style.visibility = 'visible';
            	vote.style.width = distance + 'px';
            	boycott.style.width = distance - 4 + 'px';
	    	chrome.runtime.sendMessage({"InvisibleVoteTotal": hashforsite});
	    }
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
        iframe.style.width = '0px';
        close.style.visibility = 'hidden';
        boycott.style.visibility = 'hidden';
        vote.style.visibility = 'hidden';
	open.style.right = distance + 16 + 'px';
	openFurther.style.right = distance + 16 + 'px';
    }
    dontOpen = false;

});

var distance = 0;
document.addEventListener('click', function(event) {
    // console.log(dontOpen)
    if (event.target.matches('#Invisible-boycott')) {
    	// console.log("boycott: " + hashforsite );
    	blockedHashes.push(hashforsite);
        	chrome.storage.local.set({ "blockedHashes": blockedHashes });
    	aSiteYouVisit = window.location.href;
    	window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" +domainString + "&return=" + aSiteYouVisit);
    };

}, false);

function blockCheck() {
	if (!IVEnabled) return;
        chrome.storage.local.get(function(localdata) {
    		blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
	});
    	// console.log(domainString);
    	if (blockedHashes.includes(hashforsite)){
    	// lookup hash
    		fetch(new Request(localHash, init))
    	    	.then(response => response.json())
    	    	.then(data => data[hashforsite]);
    	    	// .then(global => console.log(global));
    		// console.log(domainString);
    	    window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" +domainString + "&return=" + aSiteYouVisit);
    	};
}

chrome.runtime.onMessage.addListener(msgObj => {
    if (msgObj == "InvisibleVoiceBlockCheck") {
	if (aSiteYouVisit != window.location.href){
		blockCheck();
	}
    } else {
    	// console.log("[ Invisible Voice ]: onMessage " + msgObj);
    }
    if (msgObj == "InvisibleVoiceRefresh") {
	if (IVEnabled){
	["invisible-voice-floating"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {console.log("[ Invisible Voice ]: errorOnMessage" + e);};
	});};
        isInjected = false;
	found = false;
        chrome.storage.local.get(function(localdata) {
    	    aSiteWePullAndPushTo = localdata.domainToPull || "https://test.reveb.la";
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    	    IVScoreEnabled = localdata.scoreEnabled ? true : false;
    	    IVAutoOpen = localdata.autoOpen ? true : false;
    	    IVLocalIndex = localdata.packagedData ? true : false;
    	    propertyOrder = localdata.propertyOrder ? localdata.propertyOrder : [ "bcorp", "goodonyou", "glassdoor", "mbfc" ];
    	    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
            // console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString(), IVScoreEnabled.toString());
        });
	blockCheck();
        getData();
	fetchCodeForPattern(sourceString);
    }
    if (Object.keys(msgObj)[0] == "InvisibleVote") {
	objectkey = Object.keys(msgObj)[0];
	// console.log(msgObj[objectkey]);
	votenum.innerHTML = msgObj[objectkey]["total"];
	if (msgObj[objectkey]["status"] == "up"){
    		voteup.style.cssText = "filter: hue-rotate(1.3rad);cursor: pointer;flex-grow:0.5;";
    		votedown.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
	} else if (msgObj[objectkey]["status"] == "down"){
    		voteup.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
    		votedown.style.cssText = "filter: hue-rotate(5.4rad);cursor: pointer;flex-grow:0.5;";
	} else {
    		voteup.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
    		votedown.style.cssText = "filter: grayscale(100%);cursor: pointer;flex-grow:0.5;";
	};
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
		// console.log("block: ", hashtoadd);
		// console.log("block: ", blockedHashes);
	}, 1000);
    }
    if (msgObj == "InvisibleVoiceOff") {
	if (IVEnabled){
	["Invisible", "invisible-voice-floating", "invisible-voice-button","Invisible-boycott"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {console.log("[ Invisible Voice ]: errorOnMessage" + e);};
	});};
	isCreated = false;
        chrome.storage.local.get(function(localdata) {
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
            // console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString(), IVScoreEnabled.toString());
        });
    }
});

