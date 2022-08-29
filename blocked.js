var headers = new Headers();
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};
var localSite = chrome.runtime.getURL('sitetohash.json');
var localHash = chrome.runtime.getURL('hashtosite.json');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

domainString = urlParams.get("site");
returnString = urlParams.get("return");

var hashforsite;
fetch(new Request(localSite, init))
    .then(response => response.json())
    .then(data => data[domainString])
    .then(global => hashforsite = global)
    .then(hashforsite => console.log("[ IV ] "+ domainString + ":" + hashforsite));


chrome.storage.local.get(function(localdata) {
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
    // Prevent page load
    console.log("blocking: ", blockedHashes.toString());
    if (blockedHashes.includes(hashforsite)){
    // lookup hash
    	fetch(new Request(localHash, init))
        	.then(response => response.json())
        	.then(data => data[hashforsite])
        	.then(global => setPageValues(global));
	//window.location.replace(chrome.runtime.getURL('blocked.html') + "?site=" +domainString);
    };
});

function isMatch(value){
	return value != hashforsite;
}

function setPageValues(value){
    	boycott = document.getElementById("Invisible-boycott");
	boycott.innerHTML = "UNBOYCOTT THE FOLLOWING: <br/>" + value.toString().replace(/,/g,'<br/>');
}

document.addEventListener('click', function(event) {
        if (event.target.matches('#Invisible-boycott')) {
		console.log("unboycott: " + hashforsite );
		chrome.storage.local.set({"blockedHashes": blockedHashes.filter(isMatch)});
		window.location.replace("https://" + domainString);
        };
}, false);
