var aSiteWePullAndPushTo = "https://test.reveb.la";

// Set browser to chrome if chromium based
const chrRegex = /Chr/i;
const frRegex = /Firefox/i;
const phoneRegex = /iPhone/i;

browser = chrome || browser;

var phoneMode = false

if (chrRegex.test(navigator.userAgent)) identifier = "fafojfdhjlapbpafdcoggecpagohpono"
if (frRegex.test(navigator.userAgent)) identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"
if (phoneRegex.test(navigator.userAgent)) phoneMode = true;

console.log(phoneMode)
// Various Lookups
let localReplace = browser.runtime.getURL('replacements.json');
let localHash = browser.runtime.getURL('hashtosite.json');
let localSite = browser.runtime.getURL('sitetohash.json');
let buttonSvg = browser.runtime.getURL('button.svg');
let psl = browser.runtime.getURL('public_suffix_list.dat');
let localIndex = browser.runtime.getURL('index.json');

var lookup = {};
var dontOpen = false;
var blockedHashes;
var settingsState;

var iframe;
var domainString, sourceString, aSiteYouVisit;

var IVLocalIndex = false;
var popup = false;
var voteCode;
var allowUpdate;
var voteStatus, hashforsite;

var updateJSON;
var headers = new Headers();
var init = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};

var debug;
var distance;

const ivLogoArrow = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3e%3ccircle cx='20' cy='20' r='18' fill='none'/%3e%3cpath fill='%231A1A1A' d='M18.201 14.181h3.657v14.536a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817V14.181ZM18.201 10.547c0-1.003.819-1.817 1.829-1.817s1.828.814 1.828 1.817a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817Z'/%3e%3cpath fill='%231A1A1A' d='m10.318 21.634 1.292-1.285a1.836 1.836 0 0 1 2.586 0l8.402 8.351-2.585 2.57-9.696-9.636Z'/%3e%3cpath fill='%231A1A1A' d='M25.804 20.349a1.836 1.836 0 0 1 2.586 0l1.293 1.285-9.696 9.636-2.585-2.57 8.402-8.351Z'/%3e%3cpath fill='%231A1A1A' fill-rule='evenodd' d='M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20ZM20 37.46c9.643 0 17.46-7.817 17.46-17.46S29.643 2.54 20 2.54 2.54 10.357 2.54 20 10.357 37.46 20 37.46Z' clip-rule='evenodd'/%3e%3c/svg%3e"

browser.storage.local.get(function (localdata) {
    blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
});

const tagLookup = {
    "l": "Glassdoor",
    "b": "BCorp",
    "p": "TOS;DR",
    "m": "MBFC",
    "t": "TrustPilot",
    "s": "TrustScam",
    "g": "GoodOnYou",
    "w": "WorldBenchMark",
    "e": "LobbyEU",
}
const idLookup = {
    "Glassdoor": "glassdoor",
    "BCorp": "bcorp",
    "TOS;DR": "tosdr",
    "MBFC": "mbfc",
    "TrustPilot": "trust-pilot",
    "TrustScam": "trust-scam",
    "WorldBenchMark": "wbm",
    "LobbyEU": "lobbyeu",
}

const keyconversion = {
    'bcorp_rating': "b",
    'connections': "c",
    'glassdoor_rating': "l",
    'goodonyou': "g",
    'isin': "i",
    'mbfc': "m",
    'osid': "o",
    'polalignment': "a",
    'polideology': "q",
    'ticker': "y",
    'tosdr': "p",
    'trust-pilot': "t",
    'trustcore:': "s",
    'wikidata_id': "z",
    'wbm': "w",
    'lobbyeu': "e",
}

// Default user preferences with type, min, max, and labels for each tag
const defaultUserPreferences = {
    "l": { type: "range", min: 0, max: 10 },
    "w": { type: "multiRange", min: 0, max: 100 },
    "g": { type: "range", min: 0, max: 5 },
    "b": { type: "range", min: 0, max: 300 },
    "p": { type: "range", min: 1, max: 6 },
    "s": { type: "range", min: 0, max: 100 },
    "t": { type: "range", min: 0, max: 100 },
    "m": {
        type: "label", labels: ["conspiracy-pseudoscience", "left",
            "left-center", "pro-science", "right", "right-center", "satire",
            "censorship", "conspiracy", "failed-fact-checks", "fake-news", "false-claims",
            "hate", "imposter", "misinformation", "plagiarism", "poor-sourcing", "propaganda", "pseudoscience"
        ]
    },
};


