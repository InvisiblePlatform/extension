// Simple code that gets the job done by Orange
// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = 480000;
var headers = new Headers();
var globalCode = "";
var init = { method: 'GET',
	         headers: headers,
	         mode: 'cors',
	         cache: 'default' };

var updateJSON = new Request('https://test.reveb.la/index.json', init);
var defaultObj = {
    time: 0,
    url: "www.google", 
	data: [],
};

var sites = {
  "sites": [
    [
      "q364",
      "github.com"
    ],]};

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
            fetch(updateJSON)
                .then(response => response.json())
				.then(data => chrome.storage.local.set({"data": data}))
                .catch(error => console.log("[ Invisible Voice ]: Fetch Error", error.message ));
			chrome.storage.local.set({"time": now });
		}

		chrome.storage.local.get(null, function(items) {
			var allKeys = Object.keys(items);
		});
		chrome.storage.local.get("data", function(data) {
			for (code of data.data){
				for (link of code.websites){
					// Then you check to see if when you visit a site it might be a top site
						var sourceString = aSiteYouVisit.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
					    if (sourceString == link ){
							globalCode = code.id;
							globalSince = code.lastupdated;
					        // Ooooh watch out, that site was sighted, set sites to the replacement!
        			        document.documentElement.appendChild(iframe);
        			        document.documentElement.appendChild(close);
							try{
								chrome.storage.local.get(globalCode, function(id){
									timeSince = Object.values(id)[0];
									console.log("try", timeSince);
								if ( timeSince < now && timeSince > globalSince){
								    iframe.remove();
									close.remove();
									console.log("[ Invisible Voice ]: Page Not Replaced" + link);
								} else {
									inject(globalCode);
									console.log("[ Invisible Voice ]: Page Replaced" + link);
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
								console.log("[ Invisible Voice ]: Page Replaced");
							}

							break;
					    }
				}
			}
		});
	});	
}

function inject(code) {
    console.log("injecting " + code);
	document.head.prepend(changeMeta);
	iframe.src =  "https://test.reveb.la/posts/" + code + "/index.html"; 
}

document.addEventListener('click', function (event) {
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
    iframe.remove();
    close.remove();
}, false);


var changeMeta = document.createElement("meta");
changeMeta.httpEquiv = "Content-Security-Policy";
changeMeta.content = "upgrade-insecure-requests";


var close = document.createElement("div");
close.id = "invisible-voice-button";
close.innerHTML = "Close";
close.style.cssText = "border: 0px; overflow: visible; padding: 0px; right: 6.54vw; top: 6.54vh; left: auto; z-index: 2147483647; position: fixed; color: #DDD; background-color: #444; font-family: 'Unica Reg', sans-serif; font-size: 24px;";

var iframe = document.createElement("iframe");
iframe.style.cssText = "border: 0px; overflow: hidden; padding: 0px; right: auto; width: 86.1vw; height: 86.1vh; top: 6.54vh; left: 6.545vw; z-index: 2147483646; box-shadow: rgba(0, 0, 0, 0.498039) 0px 3px 10px; position: fixed; background-color: #fff;";
iframe.id = "Invisible";
iframe.onkeypress = "deject();"



getData();
