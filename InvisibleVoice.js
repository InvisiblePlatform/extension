// "Simple" code that gets the job done by Orange
// Set up environment 
var globalCode = "";

// The Elements we inject
aSiteYouVisit = window.location.href;
allowUpdate = true;

distance = 0;
var oldNetworkDistance;

var open;
var domainInfo;
var bgresponse;
var username, pretty_name;
keepOnScreen = true;

var buttonOffsetVal = 16;
var buttonOffset = buttonOffsetVal + "px";

var Loaded = false;
var addingId = '#'

var backgroundColor = "#fff";
var textColor = "#343434";
var heavyTextColor = "#111";

var voteUrl = "https://assets.reveb.la";

var globalCode, code;

var IVBlock = false;
var bubbleMode = 0;
var loggedIn;
var dismissForever;
const notificationQuantityBottomOffsets = {
  1: -8,
  2: -58,
  3: -108,
  4: -158
};

function isMatchingLabel(value, preference) {
  const { labels } = preference;
  return labels.includes(value);
}

class notification {
  constructor(label, value, alttitle, source, isSS) {
    this.label = label;
    this.value = value;
    this.alttitle = alttitle;
    this.source = source;
    this.isSS = isSS;

    this.name = (this.alttitle) ? this.alttitle : this.label;
    this.sourceString = (this.source) ? `<h3>${this.source}</h3>` : '';
    this.item = document.createElement("div");
    this.item.classList.add("IVNotItem");
    this.item.onclick = this.handleNotificationClick;
    if (this.isSS) this.item.classList.add("IVNotItemSS");
    this.item.innerHTML = `
      <h1>${this.name}</h1>
      <h2${this.isSS ? ' style="font-size:1em"' : ''}>${this.value}</h2>
      ${this.sourceString}
    `;
    this.item.setAttribute("data-infotype", this.label);
  }

  handleNotificationClick() {
    const dismissData = {};
    dismissData[globalCode] = 0;
    browser.storage.local.set(dismissData);
    resize("load");
  }
}


class notificationDisplay {
  constructor(visible, domainKey, tags) {
    this.visible = visible;
    this.domainKey = domainKey;
    this.dismissed = false;
    this.showNubbin = true;
    this.opened = false;
    this.loadedIV = false;
    this.element = this.generateElement();
    this.expandElement = this.element.getElementsByClassName("IVNotificationExpand")[0];
    // the expandElementLocation is an array with the first element being the side of the screen
    // and the second element being the location as a percentage from the top of the screen
    // ["right", 0] would be the top right corner, ["left", 0] would be the top left corner
    // ["right", 50] would be the middle right side of the screen
    this.expandElementLocation = ["right", 0]
    this.notifications = [];
    this.notificationRequestList = [];

    this.tags = tags;
    this.matchedTags = [];
  }

  generateElement() {
    const notificationShade = document.createElement("div");
    notificationShade.id = "IVNotification";
    notificationShade.classList.add("IVNotification");
    notificationShade.classList.add("noNotifications");
    notificationShade.onclick = handleNotificationClick;
    const closeButton = document.createElement("div");
    closeButton.classList.add("IVNotificationClose");
    closeButton.onclick = this.collapse;
    closeButton.innerHTML = closeCross;
    notificationShade.appendChild(closeButton);
    const expandButton = document.createElement("div");
    expandButton.classList.add("IVNotificationExpand");
    expandButton.onclick = this.expand;
    expandButton.innerHTML = ivLogoArrowElement;
    notificationShade.appendChild(expandButton);
    const dismissOnSiteButton = document.createElement("div");
    dismissOnSiteButton.classList.add("IVNotificationDismiss");
    dismissOnSiteButton.onclick = this.dissmissForDomain;
    dismissOnSiteButton.textContent = dirtyTranslate("dismiss-on-site");
    notificationShade.appendChild(dismissOnSiteButton);
    const notificationsContainer = document.createElement("div");
    notificationsContainer.classList.add("IVNotificationsContainer");
    notificationShade.appendChild(notificationsContainer);
    const notificationSeeOnIV = document.createElement("div");
    notificationSeeOnIV.classList.add("IVNotificationSeeOnIV");
    notificationSeeOnIV.textContent = dirtyTranslate("invisible-voice-available");
    notificationSeeOnIV.onclick = () => {
      resize("load");
    }
    notificationShade.appendChild(notificationSeeOnIV);
    return notificationShade;
  }

