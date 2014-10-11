// This script takes a list of campaign names & adgroups and paramater values
// It then updates all keywords within those campaigns / adgroups with the specified parameters.
//
var SHEET_NUMBER = 1
function update_ad_params (adgroup, price) {
  if (price){
    var kw_iterator = adgroup.keywords().get();    
    while (kw_iterator.hasNext()) {
      var keyword = kw_iterator.next();
      //      rounded price:
      keyword.setAdParam(1, price.toFixed(2));
      Logger.log(keyword.getText() + " -> " + price.toFixed(2) )
    }   
  }
}
function make_label(adgroup){
  var today = new Date();
  var todayDate = Utilities.formatDate(today, "GMT", "yyyy-MM-dd");
  adgroup.applyLabel("Sold Out");
  adgroup.labels().get().next().setDescription(todayDate);
}
function delete_label(adgroup) {
  adgroup.removeLabel("Sold Out");
}
function pause_enable_label(adgroup, soldout_on_gdoc)
{
  var is_paused = adgroup.isPaused();
  if (soldout_on_gdoc == "Sold out")
    var soldout = true;
  else
    var soldout = false;
  var label = adgroup.labels()
  .withCondition("Name = 'Sold Out'")
  .get();
  if(label.hasNext())
    var label_exists = true;
  else
    var label_exists = false;
  // main loop in the label function
  // IF SOLDOUT IN GOOGLE DOC:
  //  if (soldout && adgroup.isPaused())
  //  {
  //    if (label_exists)
  ////      Logger.log("No need to do anything.");
  //    else 
  ////      Logger.log("Probs already paused - so we don't want to do anything.");
  //    
  //  }
  //  else 
  if (soldout && adgroup.isEnabled())
  {
    if (label_exists)
    {
      delete_label(adgroup);
      make_label(adgroup);
      adgroup.pause();
      //      Logger.log("deleted label & made label & paused adgroup");
    }
    else
      make_label(adgroup);   
    adgroup.pause();
    //    Logger.log("made label & paused adgroup");
  }
  // IF NOT SOLDOUT IN GOOGLE DOC
  else if (!soldout && adgroup.isPaused())
  {
    if(label_exists)
    {
      adgroup.enable();
      delete_label(adgroup);
    }
    //    Logger.log("not soldout andbut paused anyway - do nothing");
  }
  else if (!soldout && adgroup.isEnabled())
  if (label_exists)
  {
    delete_label(adgroup);
  }
}
function main() {
  var SPREADSHEET_URL = "google_doc_url";
  //  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var spreadsheets = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheets.setActiveSheet(spreadsheets.getSheets()[SHEET_NUMBER-1]);
  Logger.log(sheet.getName())
//  var sheet = spreadsheet.getActiveSheet();
  var max_rows = sheet.getLastRow();
  var range = 'A1:E' + sheet.getLastRow();
  var data = sheet.getRange(range).getValues();
  //  var label = AdWordsApp.createLabel("Sold out", todayDate, "red");
  //  AdWordsApp.adGroups().get().next().adParams().get().next().getInsertionText()
  for (i in data)
  {
    var campaignName = data[i][0];
    var condition = 'CampaignName = "' + campaignName + '"'
    var computer_friendly_campaignName = "String("+ campaignName +")"
    var adGroupName = String(data[i][1]);
    adGroupName = adGroupName.replace(/'/g, "\\'");
    var sold_out = data[i][4];
//    var price = data[i][3];
    var price = data[i][3]
    Logger.log("Price = "+price)
    var adGroupIterator = AdWordsApp.adGroups()
    .withCondition("Name = '" + adGroupName + "'")
    .withCondition('CampaignName = "' + campaignName + '"')
    .get();
    while (adGroupIterator.hasNext()) 
    {
      var adGroup = adGroupIterator.next();
      var is_paused = adGroup.isPaused();
      pause_enable_label(adGroup, sold_out);
      update_ad_params (adGroup, price);
    }
  }
}
