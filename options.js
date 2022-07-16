var headers = new Headers();
var update;
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};
var timeNow = new Date;
now = timeNow.getTime();
var current = document.getElementById("current");

chrome.storage.local.get(function(localdata) {
    if (localdata.domainToPull == "https://test.reveb.la") current.innerHTML = "TESTING";
    if (localdata.domainToPull == "https://invisible-voice.com/") current.innerHTML = "PRODUCTION";
    if (localdata.domainToPull == "NONE") current.innerHTML = "OFF";
    resize();
});

function resize(){
    var xScale = 120/current.scrollWidth;
    if (xScale < 1) current.style.transform = "scaleX(" + xScale + ")";
}

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("iv-mode")) {
        return;
    }

    var chosenmode = e.target.textContent;
    update = false;
    if (chosenmode == "IV OFF") {
        // Turn it off
        chrome.storage.local.set({
            "domainToPull": "NONE"
        });
    	current.innerHTML = "OFF"; resize();
    } else if (chosenmode == "IV Dev") {
        update = true;
        chrome.storage.local.set({
            "domainToPull": "https://test.reveb.la"
        });
        var updateJSON = new Request("https://test.reveb.la/index.json", init);
    	current.innerHTML = "TESTING"; resize();
    } else if (chosenmode == "IV Production") {
        update = true;
        chrome.storage.local.set({
            "domainToPull": "https://invisible-voice.com/"
        });
        var updateJSON = new Request("https://invisible-voice.com/index.json", init);
    	current.innerHTML = "PRODUCTION"; resize();
    }
    if (update) {
        console.log("[ Invisible Voice ]: Update needed, so updating");
        try {
            fetch(updateJSON)
                .then(response => response.json())
                .then(data => chrome.storage.local.set({
                    "data": data
                }))
                .then(chrome.storage.local.set({
                    "time": now
                }))
                .then(console.log("[ Invisible Voice ]: Updated"));
        } catch (error) {
            error => console.log("[ Invisible Voice ]: Fetch Error", error.message)
        }
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, "InvisibleVoiceRefresh");
            });
        });
	setTimeout(function(){
    		console.log('after');
	},500);
    } else {
        chrome.tabs.query({}, tabs => {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, "InvisibleVoiceOff");
            });
        });

    }
});
