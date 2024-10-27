iframe = document.getElementById("Invisible");
var identifier = "com.morkforid.Invisible-Voice.Extension (C5N688B362)"

debug = true;
phoneMode = true;
distance = 160;
popup = true;

var voting = false;

var currentTab;
var query = {
  active: true,
  currentWindow: true
};

var addingId = '#';
var isSet = false;

let resize = function (x) {
  return;
};

function callback(tabs) {
  if (sourceString === undefined) {
    currentTab = tabs[0]; // there will be only one in this array
    aSiteYouVisit = currentTab.url;
    startDataChain(aSiteYouVisit)
  }
  return true
}

function createObjects() {
  console.log(sourceString, hashforsite);
  ourdomain = `${aSiteWePullAndPushTo}/db/?site=${globalCode}&date=${Date.now()}&app=true`;
  if (settingsState["loggedIn"]) ourdomain += `&username=${pretty_name}&vote=true`;
  if (addingId != '#') ourdomain += addingId
  iframe.src = ourdomain;
  iframe.style.width = (chrRegex.test(navigator.userAgent)) ? '360px' : '100%';
  iframe.style.height = '100%';
}

browser.runtime.onMessageExternal.addListener(msgObj => {
  console.log(msgObj, sender, sendResponse);
  if (Object.keys(msgObj)[0] == "InvisibleHash") {
    objectkey = Object.keys(msgObj)[0];
    if (debug == true) console.log(msgObj[objectkey]);
  }
})

