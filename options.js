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
var localIndex = chrome.extension.getURL('index.json');
var enable = document.getElementById("enable");
var score = document.getElementById("score");
var autoopen = document.getElementById("autoopen");
var packaged = document.getElementById("packaged");
var IVScoreEnabled = false;
var updateJSON;

chrome.storage.local.get(function(localdata) {
    if (localdata.domainToPull == "https://test.reveb.la") enable.checked = true;
    if (localdata.domainToPull == "NONE") enable.checked = false;
    if (localdata.scoreEnabled) score.checked = true;
    if (localdata.autoOpen) autoopen.checked = true;
    if (localdata.packagedData) packaged.checked = true;
});

function update(){
    console.log("[ Invisible Voice ]: Update needed, so updating");
    if (packaged.checked){
    updateJSON = new Request(localIndex, init);
    } else {
    updateJSON = new Request("https://test.reveb.la/index.json", init);
    }
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
    rerender();
    setTimeout(function(){
    	console.log('after');
    },500);
}

function rerender(){
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, "InvisibleVoiceRefresh");
        });
    });
}

document.addEventListener("click", (e) => {
    if (e.target.type != 'checkbox') return;
    document.querySelectorAll('input').forEach(function(tog){
	if (tog.id == "enable" && tog.checked){
            chrome.storage.local.set({
                "domainToPull": "https://test.reveb.la"
            });
	    update();
	} 
	if (tog.id == "enable" && !tog.checked){
            chrome.storage.local.set({
                "domainToPull": "NONE"
            });
            chrome.tabs.query({}, tabs => {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, "InvisibleVoiceOff");
                });
            });
	} 
	if (tog.id == "score" && tog.checked) chrome.storage.local.set({"scoreEnabled": true });
	if (tog.id == "score" && !tog.checked) chrome.storage.local.set({"scoreEnabled": false });
	if (tog.id == "autoopen" && tog.checked) chrome.storage.local.set({"autoOpen": true });
	if (tog.id == "autoopen" && !tog.checked) chrome.storage.local.set({"autoOpen": false });
	if (tog.id == "packaged" && tog.checked) chrome.storage.local.set({"packagedData": true });
	if (tog.id == "packaged" && !tog.checked) chrome.storage.local.set({"packagedData": false });
	console.log(tog.checked, tog.id);
    })
});
