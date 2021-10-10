var headers = new Headers();
var globalCode = "";
var init = { method: 'GET',
	         headers: headers,
	         mode: 'cors',
	         cache: 'default' };
var timeNow = new Date;
now = timeNow.getTime();

function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({"domainToPull": document.querySelector("#url").value });
  var updateJSON = new Request(document.querySelector("#url").value + "/index.json", init);
  console.log("[ Invisible Voice ]: Update needed, so updating");
  try {
  	fetch(updateJSON)
  	    .then(response => response.json())
  		.then(data => chrome.storage.local.set({"data": data}))
  		.then(chrome.storage.local.set({"time": now }))
        .then(console.log("[ Invisible Voice ]: Updated"));
  } catch (error) {
  	error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
  }
}

function restoreOptions() {
	var aSiteWePullAndPushTo = "https://invisible-voice.com/"
	chrome.storage.local.get(function(localdata){
		if (!localdata.domainToPull){
			chrome.storage.local.set({"domainToPull": "https://invisible-voice.com/"})
			document.querySelector("#url").value = "https://invisible-voice.com/";
		} else {
			console.log(localdata.domainToPull)
			document.querySelector("#url").value = localdata.domainToPull;
		};
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