  addElementToPage() {
    browser.storage.local.get("expandButtonLocation", ({ expandButtonLocation }) => {
      if (expandButtonLocation) {
        this.expandElementLocation = expandButtonLocation;
      }
      const [side, location] = this.expandElementLocation;
      this.element.classList.add(side);
      const notificationsOffsetY = Math.max(Math.min(location * window.innerHeight, window.innerHeight - this.element.offsetHeight), 0);
      // if location is beyond notificationOffsetY then we move expandElement the rest of the distance
      var difference = location * window.innerHeight - notificationsOffsetY;
      if (difference > 0) {
        var notificationCount = Math.min(notificationD.matchedTags.length, 4);
        notificationD.element.style.setProperty("--top", `${notificationQuantityBottomOffsets[notificationCount]}px`);
      } else {
        notificationD.element.style.setProperty("--top", "");
      }
      this.element.style.setProperty("--offsetY", `${notificationsOffsetY}px`);
    })
    document.documentElement.appendChild(this.element);
    this.enableDraggingOnExpandElement();
  }
  enableDraggingOnExpandElement() {
    // Make the expand element draggable:
    // it will be a bit different than the bobble, as we want to keep it "stuck"
    // to the side of the screen, and only allow it to move up and down
    // however, if we try to drag past the middle of the screen, we want it to snap sides
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var elmnt = this.expandElement;
    var currentLocation = this.expandElementLocation;
    elmnt.addEventListener("mousedown", dragMouseDown);
    elmnt.addEventListener("touchstart", dragMouseDown);


    var notificationElementHeight = 0;
    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX || e.changedTouches[0].clientX;
      pos4 = e.clientY || e.changedTouches[0].clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("touchend", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
      document.addEventListener("touchmove", elementDrag);
      notificationElementHeight = notificationD.element.offsetHeight;
      notificationD.element.classList.add("dragging");
    }

    function elementDrag(e) {
      e.preventDefault();
      var eX = e.clientX || e.changedTouches[0].clientX;
      var eY = e.clientY || e.changedTouches[0].clientY;
      // get current position from element
      pos2 = elmnt.style.transform.replace(/[^0-9,]/g, "").split(",")[1];
      pos4 = eY
      // if eX is greater than half the screen width, move to the right side
      if (eX > window.innerWidth / 2) {
        currentLocation[0] = "right";
        notificationD.element.classList.add("right");
        notificationD.element.classList.remove("left");
      } else {
        currentLocation[0] = "left";
        notificationD.element.classList.add("left");
        notificationD.element.classList.remove("right");
      }

      // we need to also offset the notifications container, but 
      // we want to keep it in the screen, so we have to limit it to 
      // the height of the screen minus the height of the notification element
      let notificationsOffsetY = Math.max(Math.min(pos4, window.innerHeight - notificationElementHeight), 0);
      // we want to handle this in the css so set an "--offsetY" variable
      notificationD.element.style.setProperty("--offsetY", `${notificationsOffsetY}px`);
      // if location is beyond notificationOffsetY then we move expandElement the rest of the distance
      let difference = pos4 - notificationsOffsetY;
      if (difference > 0) {
        var notificationCount = Math.min(notificationD.matchedTags.length, 4);
        console.log({ difference, notificationCount, notificationQuantityBottomOffsets })
        notificationD.element.style.setProperty("--top", `${notificationQuantityBottomOffsets[notificationCount]}px`);
      } else {
        notificationD.element.style.setProperty("--top", "");
      }
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("touchend", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
      document.removeEventListener("touchmove", elementDrag);
      let location = Math.max(Math.min(pos4 / window.innerHeight, 1.0), 0.1);
      let side = currentLocation[0];
      browser.storage.local.set({ 'expandButtonLocation': [side, location] });
      setTimeout(() => {
        notificationD.element.classList.remove("dragging");
      }, 100);
    }

  }

  expand() {
    notificationD.opened = true;
    if (notificationD.dismissed || notificationD.matchedTags.length === 0) {
      if (debug) console.log("dismissed, so opening IV");
      resize("load");
      this.loadedIV = true;
      return;
    }
    document.getElementById("IVNotification").classList.toggle("onScreen");
  }

  collapse() {
    this.opened = false;
    document.getElementById("IVNotification").classList.toggle("onScreen");
  }

  generateNotificationRequestList(currentState) {
    const requestList = [this.domainKey];
    const indexList = currentState;
    if (typeof indexList === 'object' && indexList !== null) {
      const tagArray = [...this.matchedTags];

      const filteredList = Object.keys(indexList).filter(key => {
        const item = indexList[key];
        if (typeof item.k === 'string') {
          return tagArray.some(substring => item.k.includes(substring));
        }
      });
      while (requestList.length < 9) {
        const randomIndex = Math.floor(Math.random() * filteredList.length);
        if (!requestList.includes(filteredList[randomIndex])) {
          requestList.push(filteredList[randomIndex]);
        }
      }
    }
    this.notificationRequestList = requestList;

    for (let i = 0; i < requestList.length; i++) {
      if (currentState[requestList[i]]) continue;
      if (!requestList[i]) continue;
      fetch(`${aSiteWePullAndPushTo}/db/${requestList[i]}.json`, init)
        .then(response => response.json())
        .then(state => {
          currentState[requestList[i]] = state.data;
          browser.storage.local.set({ "siteData": currentState });
        });
    }
  }

  fetchNotificationData(domainKey) {
    this.notificationRequestList.forEach(domain => {
      fetch(`${aSiteWePullAndPushTo}/db/${domain}.json`, init)
        .then(response => response.json())
        .then(state => {
          currentState[domain] = state.data;
          if (domain === domainKey) {
            this.matchedTags.forEach(tag => this.processNotification(tag, state.data));
          }
          return currentState
        }).then(currentState => browser.storage.local.set({ "siteData": currentState }));
    });
  }

  attemptToDisplay() {
    if (this.matchedTags.length > 0) {
      this.fetchNotificationData(this.domainKey);
    }

    if (!this.dismissed) {
      this.visible = true;
      document.documentElement.appendChild(this.element);
    }

    if (this.showNubbin) {
      const nubbin = document.createElement("div");
      nubbin.classList.add("IVNubbin");
    }
  }

  updateDisplayIcon() {
    if (notificationD.matchedTags.length > 0) {
      notificationD.expandElement.innerHTML = threeDots;
      notificationD.element.style.setProperty("--notificationCount", `"${notificationD.matchedTags.length}"`);
    } else {
      notificationD.expandElement.innerHTML = ivLogoArrowElement;
    }
  }

  displayNotification(tag, value, alttitle, source) {
    // if (debug) console.log(`${tag},${value},${source}`);
    const tagLabel = tagLookup[tag]; // Get the label for the tag
    const isSS = tag === 'm'; // Check if it's a special case for "m" tag
    this.addItemToNotification(null, tagLabel, value, isSS, alttitle, source);

    if (document.getElementById("IVNotification")) {
      if (document.getElementById("IVNotification").classList.contains("noNotifications")) {
        document.getElementById("IVNotification").classList.remove("noNotifications");
      }
    }
  }

  addItemToNotification(event, labelName = "BaddyScore", score = "91", isSS = false, alttitle = false, source = false) {
    const newNotification = new notification(labelName, score, alttitle, source, isSS);
    this.element.getElementsByClassName("IVNotificationsContainer")[0].appendChild(newNotification.item);
    this.notifications.push(newNotification);

    if (!document.getElementById("IVNotification") && !keepOnScreen) {
      setTimeout(() => {
        this.element.classList.remove("shown");
        console.log("removing")
      }, 5000);
    }
  }

  dissmissForDomain() {
    this.dismissed = true;
    document.getElementById("IVNotification").remove();
    settingsState["dissmissedNotifications"].push(domainString.replace(/\./g, ""));
    browser.storage.local.set({ "settings_obj": JSON.stringify(settingsState) });
  }
  processNotification(tag, dataObj) {
    const value = dataObj[tag];
    const preferences = settingsState["userPreferences"] || defaultUserPreferences;
    if (!preferences[tag]) return;
    const { type } = preferences[tag];
    const repeat = tagsDuplicatable.includes(tag);
    let repeatCount = 1;
    let items = [tag]
    if (repeat) {
      items = Object.keys(dataObj).filter(dataTag => dataTag.startsWith(tag));
      repeatCount = items.length;
    }
    for (let i = 0; i < repeatCount; i++) {
      const currentItem = repeat ? dataObj[items[i]] : value;
      let source = (tag !== "m") ? dataObj[`_${items[i]}`] : false;

      switch (type) {
        case "range":
          if (isInRange(currentItem, preferences[tag])) {
            this.displayNotification(tag, currentItem, false, source);
          }
          break;
        case "label":
          for (const place in currentItem) {
            const label = currentItem[place];
            if (isMatchingLabel(label, preferences[tag])) {
              this.displayNotification(tag, label, false, source);
            }
          }
          break;
        case "multiRange":
          for (const item in currentItem) {
            const { s: source, m: modules } = currentItem[item];
            for (const mod in modules) {
              const data = modules[mod];
              this.displayNotification(tag, data.r, data.s.replaceAll("_", " ").slice(5), source);
            }
          }
          break;
        default:
          break;
      }
    }
  }
}
let notificationD = null;

var notificationsToShow = false;
var notificationsDismissed = false;
function enableNotifications() {
  browser.storage.local.get(data => {
    const tags = (settingsState.notificationsTags || '');
    const domainKey = sourceString
    if (!data.data || !data.data.hasOwnProperty(domainKey)) {
      return;
    }
    if (notificationD === null) {
      notificationD = new notificationDisplay(false, false, domainKey, tags);
      notificationD.addElementToPage();
    } else {
      notificationD.visible = false;
      notificationD.domainKey = domainKey;
      notificationD.tags = tags;
    }
    if (settingsState["notifications"] == "false") {
      console.log("notifications disabled");
      return;
    }

    if (settingsState["dissmissedNotifications"].includes(domainKey)) {
      console.log("notifications dismissed on this domain");
      notificationD.dismissed = true;
      return;
    }
    bgRequestNotificationData(domainKey);
  });
}

function bgRequestNotificationData(domainKey) {
  const sending = browser.runtime.sendMessage({ "IvGetNotificationData": domainKey })
  sending.then(response => {
    if (response) {
      const { k: tags } = response.data;
      const matchedTags = notificationD.tags.split('').filter(tag => tags.includes(tag));
      notificationD.matchedTags = matchedTags;
      if (matchedTags.length > 0) {
        matchedTags.forEach(tag => notificationD.processNotification(tag, response.data))
      }
      notificationD.updateDisplayIcon();
    }
  })

}

function createNotificationElement(tagName, className, textContent, clickHandler) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (tagName == "img") {
    element.src = textContent;
  } else {
    element.textContent = textContent;
  }
  if (clickHandler)
    element.onclick = clickHandler;
  return element;
}


