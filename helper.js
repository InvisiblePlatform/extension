var aSiteWePullAndPushTo = "https://test.reveb.la";

// Set browser to chrome if chromium based
const chrRegex = /Chr/i;
const frRegex = /Firefox/i;
const phoneRegex = /iPhone/i;

browser = chrome || browser;

if (chrRegex.test(navigator.userAgent)) identifier = "fafojfdhjlapbpafdcoggecpagohpono"
if (frRegex.test(navigator.userAgent)) identifier = "c81358df75e512918fcefb49e12266fadd4be00f@temporary-addon"
if (phoneRegex.test(navigator.userAgent)) phoneMode = true;

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

browser.storage.local.get(function(localdata) {
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

const defaultSettingsState = {
    "preferred_language": "en",
    "loggedIn": false,
    "debugMode": false,
    "darkMode": false,
    "keepOnScreen": false,
    "userPreferences": defaultUserPreferences,
    "bobbleOverride": false,
    "notifications": false,
    "notificationsTags": '',
    "listOrder": "",
    "listOrder-wbm": "",
    "experimentalFeatures": false,
    "dissmissedNotifications": [],
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