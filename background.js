var debug = true;
var aSiteWePullAndPushTo = "https://test.reveb.la";
var voteUrl = "https://assets.reveb.la";
var now = new Date().getTime();
var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)";

if (chrome) {
  browser = chrome;
  identifier = "fafojfdhjlapbpafdcoggecpagohpono";
}
const frRegex = /Firefox/i;
if (frRegex.test(navigator.userAgent)) {
  identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon";
}

var localIndex = browser.runtime.getURL("index.json");
var IVLocalIndex = true;
var allowUpdate = false;
var updateJSON; // Request

// Lookup variables
var lookup;
var localSite = browser.runtime.getURL("sitetohash.json");

var blockedHashes = [];

var headers = new Headers();
var init = {
  method: "GET",
  headers: headers,
  mode: "cors",
  cache: "default",
};

fetch(new Request(localSite, init))
  .then((response) => response.json())
  .then((data) => (lookup = data));

function fetchIndex() {
  browser.storage.local.get(function (localdata) {
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
    if (localdata.time + 480000 < now) allowUpdate = true;

    if (debug) console.log(localdata);
    if (debug && !IVLocalIndex)
      console.log("[ Invisible Voice ]: Set to " + aSiteWePullAndPushTo);
    if (debug && IVLocalIndex)
      console.log("[ Invisible Voice ]: Set to LocalIndex");
    updateJSON = IVLocalIndex
      ? new Request(aSiteWePullAndPushTo + "/index.json", init)
      : new Request(localIndex, init);
    // Prevent page load
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
  });
  if (allowUpdate)
    fetch(updateJSON)
      .then((response) => response.json())
      .then((data) => browser.storage.local.set({ data: data }))
      .then(browser.storage.local.set({ time: now }));
}

fetchIndex();
function lookupDomainHash(domain) {
  domainString = domain
    .replace(/\.m\./g, ".")
    .replace(/http[s]*:\/\/|www\./g, "")
    .split(/[/?#]/)[0]
    .replace(/^m\./g, "");
  hashforsite = lookup[domainString];
  if (hashforsite === undefined)
    if (domainString.split(".").length > 2) {
      domainString = domainString.split(".").slice(1).join(".");
      hashforsite = lookup[domainString];
    }
  return JSON.stringify({
    sourceString: domainString.replace(/\./g, ""),
    domainString: domainString,
    hashforsite: hashforsite,
  });
}

function blockCheck() {
  browser.tabs.query({ active: true }, (tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, "InvisibleVoiceBlockCheck");
    });
  });
}
async function postGet(location) {
  postHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    location: location,
  };
  var postVars = {
    method: "POST",
    headers: postHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  console.log(`getting post for ${location}`);
  console.log(postVars);
  var data = await fetch(new Request(voteUrl + "/get-post", postVars))
    .then((response) => response.json())
    .then((data) => {
      if (debug) console.log(data);
      if (location.startsWith("db/")) {
        data["topLevel"] = true;
      }
      return data;
    });
  return data;
}
async function postMake(opts) {
  var postHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    post_type: opts["post_type"],
    content: opts["content"],
    location: opts["location"],
  };
  var postVars = {
    method: "POST",
    headers: postHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  console.log(opts["location"], opts["content"], opts["post_type"]);
  var data = await fetch(new Request(voteUrl + "/post", postVars))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return data;
}

async function voteAsyncPost(site, type) {
  var direction;
  switch (type) {
    case "IVPostVoteUp":
      direction = "up";
      break;
    case "IVPostVoteDown":
      direction = "down";
      break;
    case "IVPostVoteUnvote":
      direction = "un";
      break;
  }

  voteHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    type: "domainhash",
    location: site,
    direction: direction,
  };
  var voteVars = {
    method: "POST",
    headers: voteHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  console.log(site, direction);
  var data = await fetch(new Request(voteUrl + "/vote", voteVars))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return data;
}

// For voting
async function voteAsync(site, direction, type = "domainHash") {
  var voteHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    type: "domainhash",
    location: site,
    direction: direction,
  };
  var voteVars = {
    method: "POST",
    headers: voteHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  console.log(site, direction);
  var data = await fetch(new Request(voteUrl + "/vote", voteVars))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return data;
}

async function vote(site, direction) {
  var voteHeaders = new Headers({
    site: site,
    direction: direction,
  });
  var voteVars = {
    method: "POST",
    headers: voteHeaders,
    mode: "nocors",
  };
  console.log(site, direction);
  var data = await fetch(new Request(voteUrl + "/vote", voteVars))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return data;
}

async function voteTotal(site, v2 = false) {
  console.log(site);
  var voteHeaders = new Headers({
    site: site,
  });
  var voteVars = {
    method: "GET",
    headers: voteHeaders,
  };
  var stub = v2 ? "/get-data-v2" : "/get-data";
  var data = await fetch(new Request(voteUrl + stub, voteVars))
    .then((response) => response.json())
    .then((data) => {
      if (v2) data["location"] = site;
      return data;
    });
  return data;
}

async function updateWithSiteData(data) {
  domainKey = data["domainKey"];
  siteDataObj = data["siteDataObj"];
  browser.storage.local.get((localdata) => {
    const currentState = localdata.siteData || {};
    currentState[domainKey] = siteDataObj;
    browser.storage.local.set({ siteData: currentState });
  });
  return "Update Set";
}

browser.runtime.onMessage.addListener(function (msgObj, sender, sendResponse) {
  console.log(msgObj);
  firstKey = Object.keys(msgObj)[0];
  switch (firstKey) {
    case "InvisibleOpenPopup":
      browser.action.openPopup();
      break;
    case "InvisibleVoteUpvote":
    case "InvisibleVoteDownvote":
    case "InvisibleVoteUnvote":
      direction = firstKey
        .replace("InvisibleVote", "")
        .replace("vote", "")
        .toLowerCase();
      (async function () {
        var data = await voteAsync(msgObj[Object.keys(msgObj)[0]], direction);
        sendResponse(data);
      })();
      break;
    case "InvisibleVoteTotal":
      (async function () {
        var data = await voteTotal(msgObj[firstKey]);
        sendResponse(data);
      })();
      break;
    case "InvisibleGetPost":
      (async function () {
        var data = await postGet(msgObj[firstKey]);
        if ("error" in data) return;
        sendResponse(data);
      })();
      break;
    case "InvisibleMakePost":
      (async function () {
        var data = await postMake(msgObj[firstKey]);
        sendResponse(data);
      })();
      break;
    case "InvisibleModuleVote":
      (async function () {
        var data = await voteAsyncPost(msgObj[firstKey], msgObj["type"]);
        sendResponse(data);
      })();
      break;
    case "InvisibleSiteDataUpdate":
      (async function () {
        var data = await updateWithSiteData(msgObj[firstKey]);
        sendResponse(data);
      })();
      break;
    case "InvisibleModuleInfo":
      (async function () {
        var data = await voteTotal(msgObj[firstKey], true);
        sendResponse(data);
      })();
      break;
    case "InvisibleVoiceReblock":
      setTimeout(function () {
        hashtoadd = msgObj[Object.keys(msgObj)[0]];
        browser.storage.local.get(function (localdata) {
          blockedHashes = localdata.blockedHashes
            ? localdata.blockedHashes
            : [];
        });
        blockedHashes.push(hashtoadd);
        browser.storage.local.set({ blockedHashes: blockedHashes });
      }, 1000);
      blockCheck();
      break;
    case "IVHASH":
      data = lookupDomainHash(msgObj[firstKey]);
      sendResponse(data);
      break;
  }
  return true;
});

setInterval(blockCheck, 10000);