function createObjects() {
  blockCheck();
  if (settingsState.bobbleOverride == "true") {
    bubbleMode = 1;
  }
  enableNotifications();
  if (debug) console.log("[ Invisible Voice ]: creating ");
  if ((bubbleMode == 0 && phoneMode) || debug == true) {
    browser.storage.local.get(function (localdata) {
      if (settingsState.bobbleMode != "true") {
        bobble = document.createElement("div");
        buttonSize = 40;
        bobble.style.cssText = `
                    width:${buttonSize}px!important;
                    background-image:url(${buttonSvg})!important;
                    height:${buttonSize}px!important;
                    z-index: 2147483647!important;
                    background-size: ${buttonSize}px ${buttonSize}px;!important`;
        // bobble.setAttribute("onclick", this.remove());
        bobble.id = "InvisibleVoice-bobble";
        document.documentElement.appendChild(bobble);
        dragElement(document.getElementById("InvisibleVoice-bobble"));
        browser.storage.local.get('newplace', function (position) {
          var pos = Object.values(position)[0].split(',') || [0, 0];
          // console.log("[ Invisible Voice ]: loading loc" + pos)
          if (pos[0] > 1) pos[0] = 0.9;
          if (pos[0] < 0) pos[0] = 0.1;
          if (pos[1] > 1) pos[1] = 0.9;
          if (pos[1] < 0) pos[1] = 0.1;
          // console.log("[ Invisible Voice ]: loading loc" + (window.innerWidth * pos[1]) + "," + (window.innerHeight * pos[0]))
          bobble.style.top = (window.innerHeight * pos[0]) + "px";
          bobble.style.left = (window.innerWidth * pos[1]) + "px";
        })
      }
    })
  }
  if (phoneMode) return;
  iframe = document.createElement("iframe");
  open = document.createElement("div");
  open.id = "invisible-voice-window";
  open.style.cssText =
    `width: ${buttonOffset}!important;
         border-color:${textColor}!important;
         background-color:${backgroundColor}!important;
         color: ${textColor}!important;`;
  iframe.id = "Invisible";
  iframe.style.cssText = `border-color:${textColor}!important;
                          background-color:${backgroundColor}!important;
                          top:0px!important;right:0px!important;position:fixed!important;margin:0!important;`
  document.documentElement.appendChild(iframe);
  document.documentElement.appendChild(open);
  resize("close");
  open.style.right = "0";
  if (!phoneMode) iframe.style.width = distance + 'px';
  if (!phoneMode) iframe.style.height = '100dvh';
};


