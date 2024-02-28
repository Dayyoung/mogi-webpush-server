const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const request = require("request");
const $ = require("jquery");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET home page. */
router.get("/setPush", function (req, res, next) {
  console.log("##### /sendMessage");
  const webpush = require("web-push");
  // VAPID keys should be generated only once.
  const vapidKeys = webpush.generateVAPIDKeys();
  console.log(vapidKeys);
  res.json(vapidKeys);
});
/* ALL home page. */
router.get("/sendPush", (req, res) => {
  console.log("##### /sendPush");

  if (!req.query) {
    console.log("param error");
    res.json({ result: "param error" });
    return;
  }
  sendPush(req.query);
  res.json({ result: 1 });
});

router.get("/sendPushForAll", async (req, res) => {
  console.log("##### /sendPushForAll");
  var sendList = [];

  try {
    var subscribeListUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj_f-GwMhhdyXqW_JqQ_3lLJMHc6UBJeH34xltArwBk-7grgjbr9KQJYjhYz6R1qEUGBqR4OoWEtwL/pub?output=tsv";
    var unsubscribeListUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVwNTgypms0Fezshuc1OLFRO_ggo3d0ApMw9msAz0L9TZzxY3iX5_L3hI6aInnN2a9beRG7dQxjLwg/pub?output=tsv";
    let subscribeList = await getJsonListFromTSV(subscribeListUrl);
    let unsubscribeList = await getJsonListFromTSV(unsubscribeListUrl);

    console.log(subscribeList.length); // `response` will be whatever you passed to `resolve()` at the top
    //console.log(unsubscribeList); // `response` will be whatever you passed to `resolve()` at the top

    for (var i in subscribeList) {
      var isContain = false;
      for (var j in unsubscribeList) {
        if (subscribeList[i].Subscription == unsubscribeList[j].Subscription) {
          isContain = true;
        }
      }
      if (!isContain) {
        sendList.push(subscribeList[i].Subscription);
      }
    }

    for (var i in sendList) {
      var sendItem = sendList[i];
      var subscription = JSON.parse(sendItem);
      sendPush(subscription);
    }

    res.json({ result: 1 });
  } catch (error) {
    res.json({ result: error });
    console.error(error); // `error` will be whatever you passed to `reject()` at the top
  }
});

function sendPush(subscription) {
  if (!subscription) {
    console.log("No subscription found!");
    return;
  }

  const webpush = require("web-push");

  var keys = {
    publicKey:
      "BH46BdRrMgRmRwgTDArIX8yOC9GxTJMUnTn557z0yN40Qk1VSMrr0SCBXa5N6qABxy7y6eocrtBbdpp3SWsTUgw",
    privateKey: "fm6qwKsFUmu5-3XWwownHd1I6d8XHPMCSsnp39SFu7c",
  };

  // // webpush.setGCMAPIKey('<Your GCM API Key Here>');
  webpush.setVapidDetails(
    "mailto:skillofeveryone@gmail.com",
    keys.publicKey,
    keys.privateKey,
  );

  const pushSubscription = subscription;
  webpush.sendNotification(
    pushSubscription,
    JSON.stringify({
      title: "Check the quality of your life every day.",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSeMwjjNC52E8usOQrbCwO8qCuuSiO8iIhq2m3a7-KRoY1mMcw/viewform",
    }),
  );
}

function getJsonListFromTSV(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(tsvToJSON(body));
      } else {
        reject(error);
      }
    });
  });
}

function tsvToJSON(tsv_string) {
  const rows = tsv_string.split("\r\n");
  const jsonArray = [];
  const header = rows[0].split("\t");
  for (let i = 1; i < rows.length; i++) {
    let obj = {};
    let row = rows[i].split("\t");
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = row[j];
    }
    jsonArray.push(obj);
  }
  return jsonArray;
}

module.exports = router;
