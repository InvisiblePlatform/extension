var debug = true;
var aSiteWePullAndPushTo = "https://test.reveb.la";
var voteUrl = "https://assets.reveb.la";
var now = new Date().getTime();
var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)";
var seenTabs = [];

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
let localReplace = browser.runtime.getURL('replacements.json');
let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let psl = browser.runtime.getURL('public_suffix_list.dat');

var blockedHashes = [];
var apiKey = '';

async function updateApiKey() {
  browser.storage.local.get("apiKey", function (key) {
    console.log(key.apiKey);
    apiKey = key.apiKey;
    return apiKey
  });
}

apiKey = updateApiKey()

var headers = new Headers();
var init = {
  method: "GET",
  headers: headers,
  mode: "cors",
  credentials: "include",
  cache: "default",
};

fetch(new Request(localIndex, init))
  .then((response) => response.json())
  .then((data) => browser.storage.local.set({ data: data }))

fetch(new Request(localHash, init))
  .then((response) => response.json())
  .then((data) => (hashes = data));

fetch(new Request(localSite, init))
  .then((response) => response.json())
  .then((data) => (lookup = data));

fetch(new Request(localReplace, init))
  .then((response) => response.json())
  .then((data) => (replace = data));

fetch(new Request(psl, init)).then((response) => {
  if (response.ok) {
    parsePSL(response.body).then((data) => {
      publicSuffixes = data;
    });
  }
})