var translate = {
    "cta": "cta.title",
    "wikipedia-first-frame": "w.wikipedia",
    "networkgraph": "graph.title",
    "small-wikidata": "w.companyinfo",
    "mbfc": "mbfc.title",
    "trust-pilot": "trustpilot.title",
    "yahoo": "esg.title",
    "opensec": "os.title",
    "carbon": "carbon.title",
    "lobbyeu": "lb.title",
    "post": "user.moduletitle",
    "wbm-automotive-data": "wbm.automotive-data",
    "wbm-gender-benchmark": "wbm.gender-benchmark",
    "wbm-just-transition-assessment": "wbm.just-transition-assessment",
    "wbm-just-transition-assessment-social": "wbm.just-transition-assessment-social",
    "wbm-seeds-index-esa": "wbm.seeds-index-esa",
    "wbm-seeds-index-ssea": "wbm.seeds-index-ssea",
    "wbm-seeds-index-wc-africa": "wbm.seeds-index-wc-africa",
    "wbm-chumanrightsb": "wbm.chumanrightsb",
    "wbm-financial-system-benchmark": "wbm.financial-system-benchmark",
    "wbm-social-transformation": "wbm.social-transformation",
    "wbm-transport-benchmark": "wbm.transport-benchmark",
    "wbm-buildings-benchmark": "wbm.buildings-benchmark",
    "wbm-digital-inclusion": "wbm.digital-inclusion",
    "wbm-electric-utilities": "wbm.electric-utilities",
    "wbm-food-agriculture-benchmark": "wbm.food-agriculture-benchmark",
    "wbm-nature-benchmark": "wbm.nature-benchmark",
    "wbm-oil-gas-benchmark": "wbm.oil-gas-benchmark",
    "wbm-seafood-stewardship": "wbm.seafood-stewardship",
    "political-wikidata": "w.political",
    "politicali-wikidata": "wikidata.polideology",
    "goodonyou": "goy.section-title",
    "bcorp": "bcorp.title",
    "tosdr-link": "tos.title",
    "glassdoor": "glassdoor.title",
    "similar-site-wrapper": "similar.title",
    "social-wikidata": "w.socialmedia",
    "trust-scam": "trustsc.title",
    "wbm": "wbm.title",
};

var defaultestOrder = Object.keys(translate)
var defaultOrder = []
var defaultOrderWbm = []
for (item in defaultestOrder) {
    if (defaultestOrder[item].startsWith("wbm")) {
        defaultOrderWbm.push(defaultestOrder[item])
    } else {
        defaultOrder.push(defaultestOrder[item])
    }
}
defaultOrder.push("wbm")
var defaultOrderString = defaultOrder.join('|')
var defaultOrderStringWbm = defaultOrderWbm.join('|')

const availableNotifications = "beglmstwp";

var defaultSettingsState = {
    "preferred_language": "en",
    "loggedIn": false,
    "debugMode": false,
    "darkMode": false,
    "keepOnScreen": false,
    "userPreferences": defaultUserPreferences,
    "bobbleOverride": false,
    "notifications": false,
    "notificationsTags": availableNotifications,
    "listOrder": defaultOrderString,
    "listOrder-wbm": defaultOrderStringWbm,
    "dissmissedNotifications": [],
    "experimentalFeatures": false,
}

level2 = ['wikipedia-first-frame',
    'isin ssd',
    'isin fas',
    'mbfc-header',
    'yahoo',
    'similar-site-wrapper',
    'glassdoor',
    'social-wikidata',
    'small-wikidata',
    'trust-pilot',
    'wikipedia-infocard-frame',
    'disclaimer',
    'settings'
];

const tagsDuplicatable = 'g'

const actionLookup = {
    "IVLike": "InvisibleUpvote",
    "IVDislike": "InvisibleDownvote",
    "IVSiteDataUpdate": "InvisibleSiteDataUpdate",
    "IVGetPost": "InvisibleGetPost",
    "IVMakePost": "InvisibleMakePost",
    "IVPostStuff": "InvisibleModuleInfo",
}
const actionLookupCallBack = {
    "IVGetPost": forwardPost,
    "IVMakePost": getNewPost,
    "IVPostStuff": forwardPosts,
}
const updown = {
    "IVLike": "up",
    "IVDislike": "down",
}

var now = Date.now();