const loginCheck = async () => {
  try {
    postURL = `${voteUrl}/auth/am-i-logged-in`
    headers = new Headers({
      "content-type": 'application/json'
    });

    const dataf = await fetch(postURL, {
      method: "GET",
      headers: headers,
      credentials: 'include',
    })
    const response = await dataf.json()
    if (response.hasOwnProperty("username")) {
      const username = response.username;
      console.log(`Logged in as ${username}/${response.pretty_name}`)
      browser.storage.local.set({ "username": username, "pretty_name": response.pretty_name, "apiKey": response.apiKey });
      console.log(browser.storage.local.get())
    }
  } catch (e) {
    //console.log(e)                                                      
    var username;
    browser.storage.local.get("username", function (storedName) {
      username = storedName.username;
      if (username != undefined) {
        browser.storage.local.remove("username")
        browser.storage.local.remove("pretty_name")
        browser.storage.local.remove("apiKey")
        console.log(`[ IV ] "${username}" logged out of extension`)
      } else {
        console.log(`not logged in`)
      }
    });
  }
}
closedSize = 0;
openSize = 500;
networkSize = 840;
let resize = function (x) {

  if (typeof (open.style) === 'undefined') return;
  if (phoneMode) return;
  if (debug) console.log(x)
  // Set default value for x
  if (typeof x === 'undefined') x = "";

  // Transition properties
  open.style.transition = "right 0.2s";
  iframe.style.transition = "width 0.2s";
  open.style.transform = "translateX(16px)";

  // Handle the different distance scenarios
  if (x === "close") {
    distance = closedSize;
    iframe.src = "about:blank";
    Loaded = false;

    // Handle notification shade if it exists
    let notificationShade = document.getElementById("IVNotification");
    if (notificationShade) {
      notificationShade.style.opacity = 1;
    }

    open.style.transform = "translateX(16px)";
    open.style.transition = "transform 0.2s";
    iframe.style.transition = "none";
  } else if (x === "network") {
    oldNetworkDistance = distance;
    distance = networkSize;
  } else {
    distance = openSize;
  }

  if (x !== "close") {
    // Handle notification shade if it exists
    let notificationShade = document.getElementById("IVNotification");
    if (notificationShade) {
      notificationShade.style.opacity = 0;
    }
  }


  if (x === "load" && !Loaded) {
    ourdomain = `${aSiteWePullAndPushTo}/db/?site=${globalCode}`
    ourdomain += "&date=" + Date.now() + "&vote=true";
    if (loggedIn) ourdomain += `&username=${pretty_name}`;
    if (addingId != '#') {
      ourdomain += addingId
      distance = openSize;
    }

    iframe.src = ourdomain;
    console.log(globalCode);
    Loaded = true;
  }
  // Set the right and width values
  open.style.right = distance + 'px';
  iframe.style.width = distance + 'px';
  if (debug) console.log(`${x}, ${distance}, ${oldNetworkDistance}`)
};