function fetchIndexes() {
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

fetchIndexes();
function lookupDomainHash(domainInfo) {
  let domainString = domainInfo.domain
  let sourceString = domainString.replace(/\./g, "");
  let hashforsite = lookup[domainString];
  if (hashforsite === undefined) {
    replacementLookupPattern = `/${sourceString}/`;
    lookupPattern = replace[replacementLookupPattern];
    if ("t" in lookupPattern) {
      hashforsite = lookup[lookupPattern["t"].replace(/\//g, "")];
    }
  }

  let siteData = hashes[hashforsite] ? hashes[hashforsite] : null;
  return {
    "hashforsite": hashforsite,
    "siteData": siteData,
    "domainString": domainString,
    "subdomains": domainInfo.subdomains,
    "sourceString": sourceString
  };
}

function lookupDomain(url) {
  let domainString = url.replace(/\.m\./g, '.')
    .replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./, '');
  let domainInfo = parseDomain(domainString, publicSuffixes);
  return lookupDomainHash(domainInfo);
}


function blockCheck() {
  if (seenTabs.length === 0) return;
  if (browser.storage.local.get("blockedHashes").then(x => {
    return !(x === undefined || x === null || x == {});
  })) return;
  browser.tabs.query({ active: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url === undefined) return;
      if (tab.url.startsWith("about:")) return;
      if (tab.url.startsWith("chrome:")) return;
      if (tab.url.startsWith("moz-extension:")) return;
      if (tab.url.startsWith("file:")) return;
      if (tab.url.startsWith("chrome-extension:")) return;
      if (tab.url.startsWith("view-source:")) return;
      if (tab.url.startsWith("data:")) return;
      if (tab.url.startsWith("blob:")) return;
      if (seenTabs.includes(tab.id)) {
        browser.tabs.sendMessage(tab.id, "InvisibleVoiceBlockCheck");
      }
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
async function postMake(post_type, content, location) {
  if (apiKey == '') {
    apiKey = await updateApiKey()
  }
  var postHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    post_type,
    content,
    location,
    api_session_token: apiKey
  };
  var postVars = {
    method: "POST",
    headers: postHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  console.log(postVars)
  console.log(`${data.content}`);
  var ret = await fetch(new Request(voteUrl + "/post", postVars))
    .then((response) => {
      console.log(response)
      response.json();
    })
    .then((ret) => {
      console.log(ret)
      return ret;
    });
  return ret;
}

async function getInfoList(list_of_locations) {
  var postHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    locations: list_of_locations,
  };
  var postVars = {
    method: "POST",
    headers: postHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  var responseData = await fetch(new Request(voteUrl + "/get-data-list", postVars))
    .then((response) => response.json())
    .then((data) => {
      if (debug) console.log(data);
      return data;
    });
  return responseData;
}

async function voteAsyncPost(site, type) {
  if (apiKey == '') {
    apiKey = await updateApiKey()
  }
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
  type = "domainhash";
  if (site.includes("/")) {
    type = "module";
    if (site.split("/")[1] === "post") {
      type = "post";
    }
  }
  voteHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    type: type,
    location: site,
    direction: direction,
    api_session_token: apiKey,
  };
  console.log(data)
  var voteVars = {
    method: "POST",
    headers: voteHeaders,
    credentials: "include",
    body: JSON.stringify(data),
  };
  var data = await fetch(new Request(voteUrl + "/vote", voteVars))
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  return data;
}

// For voting
async function voteAsync(site, direction, type = "domainHash") {
  if (apiKey == '') {
    apiKey = await updateApiKey()
  }
  var voteHeaders = new Headers({
    "Content-Type": "application/json",
  });
  var data = {
    type: "domainhash",
    location: site,
    direction: direction,
    api_session_token: apiKey,
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

async function voteTotal(site, v2 = false) {
  console.log(site);
  var voteHeaders = new Headers({
    site: site,
  });
  var voteVars = {
    method: "GET",
    credentials: "include",
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

function parseDomain(domain, publicSuffixes) {
  const parts = domain.split('.').reverse()
  const suffix = getSuffix(parts, publicSuffixes);
  if (suffix == null) return null
  const suffixSize = suffix.split('.').length;
  const suffixLessParts = parts.reverse().slice(suffixSize);
  const subdomains = suffixLessParts.slice(1);
  return {
    domain: domain,
    subdomains: subdomains,
    suffix: suffix
  };
}
function getSuffix(parts, publicSuffixes) {
  let domainParts = parts.reverse();
  let longestMatch = null;
  for (let i = 0; i < domainParts.length; i++) {
    const suffix = domainParts.slice(i).join('.');
    const match = publicSuffixes.find(ps => ps.suffix == suffix);
    if (match) {
      if (!longestMatch || suffix.length > longestMatch.length) {
        longestMatch = match;
      }
    }
  }
  if (longestMatch !== null) return longestMatch.suffix;
  return null
}

async function getNotificationData(domainKey) {
  let availableData = await browser.storage.local.get("siteData").then((data) => {
    if (data.siteData === undefined) {
      return null;
    }
    if (domainKey in data.siteData) {
      return data.siteData[domainKey];
    }
    return null;
  })
  if (availableData) {
    console.log("Returning available data");
    return availableData;
  }
  let domainTags = await browser.storage.local.get("data").then((data) => {
    return data.data[domainKey];
  });
  const tagArray = domainTags.k.split('');
  let requestList = [domainKey];
  const siteFilterData = await browser.storage.local.get("data").then((data) => {
    return Object.keys(data.data).filter((key) => {
      const item = data.data[key];
      if (typeof item.k === 'string') {
        return tagArray.some((tag) => item.k.includes(tag));
      }
      return false;
    }
    )
  })
  while (requestList.length < 9) {
    const randomIndex = Math.floor(Math.random() * siteFilterData.length);
    if (requestList.includes(siteFilterData[randomIndex])) {
      continue;
    }
    requestList.push(siteFilterData[randomIndex]);
  }
  let externalState = null;
  const actualRequestList = await browser.storage.local.get("siteData").then((data) => {
    let currentState = data.siteData || {};
    requestListResponse = [];
    for (let i = 0; i < requestList.length; i++) {
      if (requestList[i] in currentState) {
        continue;
      }
      requestListResponse.push(requestList[i]);
    }
    return requestListResponse;
  })
  if (actualRequestList.length === 0) {
    return await browser.storage.local.get("siteData").then((data) => {
      return data.siteData;
    })
  }
  currentState = await browser.storage.local.get("siteData").then((data) => {
    return data.siteData;
  })
  if (currentState === undefined) {
    currentState = {};
    browser.storage.local.set({ siteData: currentState });
  }
  for (let i = 0; i < actualRequestList.length; i++) {
    externalState = fetch(`${aSiteWePullAndPushTo}/db/${actualRequestList[i]}.json`, init)
      .then((response) => response.json())
      .then((data) => {
        currentState[actualRequestList[i]] = data;
        browser.storage.local.set({ siteData: currentState });
        return currentState;
      })
  }
  return await currentState[domainKey];
}

// Domain handling
// PSL 2023/06/23 updated
async function parsePSL(pslStream) {
  const decoder = new TextDecoder();
  const reader = pslStream.getReader();
  let chunk;
  let pslData = '';
  while (!(chunk = await reader.read()).done) {
    const decodedChunk = decoder.decode(chunk.value, { stream: true });
    pslData += decodedChunk;
  }
  const lines = pslData.trim().split('\n');
  const publicSuffixes = [];
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith('//')) {
      continue; // Ignore empty lines and comments
    }
    const isException = trimmedLine.startsWith('!');
    const domainOrRule = trimmedLine.substring(isException ? 1 : 0);
    const isWildcard = domainOrRule.startsWith('*');
    const suffix = isWildcard ? domainOrRule.substring(1) : domainOrRule;
    if (isException) {
      const lastSuffix = publicSuffixes[publicSuffixes.length - 1];
      if (lastSuffix && lastSuffix.exceptionRules) {
        lastSuffix.exceptionRules.push(suffix);
      } else {
        console.warn('Exception rule without preceding regular rule:', trimmedLine);
      }
    } else {
      publicSuffixes.push({ suffix, exceptionRules: [] });
    }
  }
  return publicSuffixes;
}


browser.runtime.onMessage.addListener(function (msgObj, sender, sendResponse) {
  console.log(msgObj, sender);
  firstKey = Object.keys(msgObj).filter(x => x.startsWith("I"))[0]
  if (sender.tab !== undefined)
    if (seenTabs.indexOf(sender.tab.id) === -1) seenTabs.push(sender.tab.id);
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
        const post_type = msgObj[firstKey].post_type
        const content = msgObj[firstKey].content
        const location = msgObj[firstKey].location
        var data = await postMake(post_type, content, location);
        sendResponse(data);
      })();
      break;
    case "InvisibleRequestList":
      (async function () {
        var data = await getInfoList(msgObj[firstKey]);
        sendResponse(data);
      })();
      break;
    case "IVPostVoteUp":
    case "IVPostVoteDown":
    case "IVPostVoteUn":
    case "InvisibleModuleVote":
      (async function () {
        console.log(msgObj);
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
    case "InvisibleDomainCheck":
      data = lookupDomain(msgObj[firstKey]);
      sendResponse(data);
      break;
    case "IvGetNotificationData":
      (async function () {
        var data = await getNotificationData(msgObj[firstKey]);
        if (data === undefined) {
          data = await getNotificationData(msgObj[firstKey]);
        }
        if (data === undefined) {
          data = false;
        }
        sendResponse(data);
      })();
      break;
  }
  return true;
});

setInterval(blockCheck, 10000);
