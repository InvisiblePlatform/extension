// Simple code that gets the job done by Orange
// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = "480";
var headers = new Headers();

var init = { method: 'GET',
	         headers: headers,
	         mode: 'no-cors',
	         cache: 'default' };

var updateJSON = new Request('https://antisocial.club/invisibletest.json', init);
var defaultObj = {
	site:  "data:text/html;charset=utf-8;base64,PCFET0NUWVBFIEhUTUwgUFVCTElDICItLy9XM0MvL0RURCBIVE1MIDQuMDEgVHJhbnNpdGlvbmFsLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw0L2xvb3NlLmR0ZCI+Cgo8aHRtbD4KICAgIDxib2R5PgogICAgICAgICAgICBIZWxsb3cgCiAgICA8L2JvZHk+CjwvaHRtbD4K",
	url: "bbc.co.uk",
	time: "1500000000"
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