if (aSiteYouVisit.includes(voteUrl)) {
  console.log("[ IV ] Assets Site")
  loginCheck();
}


function blockCheck() {
  if (debug) console.log("Block Check");
  browser.storage.local.get(function (localdata) {
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
  });
  if (blockedHashes !== undefined && blockedHashes.includes(hashforsite)) {
    fetch(new Request(localHash, init))
      .then(response => response.json())
      .then(data => data[hashforsite]);
    window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
  };
}
// Make the DIV element draggable:
var bonce = 0;
function dragElement(elmnt) {
  if (debug) console.log(elmnt);
  if (debug) console.log("draggable enabled");
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.addEventListener("mousedown", dragMouseDown);
  elmnt.addEventListener("touchstart", dragMouseDown);

  function dragMouseDown(e) {
    if (debug) console.log("draggable mousedown");
    e.preventDefault();
    pos3 = e.clientX || e.changedTouches[0].clientX;
    pos4 = e.clientY || e.changedTouches[0].clientY;

    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("touchend", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("touchmove", elementDrag);
    if (debug) console.log(e);
    if (phoneMode) {
      if (debug) console.log("draggableClick: " + once)
      bonce += 1;
      if (bonce > 1) {
        browser.runtime.sendMessage({ "InvisibleOpenPopup": true });
        bonce = 0;
      }
    }
  }

  function elementDrag(e) {
    dontOpen = true;
    e.preventDefault();
    var eX = e.clientX || e.changedTouches[0].clientX;
    var eY = e.clientY || e.changedTouches[0].clientY;
    pos1 = pos3 - eX;
    pos2 = pos4 - eY;
    pos3 = eX;
    pos4 = eY;

    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.filter = "drop-shadow(.5rem .5rem 2rem #afa)";
    elmnt.style.transition = "filter .5s transform .2s";
    elmnt.style.transform = "scale(1,1)";
    elmnt.innerHTML = ""
    bonce = 0;
  }

  var id = null;

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.removeEventListener("mouseup", closeDragElement);
    document.removeEventListener("touchend", closeDragElement);
    document.removeEventListener("mousemove", elementDrag);
    document.removeEventListener("touchmove", elementDrag);

    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
      const step = (num) => (num > 0 ? 1 : num < 0 ? -1 : 0);
      const shadowColor = (pos) => (pos !== 0 ? "#faa" : "inherit");
      const pos1dir = step(pos1);
      const pos2dir = step(pos2);
      pos1 -= pos1dir;
      pos2 -= pos2dir;
      if (pos1 !== 0) elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      if (pos2 !== 0) elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.transform = `scale(${pos1dir / 4 + 1}, ${pos2dir / 4 + 1})`;
      elmnt.style.filter = `drop-shadow(${pos1dir}rem ${pos2dir}rem 1rem ${shadowColor(pos1dir)})`;
      if (pos1 === 0 && pos2 === 0) {
        clearInterval(id);
        elmnt.style.filter = "drop-shadow(.25rem .25rem 1rem #afa)";
        elmnt.style.transform = "scale(1,1)";
      }
      if (elmnt.offsetTop > window.innerHeight || elmnt.offsetTop < 0) pos2 *= -1;
      if (elmnt.offsetLeft > window.innerWidth || elmnt.offsetLeft < 0) pos1 *= -1;
      elmnt.style.transition = "filter .1s";
    }

    var topOffset = Math.max(Math.min(elmnt.offsetTop / window.innerHeight, 0.9), 0.1);
    var leftOffset = Math.max(Math.min(elmnt.offsetLeft / window.innerWidth, 0.9), 0.1);

    elmnt.style.top = (window.innerHeight * topOffset) + "px";
    elmnt.style.left = (window.innerWidth * leftOffset) + "px";
    elmnt.style.backgroundColor = "";

    posY = 40 + Number(elmnt.style.top.replace("px", ""))
    posX = 20 + Number(elmnt.style.left.replace("px", ""))
    console.log(posY)
    // const links = document.getElementsByTagName("a");
    // for (const link in links) {
    //   var linkBB;
    //   try {
    //     linkBB = links[link].getBoundingClientRect()
    //   } catch (e) { }
    //   upperBound = linkBB.top;
    //   lowerBound = upperBound + linkBB.height
    //   if (upperBound < posY && lowerBound > posY) {
    //     upperLimit = linkBB.left;
    //     lowerLimit = upperLimit + linkBB.width;
    //     if (upperLimit < posX && lowerLimit > posX) {

    //       if (typeof (links[link].href) != 'undefined') {
    //         elmnt.style.backgroundColor = "red";
    //         elmnt.style.borderRadius = "200px";
    //         elmnt.innerHTML = `
    //             <span id="IVHoverGo" style="text-align: center;
    //             transform-origin: center;
    //             transform: translate(-50%, 40px);
    //             position: inherit;
    //             background-color:white;"> ${links[link].href.replace(/\.m\./g, '.').replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '')} </span>
    //           `
    //       }

    //     }
    //     console.log("X " + posX + " Y " + posY + " B " + upperLimit + "LB" + lowerLimit)
    //   }
    // }
    browser.storage.local.set({ 'newplace': topOffset + "," + leftOffset });
  }
}

