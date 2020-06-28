function sendQuizToSlack() {

  // スクリプトに状態を保存する
  var properties = PropertiesService.getScriptProperties();

  // 初期問題番号を1に設定する
  if (!properties.getProperty("termIndex")) {
    properties.setProperty("termIndex", 0);
    console.log("Init termIndex !");
  }
  if (!properties.getProperty("quizNumber")) {
    properties.setProperty("quizNumber", minQuizNumber);
    console.log("Init quizNumber !");
  }

  let currentTermIndex = parseInt(properties.getProperty("termIndex"));
  let currentQuizNumber = parseInt(properties.getProperty("quizNumber"));

  console.log("currentTermIndex: " + currentTermIndex);
  console.log("currentQuizNumber: " + currentQuizNumber);

  // 問題への URL
  let quizURL = `https://www.ap-siken.com/kakomon/${term[currentTermIndex]}/q${String(currentQuizNumber)}.html`;

  console.log("quizURL: " + quizURL);

  // Slack に送る問題
  let quiz2Slack = `今日の一問です！\n ${quizURL} \n ${getQuizData(quizURL)}`

  let Send = {
    "method": "POST",
    "payload": JSON.stringify({
      "text": quiz2Slack
    })
  }

  if (currentQuizNumber === maxQuizNumber) {
    // テスト時期を1つ進める
    currentTermIndex = (currentTermIndex + 1) % term.length;
  }
  // 問題番号を1つ進める
  currentQuizNumber = (currentQuizNumber + 1) % maxQuizNumber;
  
  // 状態を保存
  properties.setProperty("termIndex", currentTermIndex);
  properties.setProperty("quizNumber", currentQuizNumber);

  // for test
  // console.log(Send);
  // return;

  // WebHook を定義する
  let WebHook = 'https://hooks.slack.com/services/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';
  // WebHook を起動する
  UrlFetchApp.fetch(WebHook, Send);
}

function getQuizData(url) {
  var xpath = "//*[@class='main kako']";
  var xpath_mondai = "//*[@class='main kako']/div[3]";
  var xpath_sentaku = "//*[@class='main kako']/div[4]/ul/li";
  var mondai = pickFromDom(url, xpath_mondai);
  var sentaku = pickFromDom(url, xpath_sentaku);

  var result = mondai + "\n\n" + parseList(sentaku);

  // let response = UrlFetchApp.fetch(url);
  // サイトの文字コードに合わせて　Shift＿JIS でテキストを取得する
  // let text = response.getContentText("Shift_JIS");
  // let quizData = text.match(/<div class="main kako">[\s\S]*?<\/li>/g).toString();
  // let quizData = find(text, );
  // console.log(quizData);
  // let result = quizData.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
  console.log(result);
  return result;
}

function parseList(list) {
  let result = [];
  for (let i = 0; i < list.length; i++) {
    let elem = list[i];
    result.push(elem[1] + ": " + elem[0]);
  }
  return result.join("\n");
}

const minQuizNumber = 1;
const maxQuizNumber = 80;
const term = [
  "31_haru",
  "01_aki",
  "30_haru",
  "30_aki",
  "29_haru",
  "29_aki",
  "28_haru",
  "28_aki",
  "27_haru",
  "27_aki",
  "26_haru",
  "26_aki",
  "25_haru",
  "25_aki",
  "24_haru",
  "24_aki",
  "23_toku",
  "23_aki",
  "22_haru",
  "22_aki",
  "21_haru",
  "21_aki"
];

/** 
* 特定の文字列の間に挟まれた文字列を抽出する
* 特定の文字列を含む結果を返す
* @param { string } text 検索対象となる文字列
* @param { string } from 前方の文字列
* @param { string } to   後方の文字列
* @return { string } 検索結果
*/
function find(text, from, to) {
  var fromIndex = text.indexOf(from);
  if (fromIndex === -1) {
    return '';
  }
  text = text.substring(fromIndex);
  var toIndex = text.indexOf(to);
  if (toIndex === -1) {
    return '';
  }
  return text.substring(0, toIndex + to.length);
}

function pickFromDom(url, xpath) {
  var properties = PropertiesService.getScriptProperties();

  // 処理用のSpreadSheetを作成する。次回から再利用
  if (!properties.getProperty("spreadSheetId")) {
    properties.setProperty("spreadSheetId", SpreadsheetApp.create("sendQuizToSlack").getId());
    console.log("Init spreadSheetId !");
  }

  let spreadSheetId = properties.getProperty("spreadSheetId");

  console.log("spreadSheetId: " + spreadSheetId);

  // var mondai = 4;
  // var sentakusi = 5;
  // var kotae = 10;
  // var kaisetu = 12;

  var ss = SpreadsheetApp.openById(spreadSheetId);

  var sheets = ss.getSheets();
  var sheet = sheets[0];
  var range = sheet.getRange(1, 1);

  range.setValue(importxml(url, xpath));

  SpreadsheetApp.flush();

  range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());

  var values = range.getValues();

  // Logger.log(values[0][mondai]);
  // Logger.log(values[0][sentakusi]);
  // Logger.log(values[0][kotae]);
  // Logger.log(values[0][kaisetu]);
  Logger.log(values);

  // return [values[0][mondai], values[0][sentakusi], values[0][kotae], values[0][kaisetu]];
  return values;
}

function importxml(url, xpath) {
  return '=IMPORTXML("' + url + '","' + xpath + '")';
}
