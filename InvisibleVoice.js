// Simple code that gets the job done by Orange
// Set up environment 
var aSiteYouVisit = window.location.href;
var waitingTime = "480";
var storedObj = { site: "" , url: ""};
var defaultObj = {
	site:  "data:text/html:base64,PCFET0NUWVBFIEhUTUwgUFVCTElDICItLy9XM0MvL0RURCBIVE1MIDQuMDEgVHJhbnNpdGlvbmFsLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw0L2xvb3NlLmR0ZCI+Cgo8aHRtbD4KICAgIDxib2R5PgogICAgICAgICAgICBIZWxsb3cgCiAgICA8L2JvZHk+CjwvaHRtbD4K",
	url: "bbc.co.uk"
};
function onError(e){
	console.error(e);
}
function getData() {
	var storedObj = chrome.storage.local.get(function(topSiteOfTheWeek){
		if ( topSiteOfTheWeek.url || topSiteOfTheWeek.site ){
			chrome.storage.local.set(defaultObj);
		}
		// Then you check to see if when you visit a site it might be a top site
		if (aSiteYouVisit.indexOf(topSiteOfTheWeek.url) >= 0){
		    // Ooooh watch out, that site was sighted, set sites to the replacement!
			window.location.replace(topSiteOfTheWeek.site);
			console.log("replace!");
		}
	});	
}

getData();



function handleAlarm(alarmInfo) {
    console.log("Updating Invisible Voice List");
}

function handleStartup(alarmInfo){
    console.log("Setting alarms");
    var now = new Date();
    var currentTime = now.getTime;
    browser.alarms.create("scheduled-check", {
          currentTime,
          waitingTime
    });
    console.log('next alarm at ::::'+currentTime+" and the current is::::"+new Date().getTime());
};

function handleInstalled(alarmInfo){
    console.log("Setting alarms");
    var now = new Date();
    var currentTime = now.getTime;
    browser.alarms.create("scheduled-check", {
          currentTime,
          waitingTime
    });
    console.log('next alarm at ::::'+currentTime+" and the current is::::"+new Date().getTime());
};