function boycott() {
  aSiteYouVisit = window.location.href;
  console.log("boycott")
  window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
}

function startDataChain() {
  startUpStart();
  processSettingsObject(true).then(
    domainCheckBg(aSiteYouVisit))

}

var once = 0;
function handleNotificationClick(event) {
  const clickedElement = event.target;
  const domainKey = domainString.replace(/\./g, "");
  const notification = document.getElementById("IVNotification");
  if (event.target.matches('.IVNotificationClose')) {
    return;
  }
  if (event.target.matches('.IVNotificationExpand')) {
    return;
  }
  //if (notification) {
  //  notification.remove();
  //  settingsState["dissmissedNotifications"].push(domainKey);
  //  browser.storage.local.set({ "settings_obj": JSON.stringify(settingsState) });
  //}
  if (phoneMode) {
    if (once > 0) {
      browser.runtime.sendMessage({ "InvisibleOpenPopup": true });
      once = 0;
    }
    once++;
    return;
  }

  let node = clickedElement;
  if (!node.classList.contains("IVNotItem")) {
    node = clickedElement.parentNode;
    if (!node.classList.contains("IVNotItem")) {
      return;
    }
  }
  const dataInfotype = node.getAttribute("data-infotype");
  addingId = `#${idLookup[dataInfotype]}`;

  const dismissData = {};
  dismissData[globalCode] = 0;
  browser.storage.local.set(dismissData);

  resize("load");
}


