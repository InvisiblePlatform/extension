// var tongueTaker{};

// var isThisThingEvenOn = 'nope not yet';

// window.addEventListener("DOMContentLoaded", deVoice, false);

var aSiteYouVisit = window.location.href;

//function moveAlongFriend(){
//    window.location.replace({url: "./along.html"});
//}

//function deVoice(){
    var topSiteOfTheWeek = "dalailama.com";
    if (aSiteYouVisit.indexOf(topSiteOfTheWeek) >= 0){
//	moveAlongFriend();	
    window.location.replace(chrome.extension.getURL('along.html'));
    }

    isThistThingEvenOn = "yes";
//}

//function reVoice(){
    // haha nah, you have to remove the extension friend
//}

//deVoice();

