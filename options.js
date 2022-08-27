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
var localIndex = 'index.json';
var enable = document.getElementById("enable");
var score = document.getElementById("score");
var autoopen = document.getElementById("autoopen");
var packaged = document.getElementById("packaged");
var IVScoreEnabled = false;
var updateJSON;
var propertyOrder;

chrome.storage.local.get(function(localdata) {
    if (localdata.domainToPull == "https://test.reveb.la") enable.checked = true;
    if (localdata.domainToPull == "NONE") enable.checked = false;
    if (localdata.scoreEnabled) score.checked = true;
    if (localdata.autoOpen) autoopen.checked = true;
    if (localdata.packagedData) packaged.checked = true;
    if (localdata.propertyOrder) propertyOrder = localdata.propertyOrder;
    console.log(localdata.propertyOrder);
    slist(document.getElementById("sortlist"));
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

function slist (target) {
  // (A) SET CSS + GET ALL LIST ITEMS
  target.classList.add("slist");
  let items = target.getElementsByTagName("li"), current = null;
  for (let x = 0; x < propertyOrder.length; x++){
    items[x].innerHTML = propertyOrder[x];
  };
  

  // (B) MAKE ITEMS DRAGGABLE + SORTABLE
  for (let i of items) {
    // (B1) ATTACH DRAGGABLE
    i.draggable = true;

    // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
    i.ondragstart = (ev) => {
      current = i;
      for (let it of items) {
        if (it != current) { it.classList.add("hint"); }
      }
    };

    // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
    i.ondragenter = (ev) => {
      if (i != current) { i.classList.add("active"); }
    };

    // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
    i.ondragleave = () => {
      i.classList.remove("active");
    };

    // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
    i.ondragend = () => { for (let it of items) {
        it.classList.remove("hint");
        it.classList.remove("active");
    }};

    // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
    i.ondragover = (evt) => { evt.preventDefault(); };

    // (B7) ON DROP - DO SOMETHING
    i.ondrop = (evt) => {
      evt.preventDefault();
      if (i != current) {
        let currentpos = 0, droppedpos = 0;
        for (let it=0; it<items.length; it++) {
          if (current == items[it]) { currentpos = it; }
          if (i == items[it]) { droppedpos = it; }
        }
        if (currentpos < droppedpos) {
          i.parentNode.insertBefore(current, i.nextSibling);
        } else {
          i.parentNode.insertBefore(current, i);
        }
      }
      let outItems = [];
      for (let it=0; it<items.length; it++){
	outItems.push(items[it].innerHTML);
      } 
      chrome.storage.local.set({
          "propertyOrder": outItems
      });
      console.log(outItems);
    };
  }
}