function dismissNotification() {
  notificationsDismissed = true;
  if (document.getElementById("IVNotification") != null)
    document.getElementById("IVNotification").remove();
  if (debug) console.log("notification dismissed")
}

function bobbleClick() {
  if (phoneMode) {
    console.log("notificationClick: " + once)
    once += 1;
    if (once > 1) {
      browser.runtime.sendMessage({ "InvisibleOpenPopup": true });
      once = 0;
    }
    return;
  }
}

var changeMeta = document.createElement("meta");
changeMeta.setAttribute('http-equiv', "Content-Security-Policy");
changeMeta.setAttribute("content", "upgrade-insecure-requests");

document.addEventListener('fullscreenchange', function () {
  var isFullScreen = document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen || (document.msFullscreenElement != null);
  floating = document.getElementById("invisible-voice-window");
  floating.style.visibility = (isFullScreen) ? 'hidden' : 'visible';
  notificationD.element.style.visibility = (isFullScreen) ? 'hidden' : 'visible';
});

document.addEventListener('mouseup', function (event) {
  if (dontOpen != true) {
    // This is to reopen the box if it needs to be
    if (event.target.matches('#invisible-voice-window')) {
      var dismissData = {};
      dismissData[globalCode] = 0;
      browser.storage.local.set(dismissData);
      resize("load");
    };
    // If the clicked element doesn't have the right selector, bail
    if (!event.target.matches('#invisible-voice-button')) return;
    // Don't follow the link

    event.preventDefault();
    resize();
    open.style.right = distance + buttonOffsetVal + 'px';
  }
  dontOpen = false;
});

