// Simple code that gets the job done by Orange

// You got your naming of the window href
var aSiteYouVisit = window.location.href;

// Then you got your top site of the week declaration thats the one to look out for
var topSiteOfTheWeek = "dalailama.com";

// Then you check to see if when you visit a site it might be a top site
if (aSiteYouVisit.indexOf(topSiteOfTheWeek) >= 0){
    // Ooooh watch out, that site was sighted, set sites to the replacement!
    window.location.replace(chrome.extension.getURL('MoveAlong.html'));
}
