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

var found = false;
var isInjected = false;
var dontOpen = false;
var svgloc = chrome.extension.getURL('logo.svg');
var localIndex = chrome.extension.getURL('index.json');

var aSiteWePullAndPushTo;
var showButton, allKeys;
var IVEnabled, IVScoreEnabled;
var IVAutoOpen, IVLocalIndex;
var updateJSON;

var close, iframe, open;

chrome.storage.local.get(function(localdata) {
    aSiteWePullAndPushTo = localdata.domainToPull || "https://test.reveb.la";
    IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    IVScoreEnabled = localdata.scoreEnabled ? true : false;
    IVAutoOpen = localdata.autoOpen ? true : false;
    IVLocalIndex = localdata.packagedData ? true : false;
    if (!IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull);
    if (IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
    if (IVLocalIndex) updateJSON = new Request(localIndex, init);
    if (!IVLocalIndex) updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
    if (IVEnabled) getData();
});

function triggerUpdate(){
    if (IVLocalIndex){
    	console.log("[ Invisible Voice ]: LocalIndex");
    	updateJSON = new Request(localIndex, init);
        fetch(updateJSON)
            .then(response => response.json())
            .then(data => chrome.storage.local.set({ "data": data }))
            .then(chrome.storage.local.set({ "time": now }));
	return

    }
    console.log("[ Invisible Voice ]: Updating "+ aSiteWePullAndPushTo);
    try {
        fetch(updateJSON)
            .then(response => response.json())
            .then(data => chrome.storage.local.set({ "data": data }))
            .then(chrome.storage.local.set({ "time": now }));
    } catch (error) {
        error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
    }
}


function getData() {
    now = (new Date).getTime();
    chrome.storage.local.get(function(topSiteOfTheWeek) {
        if (!topSiteOfTheWeek.time) triggerUpdate();
        if ((topSiteOfTheWeek.time + waitingTime) < now) triggerUpdate();

        chrome.storage.local.get("data", function(data) {
    	    try{
    		var test = data.data[100];
    	    } catch (error) {
    		console.log(error.message);
    		console.log(data);
    		console.log(aSiteWePullAndPushTo);
    		updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
		triggerUpdate();
    	    }
        });
        chrome.storage.local.get("data", function(data) {
            var sourceString = aSiteYouVisit.replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(".","");
            console.log("[ Invisible Voice ]: Running - " + sourceString, IVScoreEnabled);
	    code = data.data[sourceString];
	    console.log(code);
            globalCode = sourceString;
            globalSince = code.d;
            try {
                chrome.storage.local.get(globalCode, function(id) {
                    timeSince = Object.values(id)[0];
                    showButton = ((timeSince < now && timeSince > globalSince) || timeSince < (now - waitingTime)) ? false : true;
	        if (IVScoreEnabled){
	           try {
	             if (code.bc == null) throw "no";
	            	     createObjects(code.bc,"bcorp");
	           } catch {
	           	try {
	                  if (code.gr == null) throw "no";
	            	   	  createObjects(gr,"goodonyou");
	           	} catch {
	           		try {
	                          if (code.dr == null) throw "no";
	            	   		  createObjects(code.dr,"glassdoor");
	           		} catch {
	           		try {
	                          if (code.mr == null) throw "no";
	            	   		  createObjects(code.mr,"mbfc");
	           		} catch {
	             		  createObjects();
	           		}
	        	}
	           }}
	        } else {
	            	   createObjects();
	        };
                    appendObjects();
                    inject(globalCode);
                });
            } catch (error) {console.log("[ Invisible Voice ]: "+ error);}
        });
    });
}

var changeMeta = document.createElement("meta");
changeMeta.httpEquiv = "Content-Security-Policy";
changeMeta.content = "upgrade-insecure-requests";

function inject(code) {
    document.head.prepend(changeMeta);
    if (isInjected == false) {
        console.log("[ Invisible Voice ]: Injected - "+ code);
        iframe.src = aSiteWePullAndPushTo + "/" + code + "/";
        isInjected = true;
        found = true;
    }
}

var isCreated = false
function createObjects(value, type) {
    console.log("[ Invisible Voice ]: creating  - "+ IVScoreEnabled);

    open = document.createElement("div");
    open.id = "invisible-voice-floating";
    if (value == null) open.innerHTML = "<img id='invisible-voice-float' style='position: absolute; max-width: inherit; width:68px !important;' src=" + svgloc + ">";
    if (value != null) open.innerHTML = "<div id='invisible-voice-float' style='position:absolute;width:68px;height:68px;background:#ddd;border-radius:68px;color:#111;' ><div id='invisible-voice-float' style='font-size:2em;filter: drop-shadow(2px 2px 0 #aaa);'>" + value + "</div><div style='font-size:.5em;margin-top:-.5em;color:#aaa;filter:drop-shadow(-1px -1px 0 #ccc);' id='invisible-voice-float'>" + type + "</div></div>";
    open.style.cssText = "border: 0px; overflow: visible; left: 20px; bottom: 10px; z-index: 2147483647; position: fixed; color: #DDD;  background-color: rgba(0,0,0,0); font-family: 'Unica Reg', sans-serif; font-size: 24px; visibility: hidden; border-radius: 50%; filter: drop-shadow(.5rem .5rem 1rem #afa); text-align:center; transition: filter .5s;";

    if (isCreated) return;
    close = document.createElement("div");
    close.id = "invisible-voice-button";
    close.innerHTML = " ";
    close.style.cssText = "top:0; left: auto; z-index: 2147483645; position: fixed; background-color: #98FB9821; visibility: hidden; width: 100%; height: 100%;";

    iframe = document.createElement("iframe");
    iframe.style.cssText = "border: 0px; overflow: hidden; padding: 0px; right: auto; width: 86.1vw; height: 86.1vh; top: 6.54vh; left: 6.545vw; z-index: 2147483646; box-shadow: rgba(0, 0, 0, 1) 0 0 4000px; position: fixed; background-color: rgba(255,255,255,0.95); visibility: hidden; border-radius: 25px;";
    iframe.id = "Invisible";
    isCreated = true
};

function appendObjects() {
    document.documentElement.appendChild(iframe);
    document.documentElement.appendChild(close);
    document.documentElement.appendChild(open);
    if (showButton || !IVAutoOpen ) {
        iframe.style.visibility = 'hidden';
        close.style.visibility = 'hidden';
        dragElement(document.getElementById("invisible-voice-floating"));
        chrome.storage.local.get('newplace', function(position) {
            var pos = Object.values(position)[0].split(',');
            // console.log("[ Invisible Voice ]: loading loc" + pos)
            if (pos[0] > 1) pos[0] = 0.9;
            if (pos[0] < 0) pos[0] = 0.1;
            if (pos[1] > 1) pos[1] = 0.9;
            if (pos[1] < 0) pos[1] = 0.1;
            // console.log("[ Invisible Voice ]: loading loc" + (window.innerWidth * pos[1]) + "," + (window.innerHeight * pos[0]))
            open.style.top = (window.innerHeight * pos[0]) + "px";
            open.style.left = (window.innerWidth * pos[1]) + "px";
        })
        open.style.visibility = 'visible';
    } else {
        iframe.style.visibility = 'visible';
        close.style.visibility = 'visible';
    }
};


// Make the DIV element draggable:

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt)) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt).onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        dontOpen = true;
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // console.log(pos1, pos2, pos3, pos4);
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	elmnt.style.filter = "drop-shadow(.5rem .5rem 2rem #afa)";
	elmnt.children[0].style.transform = "scale(1,1)";
	elmnt.style.transition= "filter .5s transform .2s";
    }

    var id = null;

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        clearInterval(id);
        id = setInterval(frame, 10);

        function frame() {
	    var pos2dir = 0,
	        pos1dir = 0;
	    var shadowColor = "inherit";
            if (pos2 > 0) {
                pos2 -= 1;
		pos2dir = 1;
            }
            if (pos2 < 0) {
                pos2 += 1;
		pos2dir = -1
            }
	    
            if (pos1 > 0) {
                pos1 -= 1;
		pos1dir = 1;
            }
            if (pos1 < 0) {
                pos1 += 1;
		pos1dir = -1;
            }

            if (pos1 > 0 || pos1 < 0) elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            if (pos2 > 0 || pos2 < 0) elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

	    elmnt.children[0].style.transform = "scale(" + ( (pos1dir/4) + 1 ) + "," + ( (pos2dir/4) + 1 ) + ")";
	    elmnt.style.filter = "drop-shadow("+ pos1dir + "rem " + pos2dir + "rem 1rem" + shadowColor + ")";

            if (pos1 == 0 && pos2 == 0) {
                clearInterval(id);
		elmnt.style.filter = "drop-shadow(.25rem .25rem 1rem #afa)";
		elmnt.children[0].style.transform = "scale(1,1)";
            }
            if (elmnt.offsetTop > window.innerHeight || elmnt.offsetTop < 0) {
                pos2 *= -1;
	    	shadowColor = "#faa";
            }
            if (elmnt.offsetLeft > window.innerWidth || elmnt.offsetLeft < 0) {
                pos1 *= -1;
	    	shadowColor = "#faa";
            }

	    elmnt.style.transition = "filter .1s";
        }
        var topOffset = elmnt.offsetTop / window.innerHeight;
        var leftOffset = elmnt.offsetLeft / window.innerWidth;
        var placestore = {};
            // console.log("[ Invisible Voice ]: loading loc" + pos)
            if (topOffset > 0.95) topOffset = 0.9;
            if (topOffset < 0) topOffset = 0.1;
            if (leftOffset > 0.95) leftOffset = 0.9;
            if (leftOffset < 0) leftOffset = 0.1;
            elmnt.style.top = (window.innerHeight * topOffset) + "px";
            elmnt.style.left = (window.innerWidth * leftOffset) + "px";
	
        placestore['newplace'] = topOffset + "," + leftOffset;
        chrome.storage.local.set(placestore);
    }
}

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


