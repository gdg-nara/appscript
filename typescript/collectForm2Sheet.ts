// 毎週金曜日8~9時の間で自動実行される
// 対象日付 1週間前 ~ 前日(木)までの期間
import Form = GoogleAppsScript.Forms.Form;
import Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet;
import Moment = 'moment';

function createForm() {
  let form: Form;
  let spreadSheet: Spreadsheet;
  const dateFrom = Moment.moment().add(-7, "days");
  const dateTo = Moment.moment().add(-1, "days");
  let formattedDate: string;
  formattedDate = `${dateFrom.format("MM/dd")}~${dateTo.format("MM/dd")}`;

  // フォームの作成
  form = FormApp.create("【" + formattedDate + "】今週のベスト教育コース賞")
    .setTitle("【" + formattedDate + "】今週のベスト教育コース賞 ")
    .setDescription(
      "今週ベストだと思った教育コースを一つ投票してください。"
    )
    .addEditors([
      "hoge@gmail.com",
      "hogehoge@gmail.com"
    ])
    .setCollectEmail(true);

  form
    .addTextItem()
    .setTitle("今週ベストだと思った教育コース")
    .setRequired(true);
  form.addTextItem().setTitle("理由");

  // 既存のspreadシートを取得する
  spreadSheet = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID")
  );

  // 作成したシートを回答先に紐付ける
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadSheet.getId());

  // slackに通知する
  let conditions = {
    text:
      `今週のベスト教育コース賞の投票をお願い致します🔥\n ${form.getPublishedUrl()}`,
    title: "今週のベスト教育コース賞"
  };

  console.log(conditions);

}