function fetchIndex() {
    console.log("index")
    browser.storage.local.get(function (localdata) {
        blockedHashes = localdata.blockedHashes ? localdata.blockedHashes : [];
        if ((localdata.time + 480000) < now) allowUpdate = true;
        if (debug && !IVLocalIndex) console.log("[ Invisible Voice ]: Set to " + aSiteWePullAndPushTo);
        if (debug && IVLocalIndex) console.log("[ Invisible Voice ]: Set to LocalIndex");
        updateJSON = (IVLocalIndex) ? new Request(localIndex, init) : new Request(aSiteWePullAndPushTo + "/index.json", init);
        // Prevent page load
        blockCheck();
        if (allowUpdate) fetch(updateJSON)
            .then(response => response.json())
            .then(data => browser.storage.local.set({ "data": data }))
            .then(browser.storage.local.set({ "time": now }));
    });
}
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function getNewPost(e) {
    if (debug) console.log("sending new post")
    const sending = browser.runtime.sendMessage({ "InvisibleGetPost": e.post_uid })
    sending.then(forwardPost, handleError)
}

function shuffleArray(array) {
    console.log("shuffle")
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function isInRange(value, preference) {
    const { min, max } = preference;
    // Convert both numeric and letter ratings to numeric values
    const numericValue = convertRatingToNumeric(value);
    const numericMin = convertRatingToNumeric(min);
    const numericMax = convertRatingToNumeric(max);
    return numericValue >= numericMin && numericValue <= numericMax;
}

function convertRatingToNumeric(rating) {
    // Check if the rating is numeric (1-6)
    if (!isNaN(rating)) return Number(rating);
    // If it's not numeric, attempt to convert it to a numeric value based on the letter ratings (A-F)
    const ratings = ["A", "B", "C", "D", "E", "F"];
    const index = ratings.indexOf(rating);
    if (index !== -1) return index + 1;
    // If the rating is neither numeric nor a valid letter rating, return NaN
    return NaN;
}

function handleError(e) {
    console.error(`Error ${e}`)
}

function sendMessageToPage(message) {

    if (typeof (iframe) !== 'undefined') {
        iframe.contentWindow.postMessage(message, '*');
    } else {
        window.postMessage(message, '*');
    }
    console.log(`sent ${message.message}`)
}

function forwardPost(x) {
    if (typeof (x) == 'undefined') return;
    if (debug == true) console.log(x);
    utotal = (x["up_total"] == undefined) ? x["utotal"] : x["up_total"];
    dtotal = (x["down_total"] == undefined) ? x["dtotal"] : x["down_total"];
    ptotal = (x["comment_total"] == undefined) ? 0 : x["comment_total"];
    messageType = (x["topLevel"] == true) ? "PostUpdateTL" : "PostUpdate";
    comment = (messageType == "PostUpdate" && x["comment"]) ? true : false;
    var message = {
        message: messageType,
        location: x["location"],
        up_total: utotal,
        down_total: dtotal,
        comment_total: ptotal,
        author: x["author"],
        content: x["content"],
        top_comment: x["top_comment"],
        status: x["status"],
        comment: comment,
        uid: x["uid"]
    };
    sendMessageToPage(message);
}
function forwardPosts(x) {
    if (debug == true) console.log(x);
    voteStatus = x["status"];
    utotal = (x["up_total"] == undefined) ? x["utotal"] : x["up_total"];
    dtotal = (x["down_total"] == undefined) ? x["dtotal"] : x["down_total"];
    ptotal = (x["comment_total"] == undefined) ? 0 : x["comment_total"];
    var message = {
        message: "ModuleUpdate",
        location: x["location"],
        voteStatus: x["status"],
        up_total: utotal,
        down_total: dtotal,
        comment_total: ptotal,
        top_comment: x["top_comment"],
    };
    sendMessageToPage(message)
}

function forwardVote(x) {
    if (typeof(x) === 'undefined') return
    if (debug == true) console.log(x);
    voteStatus = x["status"];
    var message = {
        message: "VoteUpdate",
        voteStatus: x["status"],
        utotal: x["up_total"],
        dtotal: x["down_total"]
    };
    sendMessageToPage(message);
}


async function processSettingsObject(skip=false) {
    console.log("processSettings")
    settingsState = defaultSettingsState;
    try {
        tempSettingsState = await browser.storage.local.get("settings_obj").then(function (obj) {
            return JSON.parse(obj["settings_obj"])
        });
        for (item in tempSettingsState) {
            settingsState[item] = tempSettingsState[item];
        }

    } catch (e) {
        console.log(e)
        browser.storage.local.set({ "settings_obj": JSON.stringify(settingsState) });
    }
    debug = settingsState["debugMode"]
    if (!skip) console.log(settingsState);
    if (settingsState["notifications"])
        if (!popup) enableNotifications()

    return settingsState
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
    console.log("getSuff")
    let domainParts = parts.reverse();
    console.log(domainParts)
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

function lookupDomainHash(lookup, domainInfo) {
    console.log("lookupDomHash")
    console.log(domainInfo)
    if (domainInfo == null) return null
    let domainString = domainInfo.domain
    let hashforsite = lookup[domainString];
    if (hashforsite === undefined && domainInfo.subdomains.length) {
        domainString = domainInfo.domain.split('.').slice(-2).join('.');
        hashforsite = lookup[domainString];
    }
    // console.log(hashforsite)
    return JSON.stringify({
        "sourceString": domainString.replace(/\./g, ""),
        "domainString": domainString,
        "subdomains": domainInfo.subdomains,
        "hashforsite": hashforsite
    });
}

function processDomain(pattern) {
    console.log("ProcessDom")
    globalCode = pattern;
    sourceString = pattern;
    createObjects();
    return lookup[pattern];
}

function domainChecker(domains, lookupList) {
    console.log("DomCheck")
    console.log(domains)
    console.log(lookupList)
    try {
        if (lookupList[sourceString]) return processDomain(sourceString)

    } catch (e) {
        fetchIndex()
        if (lookupList[sourceString]) return processDomain(sourceString)
    }
    try {
        for (const domain of domains) {
            const pattern = domain.split('.').join('');
            const check = lookupList[pattern];
            if (check) {
                return check;
            }
        }
    } catch (e) { }
    return undefined
}
function fetchCodeForPattern(lookup, domainInfo) {
    console.log("fetch code for ")
    headers = new Headers();
    init = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };
    bgjson = lookupDomainHash(lookup, domainInfo);
    if (bgjson == null) return null
    bgresponse = JSON.parse(bgjson);
    sourceString = bgresponse['sourceString'];
    domainString = bgresponse['domainString'];
    hashforsite = bgresponse['hashforsite'] ? bgresponse['hashforsite'] : false;
    var pattern = "/" + sourceString + "/";
    if (debug == true) console.log("[ IV ] " + domainString + " : " + hashforsite + " : " + pattern + " : " + sourceString);
    browser.storage.local.get("data", function (data) {
        try {
            fetch(new Request(localHash, init))
                .then(response => response.json())
                .then(subdata => console.log(subdata[hashforsite]))
                .then(possibileDomains => domainChecker(possibileDomains, data.data))
            console.log(data)
        } catch {
            console.log("catch 1")
            try {
                fetch(new Request(localReplace, init))
                    .then(response => response.json())
                    .then(data, function (data) {
                        if (data[pattern]) {
                            return data[pattern]["t"].replace(/\//g, '');
                        }
                    });
            } catch {
            console.log("catch 2")
                return;
            }
        }
    });
    return;
}


// Domain handling
// PSL 2023/06/23 updated
async function parsePSL(pslStream, lookup, aSiteYouVisit) {
    console.log("parsePSL")
  console.log(lookup)
    browser.storage.local.get(function (data) {
        pretty_name = data.pretty_name;
        username = data.username;
        loggedIn = (username != undefined) ? true : false;
        if (loggedIn) console.log(`user ${username}/${pretty_name} is logged in`)
        settingsState["loggedIn"] = loggedIn
    })
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
        console.log(domainString)
    domainString = aSiteYouVisit.replace(/\.m\./g, '.')
        .replace(/http[s]*:\/\/|www\./g, '').split(/[/?#]/)[0].replace(/^m\./g, '');
        console.log(domainString)
    domainInfo = parseDomain(domainString, publicSuffixes);
    fetchCodeForPattern(lookup, domainInfo);
    console.log("did we make it?")
    console.log(domainInfo)
    return domainInfo;
}

browser.storage.local.get("userPreferences", function (localdata) {
    const loadedPreferences = localdata.userPreferences || {};
    const mergedPreferences = { ...defaultUserPreferences, ...loadedPreferences };
    browser.storage.local.set({ "userPreferences": mergedPreferences });
});