document.addEventListener('click', function(event) {
    // console.log(dontOpen)
    if (dontOpen != true) {
        // This is to open reopen the box if it needs to be
        if (event.target.matches('#invisible-voice-float')) {
            var dismissData = {};
            dismissData[globalCode] = 0;
            chrome.storage.local.set(dismissData);
            inject(globalCode);
            iframe.style.visibility = 'visible';
            close.style.visibility = 'visible';
            open.style.visibility = 'hidden';
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
        dismissData[globalCode] = now;
        chrome.storage.local.set(dismissData);
        // console.log("[ Invisible Voice ]: Dismiss id ", globalCode);
        iframe.style.visibility = 'hidden';
        close.style.visibility = 'hidden';
        document.documentElement.appendChild(open);
        dragElement(open);
        chrome.storage.local.get('newplace', function(position) {
            var pos = Object.values(position)[0].split(',');
            // console.log("[ Invisible Voice ]: loading loc" + pos)
            if (pos[0] > 1) pos[0] = 0.9;
            if (pos[0] < 0) pos[0] = 0.1;
            if (pos[1] > 1) pos[1] = 0.9;
            if (pos[1] < 0) pos[1] = 0.1;
            open.style.top = (window.innerHeight * pos[0]) + "px";
            open.style.left = (window.innerWidth * pos[1]) + "px";
            open.style.visibility = 'visible';
        })
    }
    dontOpen = false;
}, false);

chrome.runtime.onMessage.addListener(msgObj => {
    console.log("[ Invisible Voice ]: onMessage " + msgObj);
    if (msgObj == "InvisibleVoiceRefresh") {
	if (IVEnabled){
	["invisible-voice-floating"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {console.log(e);};
	});};
        isInjected = false;
	found = false;
        chrome.storage.local.get(function(localdata) {
    	    aSiteWePullAndPushTo = localdata.domainToPull || "https://test.reveb.la";
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
    	    IVScoreEnabled = localdata.scoreEnabled ? true : false;
    	    IVAutoOpen = localdata.autoOpen ? true : false;
    	    IVLocalIndex = localdata.packagedData ? true : false;
            console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull, IVEnabled, IVScoreEnabled);
        });
        getData();
    }
    if (msgObj == "InvisibleVoiceOff") {
	if (IVEnabled){
	["Invisible", "invisible-voice-floating", "invisible-voice-button"].forEach(function(id){
	try{
       	    document.getElementById(id).remove();
        } catch (e) {console.log(e);};
	});};
	isCreated = false;
        chrome.storage.local.get(function(localdata) {
            IVEnabled = (localdata.domainToPull == "NONE") ? false : true;
            console.log("[ Invisible Voice ]: Set to " + localdata.domainToPull);
        });
    }
});
