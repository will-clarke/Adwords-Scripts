// Campaign Level Parameters
// This script = CAMPAIGN level => Param2
// -> Uploads keyword-level parameters based on parameters defined in a Google doc

SHEET_NUMBER = 5
function main() {
 var SPREADSHEET_URL = "google_id";
  //  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var spreadsheets = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var ss = spreadsheets.setActiveSheet(spreadsheets.getSheets()[SHEET_NUMBER-1]);
  Logger.log(ss.getName())
  var row = 2;
  while (ss.getRange("A" + row).getValue() != "") {
    if (ss.getRange("B" + row).getValue() != ""){
      var designerCamp = ss.getRange("A" + row).getValue();
      var newParam = ss.getRange("B" + row).getValue();
    //Set Param
      var keywordsIterator = AdWordsApp.keywords()
      .withCondition("CampaignName CONTAINS '"+designerCamp+"' ")
      .withCondition('CampaignStatus = ENABLED')
      .withCondition('AdGroupStatus = ENABLED')
      .withCondition('Status = ENABLED')
      .get();
      while (keywordsIterator.hasNext()){
         var key = keywordsIterator.next();
        Logger.log(key.getText());
        Logger.log(newParam);
        if (!isNaN(newParam) && newParam != 0) {
           key.setAdParam(2, parseInt(newParam));
         }
      }
    }
      row ++;
  }
}
