const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const request = require("request");
const $ = require("jquery");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "skillofeveryone@gmail.com",
    pass: "gvvz tbrj nvzd ussa",
  },
});

router.get("/sendEmail", (req, res) => {
  console.log("##### /sendEmail");

  if (!req.query.email) {
    console.log("param error");
    res.json({ result: "param error" });
    return;
  }

  sendEmail(req.query.email);
  res.json({ result: 1 });
});

router.get("/sendEmailForAll", async (req, res) => {
  console.log("##### /sendEmailForAll");
  var emailList = [];

  try {
    var subscribeListUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2QVOIkds9BqCZLQBrvB2pcs84bAuc57RLLrNl0QWRzorlTS5qNB7eEM_Aqs5Irxrqr6Y2lr9wt3_a/pub?output=csv";
    var unsubscribeListUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSZGbrhoyvFRxwPPvXbVo9TQeWeqt1aXbp8dDLPErP7LnGPW4kqM_ZqrVx0M3qnmX1owXTEshqOPz6d/pub?output=csv";
    let subscribeList = await getJsonList(subscribeListUrl);
    let unsubscribeList = await getJsonList(unsubscribeListUrl);

    //console.log(subscribeList); // `response` will be whatever you passed to `resolve()` at the top
    //console.log(unsubscribeList); // `response` will be whatever you passed to `resolve()` at the top

    for (var i in subscribeList) {
      var isContain = false;
      for (var j in unsubscribeList) {
        if (subscribeList[i].Email == unsubscribeList[j].Email) {
          isContain = true;
        }
      }
      if (!isContain) {
        emailList.push(subscribeList[i].Email);
      }
    }
    console.log(emailList);

    for (var i in emailList) {
      sendEmail(emailList[i]);
    }
    res.json({ result: 1 });
  } catch (error) {
    res.json({ result: err });
    console.error(error); // `error` will be whatever you passed to `reject()` at the top
  }
});

function sendEmail(email) {
  var emailHTMLTemplate =
    '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title></title><!--[if mso]> <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]--><style>table,td,div,h1,p{font-family:Arial,sans-serif;}</style></head><body style="margin:0;padding:0;"><table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;"><tr><td align="center" style="padding:0;"><table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;"><tr><td style="padding:36px 30px 42px 30px;"><table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;"><tr><td style="padding:0 0 36px 0;color:#153643;"><h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;"> Quality of your life. (QYL™)</h1><p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Check the quality of your life every day.</p> <br><center><p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSeMwjjNC52E8usOQrbCwO8qCuuSiO8iIhq2m3a7-KRoY1mMcw/viewform?entry.1882051254={EMAIL}" style="color:#ee4c50;text-decoration:underline;">Go Survey!</a></p></center></td></tr><tr><td style="padding:0;"><table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;"></table></td></tr></table></td></tr><tr><td style="padding:30px;background:#ee4c50;"><table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;"><tr><td style="padding:0;width:50%;" align="left"><p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;"> &reg; Skill Of Everyone. 2024<br/><a href="https://docs.google.com/forms/d/e/1FAIpQLSfp6ReCiUVyXjCb3v-PWSd03mDbjh5dO3vCY7mO2u-fswvswQ/viewform?entry.1882051254={EMAIL}" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a></p></td><td style="padding:0;width:50%;" align="right"><table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;"><tr><td style="padding:0 0 0 10px;width:38px;"> <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;"/></a></td><td style="padding:0 0 0 10px;width:38px;"> <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;"/></a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>';

  emailHTMLTemplate = emailHTMLTemplate.replaceAll("{EMAIL}", email);

  const mailOptions = {
    from: "Skill Of Everyone <skillofeveryone@gmail.com>",
    to: email,
    subject: "Check the quality of your life every day.",
    text: "https://docs.google.com/forms/d/e/1FAIpQLSeMwjjNC52E8usOQrbCwO8qCuuSiO8iIhq2m3a7-KRoY1mMcw/viewform",
    html: emailHTMLTemplate,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("mail error", err);
    } else {
      console.log("mail success", info.response);
    }
  });
}

function getJsonList(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(csvToJSON(body));
      } else {
        reject(error);
      }
    });
  });
}

function csvToJSON(csv_string) {
  const rows = csv_string.split("\r\n");
  const jsonArray = [];
  const header = rows[0].split(",");
  for (let i = 1; i < rows.length; i++) {
    let obj = {};
    let row = rows[i].split(",");
    for (let j = 0; j < header.length; j++) {
      obj[header[j]] = row[j];
    }
    jsonArray.push(obj);
  }
  return jsonArray;
}

module.exports = router;
