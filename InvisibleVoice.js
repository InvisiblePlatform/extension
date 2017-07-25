// Simple code that gets the job done by Orange

// Delay til next update 
var waitingTime = "480";

// You got your naming of the window href
var aSiteYouVisit = window.location.href;

// Then you got your top site of the week declaration thats the one to look out for
var topSiteOfTheWeek = "bbc.co.uk";

// Then you check to see if when you visit a site it might be a top site
if (aSiteYouVisit.indexOf(topSiteOfTheWeek) >= 0){
    // Ooooh watch out, that site was sighted, set sites to the replacement!
    window.location.replace(chrome.extension.getURL('MoveAlong.html'));
}

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

browser.alarms.onAlarm.addListener(handleAlarm);
browser.runtime.onInstalled.addListener(handleInstalled);
browser.runtime.onStartup.addListener(handleStartup);
