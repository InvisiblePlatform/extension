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
    } else if (chosenmode == "IV Dev") {
        update = true;
        chrome.storage.local.set({
            "domainToPull": "https://test.reveb.la"
        });
        var updateJSON = new Request("https://test.reveb.la/index.json", init);
    } else if (chosenmode == "IV Production") {
        update = true;
        chrome.storage.local.set({
            "domainToPull": "https://invisible-voice.com/"
        });
        var updateJSON = new Request("https://invisible-voice.com/index.json", init);
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
    }
});
