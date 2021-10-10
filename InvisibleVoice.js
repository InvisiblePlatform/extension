// Simple code that gets the job done by Orange
//

var aSiteWePullAndPushTo = "https://invisible-voice.com/"
chrome.storage.local.get(function(localdata){
		if (!localdata.domainToPull){
			chrome.storage.local.set({"domainToPull": "https://invisible-voice.com/"})
		} else {
			 aSiteWePullAndPushTo = localdata.domainToPull;
		};
});

// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = 480000;
var headers = new Headers();
var globalCode = "";
var init = { method: 'GET',
	         headers: headers,
	         mode: 'cors',
	         cache: 'default' };

var updateJSON = new Request(aSiteWePullAndPushTo + "/index.json", init);
var defaultObj = {
    time: 0,
	newplace: "0.8,0.8",
    url: "www.google", 
	data: [],
};

var sites = {
  "sites": [
    [
      "q364",
      "github.com"
    ],]};
var found = false;
function getData() {
	var timeNow = new Date;
	now = timeNow.getTime();
	chrome.storage.local.get(function(topSiteOfTheWeek){
		if ( !topSiteOfTheWeek.time ){
			chrome.storage.local.set(defaultObj);
		}

		// Find the time to keep it updated
		var newTime = topSiteOfTheWeek.time + waitingTime;
		if ( newTime < now ){
			console.log("[ Invisible Voice ]: Update needed, so updating");
			try {
				fetch(updateJSON)
            	    .then(response => response.json())
					.then(data => chrome.storage.local.set({"data": data}))
					.then(chrome.storage.local.set({"time": now }));
			} catch (error) {
				error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
			}
		}

		chrome.storage.local.get(null, function(items) {
			var allKeys = Object.keys(items);
		});
		chrome.storage.local.get("data", function(data) {
			var sourceString = aSiteYouVisit.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
            console.log("[ Invisible Voice ]: Running - " + sourceString );
			for (code of data.data){
                if ( found == false ) {
				for (link of code.websites){
					// Then you check to see if when you visit a site it might be a top site
					    if (sourceString == link || sourceString == link.replace(/\/$/,"") ){
							globalCode = code.id;
							globalSince = code.lastupdated;
					        // Ooooh watch out, that site was sighted, set sites to the replacement!
        			        document.documentElement.appendChild(iframe);
        			        document.documentElement.appendChild(close);
							try{
								chrome.storage.local.get(globalCode, function(id){
									timeSince = Object.values(id)[0];
								if ( (timeSince < now && timeSince > globalSince) || timeSince < (now - waitingTime)){
									iframe.style.visibility = 'hidden';
									close.style.visibility = 'hidden';
									document.documentElement.appendChild(open);
									dragElement(document.getElementById("invisible-voice-floating"));
									chrome.storage.local.get('newplace', function(position){
										var pos = Object.values(position)[0].split(',');
										console.log("[ Invisible Voice ]: loading loc" + pos)
                                        if (pos[0] > 1){
                                            pos[0] = 0.9;
                                        }
                                        if (pos[0] < 0){
                                            pos[0] = 0.1;
                                        }
                                        if (pos[1] > 1){
                                            pos[1] = 0.9;
                                        }
                                        if (pos[1] < 0){
                                            pos[1] = 0.1;
                                        }
										console.log("[ Invisible Voice ]: loading loc" + (window.innerWidth * pos[1]) + "," + (window.innerHeight * pos[0]))
										open.style.top = (window.innerHeight * pos[0]) + "px";
										open.style.left = (window.innerWidth * pos[1]) + "px";
										open.style.visibility = 'visible';
									})
									open.style.visibility = 'visible';
									console.log("[ Invisible Voice ]: Page Not Replaced " + globalCode);
                                    found = true;
								} else {
									inject(globalCode);
									iframe.style.visibility = 'visible';
									close.style.visibility = 'visible';
									console.log("[ Invisible Voice ]: Page Replaced " + globalCode);
                                    found = true;
								}
								});
							} catch(error) {
								console.log("[ Invisible Voice ]: Key Error", error);
								var firstData = {};
								firstData[globalCode] = code.lastupdated * 100;
								chrome.storage.local.set(firstData);
								chrome.storage.local.get(globalCode, function(id){
									timeSince = Object.values(id)[0];
									console.log("catch", timeSince);
								});
								inject(globalCode);
								iframe.style.visibility = 'visible';
								close.style.visibility = 'visible';
								console.log("[ Invisible Voice ]: Page Replaced");
							}

							break;
					    }
				}
            }
            }
		});
	});	
}

