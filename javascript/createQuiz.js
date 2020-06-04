function createQuiz(){

  // 問題データの読み込み
  // データの形式
  // ["問題", "解答", "選択肢１,"選択肢2","選択肢3"]
  //  let quizzes = [
  //    ["dog", "イヌ", "イヌ","ネコ","サル"],
  //    ["cat", "ネコ", "イヌ","ネコ","サル"],
  //    ["monckey", "サル", "イヌ","ネコ","サル"]
  //  ];
  //
  // スプレッドシートと関連付ける
  let spreadsheet = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("SPREAD_SHEET_ID")
  );  
  let sheet = spreadsheet.getSheetByName("data");
  let quizzes = sheet.getDataRange().getValues();
  quizzes.shift();
  console.log(quizzes);
  
  // Form の作成
  let form = FormApp.create('クイズ');
  form.setIsQuiz(true); // クイズ機能をONにする

  // クイズデータを１つずつ Form に追加する
  for(let quiz of quizzes){
    let item = form.addCheckboxItem();
    item.setTitle(quiz[0]);
    item.setPoints(100);
    item.setChoices([
            item.createChoice(quiz[2], quiz[2] == quiz[1]),
            item.createChoice(quiz[3], quiz[3] == quiz[1]),
            item.createChoice(quiz[4], quiz[4] == quiz[1])
    ]);
  }
}