window.addEventListener('message', function (e) {
  if (e.data.type === undefined) return;

  if (debug) console.log(e.data.type + " Stub " + e.data.data);

  switch (e.data.type) {
    case 'IVSettingsReq':
      const message = {
        message: "SettingsUpdate",
        data: settingsState
      }
      sendMessageToPage(message)
      break;
    case 'IVLike':
      if (e.data.data != '') {
        if (debug) console.log(voteStatus);
        const likeMessage = voteStatus === "up" ? "InvisibleVoiceUnvote" : "InvisibleVoiceUpvote";
        browser.runtime.sendMessage({ [likeMessage]: hashforsite });
      }
      break;

    case 'IVDislike':
      if (e.data.data != '') {
        if (debug) console.log(e.data.type + " Stub");
        const dislikeMessage = voteStatus === "down" ? "InvisibleVoiceUnvote" : "InvisibleVoiceDownvote";
        browser.runtime.sendMessage({ [dislikeMessage]: hashforsite });
      }
      break;

    case 'IVBoycott':
      if (e.data.data != '') {
        blockedHashes.push(hashforsite);
        browser.storage.local.set({ "blockedHashes": blockedHashes });
        aSiteYouVisit = window.location.href;
        window.location.replace(browser.runtime.getURL('blocked.html') + "?site=" + domainString + "&return=" + aSiteYouVisit);
      }
      break;
    case 'IVGetPost':
      if (e.data.data != '') {
        if (debug) console.log(e.data.data)
        const sending = browser.runtime.sendMessage({ "InvisibleGetPost": e.data.data })
        sending.then(forwardPost, handleError)
      }
      break;
    case 'IVMakePost':
      if (e.data.data != '') {
        if (debug) console.log(e.data.data)
        const sending = browser.runtime.sendMessage({ "InvisibleMakePost": e.data.data })
        sending.then(handleError, handleError)
      }
      break;
    case 'IVPostStuff':
      if (e.data.data != '') {
        if (debug) console.log(e.data.data)
        const sending = browser.runtime.sendMessage({ "InvisibleModuleInfo": e.data.data })
        sending.then(forwardPosts, handleError)
      }
      break;
    case 'IVPostVoteUp':
    case 'IVPostVoteDown':
    case 'IVPostVoteUnvote':
      if (e.data.data != '') {
        if (debug) console.log(e.data.data)
        const sending = browser.runtime.sendMessage({ "InvisibleModuleVote": e.data.data, "type": e.data.type })
        sending.then(forwardPosts, handleError)
      }
      break;


    case 'IVVoteStuff':
      if (e.data.data != '') {
        console.log(`IVVOTESTUFF ${e.data.data}`)
        if (voteCode == undefined) {
          voteCode = e.data.data;
          console.log("VoteCodeSet")
          const sending = browser.runtime.sendMessage({ "InvisibleVoteTotal": voteCode })
          sending.then(forwardVote, handleError)
        } else {
          var command;
          if (e.data.data == "up") {
            command = "InvisibleVoteUpvote";
          } else if (e.data.data == "down") {
            command = "InvisibleVoteDownvote";
          } else if (e.data.data == "un") {
            command = "InvisibleVoteUnvote";
          }
          message = {}
          message[command] = voteCode
          const sending = browser.runtime.sendMessage(message)
          sending.then(forwardVote, handleError)

        }
      }
      break;

    case 'IVClicked':
      if (e.data.data != '' && e.data.data != 'titlebar') {
        if (debug) console.log("resize stub " + e.data.data, hashforsite);
        if (level2.includes(e.data.data)) {
          if (debug) console.log("level2 resize");
          resize();
        }
        if (e.data.data == 'antwork' || e.data.data == 'graph-box') {
          resize("network");
        } else {
          if (e.data.data == 'back') {
            resize();
          } else if (e.data.data == 'unwork') {
            resize("oldnetwork");
          } else {
            if (distance === 160) resize();
          }
        }
      }
      break;

    case 'IVDarkModeOverride':
      if (debug) console.log("DarkMode stub", e.data.data);
      break;

    case 'IVIndexRefresh':
      fetchIndex();
      break;

    case 'IVNotificationsCacheClear':
      if (debug) console.log("NotCacheClear stub", e.data.data);
      browser.storage.local.set({ "siteData": {} });
      browser.storage.local.set({ "userPreferences": defaultUserPreferences });
      if (settingsState["notifications"]) dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotificationsPreferences':
      if (debug) console.log("UserPreference stub", e.data.data);
      browser.storage.local.set({ "userPreferences": e.data.data });
      break;

    case 'IVNotificationsTags':
      if (debug) console.log("Tags stub", e.data.data);
      browser.storage.local.set({ "notificationTags": e.data.data });
      if (settingsState["notifications"]) dismissNotification();
      notificationsDismissed = false;
      enableNotifications();
      break;

    case 'IVNotifications':
      if (debug) console.log("Notifications stub", e.data.data);
      browser.storage.local.set({ "notifications": e.data.data });

      if (e.data.data == "true") {
        notificationsDismissed = false;
        if (debug) console.log("notifications were " + notifications);
        settingsState["notifications"] = true;
        if (document.getElementById("IVNotification") === null) {
          enableNotifications();
        }
      } else {
        if (settingsState["notifications"]) dismissNotification();
        settingsState["notifications"] = false;
      }
      break;

    case 'IVKeepOnScreen':
      if (debug) console.log("keep on screen stub", e.data.data);
      if (e.data.data == "true") {
        distance = 0;
        resize("load");
      }
      break;
    case 'IVSettingsChange':
      console.log("Settings Saved")
      browser.storage.local.set({ "settings_obj": JSON.stringify(e.data.data) });
      processSettingsObject();
      break;

    case 'IVClose':
      resize("close");
      break;
  }
});

iframe.addEventListener('load', function (e) {
  if (hashforsite === undefined) {
  } else if (voting == true) {
    (async () => {
      const response = await browser.runtime.sendMessage(identifier, { "InvisibleVoteTotal": hashforsite });
      var msgObj = data;
      voteStatus = msgObj["status"];
      var message = {
        message: "VoteUpdate",
        voteStatus: msgObj["status"],
        utotal: msgObj["up_total"],
        dtotal: msgObj["down_total"]
      };
      sendMessageToPage(message)
    })();
  }
});

function startDataChain() {
  startUpStart()
  processSettingsObject().then(
    domainCheckBg(aSiteYouVisit))
}

console.log(identifier);
browser.tabs.query(query).then(callback, handleError);
