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
var localReplace = chrome.runtime.getURL('replacements.json');
var localHash = chrome.runtime.getURL('hashtosite.json');
var localSite = chrome.runtime.getURL('sitetohash.json');
var voteUrl = "https://assets.reveb.la";
var level = 0;
var defaultIndexURL = "https://test.reveb.la";

var aSiteWePullAndPushTo;
var showButton, allKeys;
var IVEnabled, IVScoreEnabled;
var IVLocalIndex;
var updateJSON;
var vstatus;

var buttonOffsetVal = 32;
var buttonOffset = buttonOffsetVal + "px";

var iframe, open; 
var sourceString = aSiteYouVisit.replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/\./g,"");
var domainString = aSiteYouVisit.replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0];
var globablCode, globalSince, code;
var propertyOrder;
fetchCodeForPattern(sourceString);
var hashforsite;
var darkMode = false;
var backgroundColor = "#fff";
var textColor = "#343434";
var heavyTextColor = "#111";
var debug = false;

fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => data[domainString])
    .then(global => hashforsite = global);
    // .then(hashforsite => console.log("[ IV ] "+ domainString + " : " + hashforsite));

var blockedHashes = [];
var IVBlock = false;

if (window.matchMedia && !!window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.info('Dark Theme detected 🌒 ')
    darkMode = true; 
    backgroundColor = "#343434";
    textColor = "#fff";
    heavyTextColor = "#AAA";
}

chrome.storage.local.get(function(localdata) {
    aSiteWePullAndPushTo = defaultIndexURL;
    IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    IVScoreEnabled = localdata.scoreEnabled ? true : false;
    propertyOrder = localdata.propertyOrder ? localdata.propertyOrder : [ "bcorp", "goodonyou", "glassdoor", "mbfc" ];
    // if (!IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled.toString(), IVScoreEnabled.toString());
    // if (IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
    updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
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
			    .then(data, function(data){
				    if( data[pattern] ) { 
					    return data[pattern]["t"].replace(/\//g,'') ;
				    }
			    }).then(global => console.log(global));
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
changeMeta.setAttribute('http-equiv', "Content-Security-Policy");
changeMeta.setAttribute("content", "upgrade-insecure-requests");

function inject(code) {
    if (IVEnabled) {
    document.head.prepend(changeMeta);
    if (isInjected == false) {
        console.log("[ Invisible Voice ]: Injected - "+ code);
        // iframe.src = aSiteWePullAndPushTo + "/" + code + "/" + "?date=" + Date.now();
        isInjected = true;
        found = true;
	chrome.runtime.sendMessage("IVICON");
    }
    }
}

var isCreated = false
var isSet = false
function createObjects(value, type) {
    if (!IVEnabled) return;
    // console.log("[ Invisible Voice ]: creating  - "+ IVScoreEnabled);
    open = document.createElement("div");
    open.id = "invisible-voice-floating";
    open.innerHTML = "<div id='invisible-voice-float' " +
                "style='position: fixed;" +
                "width: " + buttonOffset + " !important;" +
                "border:"+ textColor + " solid 1px !important;" +
                "background:"+ backgroundColor +";" +
                "height:-webkit-fill-available;" +
                "display:flex;" +
                "right: 0;" +
                "margin: auto;" +
                "align-items:center;" +
                "justify-content: center;'" +
			"> < </div>";

    open.style.cssText = "z-index: 2147483646;" +
			 "position: fixed;" +
			 "color: " + textColor + ";"+
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
    if (!IVEnabled) return;
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(open);
    iframe.style.width = '0px';
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
        floating.style.visibility = 'visible';};
});

let resizeCloseIV = function(x = ""){
	distance = 0;
        iframe.style.width = distance + 'px';
};

let resizeNetwork = function(x = ""){
	distance = 840;
        iframe.style.width = distance + 'px';
};
let resize = function(x = ""){
	if (isSet == false) {
        	iframe.src = aSiteWePullAndPushTo + "/" + globalCode + "/" + "?date=" + Date.now();
		isSet = true;
	}
	if (distance == 0) {distance = 160;}
	else if (distance == 160) {
	        distance = 640;
	}
	else {distance = 160;}
	iframe.style.width = distance + 'px';
	if (distance > 160){
		chrome.runtime.sendMessage({"InvisibleVoteTotal": hashforsite});
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
        iframe.style.width = '0px';
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
	};
    } else {
    	if (debug == true) console.log(msgObj);
    }
    if (msgObj == "InvisibleVoiceRefresh") {
	if (IVEnabled){
	["invisible-voice-floating"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);};
	});};
        isInjected = false;
	found = false;
        chrome.storage.local.get(function(localdata) {
    	    aSiteWePullAndPushTo = localdata.domainToPull || "https://test.reveb.la";
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    	    IVScoreEnabled = localdata.scoreEnabled ? true : false;
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
	if (debug == true) console.log(msgObj[objectkey]);
	vstatus = msgObj[objectkey]["status"];
	var message = {
		message: "VoteUpdate",
		vstatus: msgObj[objectkey]["status"],
		utotal: msgObj[objectkey]["up_total"],
		dtotal: msgObj[objectkey]["down_total"]
	};
	iframe.contentWindow.postMessage(message, '*');
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
		if (debug == true) console.log("block: ", hashtoadd);
		if (debug == true)  console.log("block: ", blockedHashes);
	}, 1000);
    }
    if (msgObj == "InvisibleVoiceOff") {
	if (IVEnabled){
	["Invisible", "invisible-voice-floating", "invisible-voice-button"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {if (debug == true) console.log("[ Invisible Voice ]: errorOnMessage" + e);};
	});};
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
window.addEventListener('message', function (e){
	if (e.data.type == 'IVLike' && e.data.data != ''){
		if (debug == true) console.log(e.data.type + " Stub");
		if (vstatus == "up" ){
	    		chrome.runtime.sendMessage({"InvisibleVoiceUnvote": hashforsite});
		} else {
	    	chrome.runtime.sendMessage({"InvisibleVoiceUpvote": hashforsite});
		}
	}
	if (e.data.type == 'IVDislike' && e.data.data != ''){
		if (debug == true) console.log(e.data.type + " Stub");
		if (vstatus == "down" ){
	    		chrome.runtime.sendMessage({"InvisibleVoiceUnvote": hashforsite});
		} else {
	    		chrome.runtime.sendMessage({"InvisibleVoiceDownvote": hashforsite});
		}
	}
	if (e.data.type == 'IVBoycott' && e.data.data != ''){
    		blockedHashes.push(hashforsite);
        	chrome.storage.local.set({ "blockedHashes": blockedHashes });
    		aSiteYouVisit = window.location.href;
    		window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" +domainString + "&return=" + aSiteYouVisit);
	}
	if (e.data.type == 'IVClicked' && e.data.data != ''){
		if (debug == true) console.log("resize stub " + e.data.data);
		if (level2.includes(e.data.data)){
			if (debug == true) console.log("level2 resize");
			resize();
		}
		if (e.data.data == 'antwork' || e.data.data == 'graph-box'){
		 	resizeNetwork();
		} else {
			if (e.data.data == 'back'){
				resize();
			} else {
				if (distance == 160) resize();
			};
		};
	}
	if (e.data.type == 'IVClose'){
		resizeCloseIV();	
	}
	if (e.data.type == 'IVDarkModeOverride'){
		if (debug == true) console.log("DarkMode stub", e.data.data);
	}
	if (e.data.type == 'IVKeepOnScreen'){
		if (debug == true) console.log("keep on screen stub", e.data.data);
		if ( e.data.data == "true" ){
			distance = 0;
			resize();
		}
	}
});
