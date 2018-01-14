// Simple code that gets the job done by Orange
// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = "480";
var headers = new Headers();

var init = { method: 'GET',
	         headers: headers,
	         mode: 'cors',
	         cache: 'default' };

var updateJSON = new Request('https://invisible-voice.com/data.json', init);
var defaultObj = {
    time: "1516492799", 
    url: "www.foxnews.com", 
    site: "https://invisible-voice.com/gary-dejean/foxnews.html"
};

function getData() {
	var timeNow = new Date;
	now = timeNow.getTime();
	chrome.storage.local.get(function(topSiteOfTheWeek){
		if ( !topSiteOfTheWeek.time || !topSiteOfTheWeek.url || !topSiteOfTheWeek.site ){
			chrome.storage.local.set(defaultObj);
		}

		// Find the time to keep it updated
		var newTime = topSiteOfTheWeek.time + waitingTime;
		if ( newTime < now ){
			console.log("[ Invisible Voice ]: Update needed, so updating");
            fetch(updateJSON)
                .then(response => response.json())
                .then(data => chrome.storage.local.set(data))
                .catch(error => console.log("[ Invisible Voice ]: Fetch Error", error.message ));
		}

		// Then you check to see if when you visit a site it might be a top site
		if (aSiteYouVisit.indexOf(topSiteOfTheWeek.url) >= 0){
		    // Ooooh watch out, that site was sighted, set sites to the replacement!
			var site = topSiteOfTheWeek.site;
			window.location.replace(site);
			console.log("[ Invisible Voice ]: Page Replaced");
		}
	});	
}

getData();
