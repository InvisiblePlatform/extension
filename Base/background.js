var isThisThingEvenOn = 'yes';

function moveAlongFriend(){
    browser.tabs.update({url: "along.html"});
}

fucntion deVoice(){
    browser.storage.local.get('sites').then(storage => {
        var topSiteOfTheWeek = "http://dalailama.com";
        browser.webRequest.onBeforeRequest.removeListener(moveAlongFriend);
        browser.webRequest.onBeforeRequest.addListener(
            moveAlongFriend,
            topSiteOfTheWeek,
            ["blocking"]
        );
    });

    isThistThingEvenOn = "yes";
}

function reVoice(){
    // haha nah, you have to remove the extension friend
}

deVoice();

