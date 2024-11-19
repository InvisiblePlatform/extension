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
// Various Lookups
let buttonSvg = browser.runtime.getURL('button.svg');

var dontOpen = false;
var blockedHashes;
var siteToBlockedHashes = {};
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
cconst translate = {
    "post": "user.moduletitle",
    "wikipedia-first-frame": "w.wikipedia",
    "wikipedia-infocard-frame": "w.companyinfo",
    "graph-box": "graph.title",
    "mbfc": "mbfc.title",
    "political": "wikidata.polalignment",
    "politicali": "wikidata.polideology",
    "lobbyeu": "lb.title",
    "opensecrets": "opensec.title",
    "goodonyou": "goy.section-title",
    "yahoo": "esg.title",
    "wbm-chumanrightsb": "wbm.chumanrightsb",
    "wbm-gender-benchmark": "wbm.gender-benchmark",
    "wbm-financial-system-benchmark": "wbm.financial-system-benchmark",
    "wbm-food-agriculture-benchmark": "wbm.food-agriculture-benchmark",
    "wbm-nature-benchmark": "wbm.nature-benchmark",
    "wbm-social-transformation": "wbm.social-transformation",
    "wbm-just-transition-assessment": "wbm.just-transition-assessment",
    "wbm-just-transition-assessment-social": "wbm.just-transition-assessment-social",
    "wbm-oil-gas-benchmark": "wbm.oil-gas-benchmark",
    "wbm-digital-inclusion": "wbm.digital-inclusion",
    "wbm-transport-benchmark": "wbm.transport-benchmark",
    "wbm-electric-utilities": "wbm.electric-utilities",
    "wbm-buildings-benchmark": "wbm.buildings-benchmark",
    "wbm-automotive-data": "wbm.automotive-data",
    "wbm-seafood-stewardship": "wbm.seafood-stewardship",
    "wbm-seeds-index-esa": "wbm.seeds-index-esa",
    "wbm-seeds-index-ssea": "wbm.seeds-index-ssea",
    "wbm-seeds-index-wc-africa": "wbm.seeds-index-wc-africa",
    "bcorp": "bcorp.title",
    "glassdoor": "glassdoor.title",
    "trustpilot": "trustpilot.title",
    "tosdr": "tos.title",
    "trustscore": "trustsc.title",
    "similar": "similar.title",
    "social": "w.socialmedia",
    "carbon": "carbon.title",
    "cta": "cta.title",
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
    "IVRequest": "InvisibleRequestList",
}
const actionLookupCallBack = {
    "IVGetPost": forwardPost,
    "IVMakePost": getNewPost,
    "IVPostStuff": forwardPosts,
    "IVRequest": forwardInfo,
}
const updown = {
    "IVLike": "up",
    "IVDislike": "down",
}

const languagesWeSupport = ["AR", "FR", "EO", "CA", "DE", "ZH", "HI", "EN", "ES"]
const dirtyTranslateTable = {
    "dismiss": {
        "en": "Dismiss",
        "es": "Descartar",
        "fr": "Rejeter",
        "de": "Ablehnen",
        "ar": "رفض",
        "zh": "解雇",
        "hi": "खारिज करें",
        "eo": "Forĵeti",
        "ca": "Descartar"
    },
    "dismiss-on-site": {
        "en": "Dismiss on this site",
        "es": "Descartar en este sitio",
        "fr": "Rejeter sur ce site",
        "de": "Ablehnen auf dieser Seite",
        "ar": "رفض على هذا الموقع",
        "zh": "在此站点上解雇",
        "hi": "इस साइट पर खारिज करें",
        "eo": "Forĵeti sur tiu ĉi retejo",
        "ca": "Descartar en aquest lloc"
    },
    "invisible-voice-available": {
        "en": "Invisible Voice is available on this site",
        "es": "Invisible Voice está disponible en este sitio",
        "fr": "Invisible Voice est disponible sur ce site",
        "de": "Invisible Voice ist auf dieser Seite verfügbar",
        "ar": "الصوت الخفي متاح على هذا الموقع",
        "zh": "此站点上提供隐形语音",
        "hi": "इस साइट पर गुप्त आवाज़ उपलब्ध है",
        "eo": "Invisible Voice estas havebla sur tiu ĉi retejo",
        "ca": "Invisible Voice està disponible en aquest lloc"
    },
}

const defaultSettingsState = {
    "preferred_language": "en",
    "loggedIn": false,
    "debugMode": false,
    "darkMode": false,
    "keepOnScreen": false,
    "dismissedNotifications": [],
    "blockedSites": [],
    "userPreferences": defaultUserPreferences,
    "bobbleOverride": false,
    "notifications": false,
    "notificationsTags": availableNotifications,
    "listOrder": defaultOrderString,
    "experimentalFeatures": false,
    "singleColumn": false,
    "monoChrome": false,
    "ignoreUpdateMessage": true,
    "settingsSync": false,
    "disabledModules": [],
    "autoRollTabs": false,
    "extension_version": "0.0.0",
};

const dirtyTranslate = (key, lang) => {
    // get preferred language
    lang = lang || settingsState.preferred_language
    if (dirtyTranslateTable[key] && dirtyTranslateTable[key][lang]) {
        return dirtyTranslateTable[key][lang]
    }
    return key
}

const closeCross = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
    <path fill="#000" fill-rule="evenodd" d="M12 10.586L5.707 4.293 4.293 5.707 10.586 12l-6.293 6.293 1.414 1.414L12 13.414l6.293 6.293 1.414-1.414L13.414 12l6.293-6.293-1.414-1.414L12 10.586z" clip-rule="evenodd"></path>
    </svg>`

const threeDots = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
    <circle cx="12" cy="12" r="1.5" fill="#000"></circle>
    <circle cx="12" cy="6" r="1.5" fill="#000"></circle>
    <circle cx="12" cy="18" r="1.5" fill="#000"></circle>
    </svg>`