window.addEventListener('message', function (e) {

  const { type, data } = e.data;
  if (type === undefined) return;
  if (debug) console.log(`${type} Stub ${data}`);

  switch (type) {
    case 'IVSettingsReq':
      processSettingsObject().then(function (x) {
        const message = {
          message: "SettingsUpdate",
          data: settingsState
        }
        sendMessageToPage(message)
      })
      break;
    case 'IVSiteDataUpdate':
      browser.runtime.sendMessage({ [actionLookup[type]]: data });
      break;

    case 'IVNotificationsPreferences':
      if (debug) console.log("UserPreference stub", data);
      browser.storage.local.set({ "userPreferences": data });
      break;


    case 'IVLike':
    case 'IVDislike':
      if (data != '') {
        const messageType = voteStatus === updown[type] ? "InvisibleVoiceUnvote" : actionLookup[type];
        browser.runtime.sendMessage({ [messageType]: hashforsite });
      }
      break;

    case 'IVBoycott':
      if (data != '') {
        blockedHashes.push(hashforsite);
        browser.storage.local.set({ "blockedHashes": blockedHashes });
        aSiteYouVisit = window.location.href;
        window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
      }
      break;

    case 'IVGetPost':
    case 'IVMakePost':
    case 'IVPostStuff':
      if (data != '') {
        if (debug) console.log(e.data.data)
        const sending = browser.runtime.sendMessage({ [actionLookup[type]]: data })
        sending.then(actionLookupCallBack[type], handleError)
      }
      break;
    case 'IVPostVoteUp':
    case 'IVPostVoteDown':
    case 'IVPostVoteUnvote':
      if (data != '') {
        if (debug) console.log(data)
        const sending = browser.runtime.sendMessage({ "InvisibleModuleVote": data, "type": type })
        sending.then(forwardPosts, handleError)
      }
      break;

    case 'IVVoteStuff':
      if (data != '') {
        if (!voteCode) {
          voteCode = data;
          const sending = browser.runtime.sendMessage({ "InvisibleVoteTotal": voteCode });
          sending.then(forwardVote, handleError);
        } else {
          const command = `InvisibleVote${toTitleCase(data)}vote`;
          const message = { [command]: voteCode };
          const sending = browser.runtime.sendMessage(message);
          sending.then(forwardVote, handleError);
        }
      }
      break;
    case 'IVClicked':
      if (data && data !== 'titlebar' && data !== 'settings') {
        if (level2.includes(data)) resize();
        else if (['antwork', 'graph-box'].includes(data)) resize("network");
        else if (data === 'back') resize();
        else if (data === 'unwork') resize();
        else if (distance === openSise) resize();
      }
      break;
    case 'IVNotificationsCacheClear':
      if (debug) console.log("NotCacheClear stub", data);
      browser.storage.local.set({ "siteData": {} });
      browser.storage.local.set({ "userPreferences": defaultUserPreferences });
      if (settingsState["notifications"]) dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotificationsTags':
      if (debug) console.log("Tags stub", e.data.data);
      browser.storage.local.set({ "notificationTags": data });
      if (settingsState["notifications"]) dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotifications':
      if (debug) console.log("Notifications stub", data);
      browser.storage.local.set({ "notifications": data });

      if (data == "true") {
        notificationsDismissed = false;
        if (debug) console.log("notifications were " + settingsState["notifications"]);
        if (document.getElementById("IVNotification") === null) enableNotifications();
        settingsState["notifications"] = true
      } else {
        if (settingsState["notifcations"]) dismissNotification();
        settingsState["notifications"] = "false";
      }
      break;

    case 'IVKeepOnScreen':
      if (debug) console.log("keep on screen stub", data);
      if (e.data.data == "true") {
        distance = 0;
        resize("load");
      }
      break;
    case 'IVSettingsChange':
      console.log("Settings Saved")
      browser.storage.local.set({ "settings_obj": JSON.stringify(data) });
      processSettingsObject();
      break;
    case 'IVDarkModeOverride':
      if (debug) console.log("DarkMode stub", data);
      break;
    case 'IVIndexRefresh':
      fetchIndex();
      break;
    case 'IVClose':
      resize("close");
      break;
    case 'IVRequest':
      if (data != '') {
        const sending = browser.runtime.sendMessage({ [actionLookup[type]]: data });
        sending.then(forwardInfo, handleError);
      }
      break;
  }
});

browser.runtime.onMessage.addListener(msgObj => {
  console.log(msgObj)
  if (msgObj === "InvisibleVoiceBlockCheck" && aSiteYouVisit !== window.location.href) {
    blockCheck();
  } else {
    if (debug) console.log(msgObj);
  }
  const firstKey = Object.keys(msgObj)[0];
  if (firstKey === "InvisibleVoiceReblock") {
    const hashtoadd = msgObj[firstKey];
    setTimeout(() => {
      browser.storage.local.get(({ blockedHashes }) => {
        blockedHashes = blockedHashes || [];
        blockedHashes.push(hashtoadd);
        browser.storage.local.set({ "blockedHashes": blockedHashes });
        if (debug) console.log("block: ", hashtoadd);
        if (debug) console.log("block: ", blockedHashes);
      });
    }, 1000);
  }
});

var lastScrollTop = 0;
var showButton = true;
window.addEventListener("scroll", function () {
  var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
  if (document.getElementById("InvisibleVoice-bobble") != undefined) {
    if (st > lastScrollTop) {
      if (showButton) {
        bobble = document.getElementById("InvisibleVoice-bobble");
        bobble.style.display = "none";
        bobble.onclick = bobbleClick;
        showButton = false;
      }
    } else if (st < lastScrollTop) {
      if (!showButton) {
        bobble = document.getElementById("InvisibleVoice-bobble");
        showButton = true;
        bobble.style.display = "block";
      }
    }
  }
  lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);

startDataChain();
