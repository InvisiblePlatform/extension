function saveOptions(e) {
  e.preventDefault();
  chrome.storage.local.set({"domainToPull": document.querySelector("#url").value });
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