const ivLogoArrowElement = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="40" fill="none" viewBox="10 0 20 40">
    <path fill="#1A1A1A" d="M18.201 14.181h3.657v14.536a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817V14.181ZM18.201 10.547c0-1.003.819-1.817 1.829-1.817s1.828.814 1.828 1.817a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817Z"></path>
    <path fill="#1A1A1A" d="m10.318 21.634 1.292-1.285a1.836 1.836 0 0 1 2.586 0l8.402 8.351-2.585 2.57-9.696-9.636Z"></path><path fill="#1A1A1A" d="M25.804 20.349a1.836 1.836 0 0 1 2.586 0l1.293 1.285-9.696 9.636-2.585-2.57 8.402-8.351Z"></path>
    </svg>`


const ivLogoArrow = "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='none'%3e%3ccircle cx='20' cy='20' r='18' fill='none'/%3e%3cpath fill='%231A1A1A' d='M18.201 14.181h3.657v14.536a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817V14.181ZM18.201 10.547c0-1.003.819-1.817 1.829-1.817s1.828.814 1.828 1.817a1.823 1.823 0 0 1-1.828 1.817 1.823 1.823 0 0 1-1.829-1.817Z'/%3e%3cpath fill='%231A1A1A' d='m10.318 21.634 1.292-1.285a1.836 1.836 0 0 1 2.586 0l8.402 8.351-2.585 2.57-9.696-9.636Z'/%3e%3cpath fill='%231A1A1A' d='M25.804 20.349a1.836 1.836 0 0 1 2.586 0l1.293 1.285-9.696 9.636-2.585-2.57 8.402-8.351Z'/%3e%3cpath fill='%231A1A1A' fill-rule='evenodd' d='M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20ZM20 37.46c9.643 0 17.46-7.817 17.46-17.46S29.643 2.54 20 2.54 2.54 10.357 2.54 20 10.357 37.46 20 37.46Z' clip-rule='evenodd'/%3e%3c/svg%3e"

var now = Date.now();

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
    const sending = browser.runtime.sendMessage({ "InvisibleUpdateModule": e })
    sending.then(forwardInfoSingle, handleError)
}

function tabIdSend() {
    browser.runtime.sendMessage({ "InvisibleTabId": "alive" })
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

function forwardInfo(x) {
    console.debug(x);
    var message = {
        message: "ModuleInfo",
        infoResponse: x
    };
    sendMessageToPage(message);
}

function forwardInfoSingle(x) {
    console.debug(x);
    var message = {
        message: "ModuleInfoSingle",
        infoResponse: x
    };
    sendMessageToPage(message);
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
    if (typeof (x) === 'undefined') return
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


async function processSettingsObject(skip = false, obj = undefined) {
    settingsState = obj || defaultSettingsState;
    if (obj != undefined) {
        currentVersion = browser.runtime.getManifest().version;
        settingsFromBackground = await getSettingsFromBackground()
        if (settingsFromBackground != undefined) {
            settingsState = settingsFromBackground
        }
    }
    try {
        tempSettingsState = await browser.storage.local.get("settings_obj").then(function (obj) {
            if (obj["settings_obj"] == undefined) {
                browser.storage.local.set({ "settings_obj": JSON.stringify(settingsState) });
                return settingsState
            }
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
        if (!popup) enableNotifications(settingsState["darkMode"], settingsState["monoChrome"]);

    currentVersion = browser.runtime.getManifest().version;
    settingsState["extension_version"] = currentVersion;
    saveSettingsToBackgound()
    return settingsState
}

async function saveSettingsToBackgound() {
    browser.runtime.sendMessage({ "IVSettingsSet": settingsState });
}
async function getSettingsFromBackground() {
    browser.runtime.sendMessage({ "IVSettingsReq": "get" }).then(function (response) {
        settingsState = response;
        console.log(settingsState)
    });
}

function domainCheckBg(domain) {
    const sending = browser.runtime.sendMessage({ "InvisibleDomainCheck": domain });
    sending.then(response => {
        backgroundJson = response;
        if (backgroundJson == undefined) {
            console.log("No data for this domain")
            return
        }
        console.log(backgroundJson)
        if ("sourceString" in backgroundJson) {
            processDomain(backgroundJson["sourceString"]);
        }
        if ("hashforsite" in backgroundJson) {
            hashforsite = backgroundJson["hashforsite"];
        }
        if ("domainString" in backgroundJson) {
            domainString = backgroundJson["domainString"];
        }
    }, handleError)
}


function processDomain(pattern) {
    console.log("ProcessDom")
    globalCode = pattern;
    sourceString = pattern;
    createObjects();
}

async function startUpStart() {
    browser.storage.local.get(async function (data) {
        pretty_name = data.pretty_name;
        username = data.username;
        loggedIn = (username != undefined) ? true : false;
        await getSettingsFromBackground()
        if (loggedIn) console.log(`user ${username}/${pretty_name} is logged in`)
        settingsState["loggedIn"] = loggedIn
    })
}

browser.storage.local.get("userPreferences", function (localdata) {
    const loadedPreferences = localdata.userPreferences || {};
    const mergedPreferences = { ...defaultUserPreferences, ...loadedPreferences };
    browser.storage.local.set({ "userPreferences": mergedPreferences });
    tabIdSend();
});