var isInjected = false;
function inject(code) {
    console.log("injecting " + code);
	document.head.prepend(changeMeta);
    if (isInjected == false){
	iframe.src =  aSiteWePullAndPushTo + "posts/" + code + "/"; 
    isInjected = true;
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
    if (frame.style.visibility == 'hidden') {
        floating.style.visibility = 'visible';
    }
};
});

var dontOpen = false;

document.addEventListener('click', function (event) {
    console.log(dontOpen)
    if (dontOpen != true) {
	// This is to open reopen the box if it needs to be
	if (event.target.matches('#invisible-voice-float')){
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
	console.log(event.target);
	var dismissData = {};
	dismissData[globalCode] = now;
	chrome.storage.local.set(dismissData);
	console.log("[ Invisible Voice ]: Dismiss id ", globalCode);
	iframe.style.visibility = 'hidden';
	close.style.visibility = 'hidden';
    document.documentElement.appendChild(open);
	chrome.storage.local.get('newplace', function(position){
		var pos = Object.values(position)[0].split(',');
		console.log("[ Invisible Voice ]: loading loc" + pos)
        if (pos[0] > 1){
            pos[0] = 0.9;
        }
        if (pos[0] < 0){
            pos[0] = 0.1;
        }
        if (pos[1] > 1){
            pos[1] = 0.9;
        }
        if (pos[1] < 0){
            pos[1] = 0.1;
        }
		open.style.top = (window.innerHeight * pos[0]) + "px";
		open.style.left = (window.innerWidth * pos[1]) + "px";
		open.style.visibility = 'visible';
	})
    }
    dontOpen = false;
}, false);


var changeMeta = document.createElement("meta");
changeMeta.httpEquiv = "Content-Security-Policy";
changeMeta.content = "upgrade-insecure-requests";


var close = document.createElement("div");
close.id = "invisible-voice-button";
close.innerHTML = "Close";
close.style.cssText = "border: 0px; overflow: visible; padding: 0px; right: calc(6.54vw + 19px); top: calc(6.54vh + 10px); left: auto; z-index: 2147483647; position: fixed; color: #DDD; background-color: #444; font-family: 'Unica Reg', sans-serif; font-size: 24px; visibility: hidden;";

var iframe = document.createElement("iframe");
iframe.style.cssText = "border: 0px; overflow: hidden; padding: 0px; right: auto; width: 86.1vw; height: 86.1vh; top: 6.54vh; left: 6.545vw; z-index: 2147483646; box-shadow: rgba(0, 0, 0, 1) 0 0 4000px; position: fixed; background-color: rgba(255,255,255,0.95); visibility: hidden; border-radius: 25px;";
iframe.id = "Invisible";


var svgloc = chrome.extension.getURL('logo.svg');
var open = document.createElement("div");
open.id = "invisible-voice-floating";
open.innerHTML = "<img id='invisible-voice-float' style='position: absolute; max-width: inherit; width:68px !important;' src=" + svgloc + ">";
open.style.cssText = "border: 0px; overflow: visible; left: 20px; bottom: 10px; z-index: 2147483647; position: fixed; color: #DDD;  background-color: rgba(0,0,0,0); font-family: 'Unica Reg', sans-serif; font-size: 24px; visibility: hidden; border-radius: 50%; filter: drop-shadow(.5rem .5rem 1rem #afa); width: 1em; height: 1em; text-align:center;";

// Make the DIV element draggable:

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
    dontOpen=true;
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    console.log(pos1, pos2, pos3, pos4);
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  var id = null;
  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    clearInterval(id);
    id = setInterval(frame,10);
    function frame(){
         if (pos1 == 0 && pos2 == 0){
            clearInterval(id);
         }
         if (pos2 > 0){
             pos2 -= 1;
             elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
         }
         if (pos2 < 0){
             pos2 += 1;
             elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
         }
         if (pos1 > 0){
             pos1 -= 1;
             elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
         }
         if (pos1 < 0) {
             pos1 += 1;
             elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
         }
         if (elmnt.offsetTop > window.innerHeight || elmnt.offsetTop < 0 ){
             console.log("TURN");
            pos2 *= -1;
         }
         if (elmnt.offsetLeft > window.innerWidth || elmnt.offsetLeft < 0 ){
             console.log("TURN");
            pos1 *= -1;
         }
           console.log(pos1, pos2);  
    }
	var placestore = {};
	var topOffset = elmnt.offsetTop / window.innerHeight;
	var leftOffset = elmnt.offsetLeft / window.innerWidth;
	placestore['newplace'] = topOffset  + "," + leftOffset ;
	chrome.storage.local.set(placestore);
  }
}


getData();
