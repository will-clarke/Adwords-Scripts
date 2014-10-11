// This script copies campaign-level labels down to all its descendants (adgroups, keywords &ads)
//
var specific_label = "my_label";
var count = 0;

var campaigns_to_miss = 235;

function main() {
  var arg = String('LabelNames CONTAINS "'+ specific_label +'"');
  var campaignIterator = AdWordsApp.campaigns()
  .withCondition('Status = "ENABLED"')
  .withCondition('LabelNames CONTAINS_ANY ["'+ specific_label +'"]')
  .get();
  Logger.log(campaignIterator.totalNumEntities());
  while (campaignIterator.hasNext()) {
    count += 1;
    while(count < campaigns_to_miss){
      campaignIterator.next();
      count+= 1;
    };
    var campaign = campaignIterator.next();
    Logger.log(count + " -- " + campaign.getName());
    var adGroupIterator = campaign.adGroups().get();
    while(adGroupIterator.hasNext()){
      var adgroup = adGroupIterator.next();
      var keywordIterator = adgroup.keywords().get();
      var adIterator = adgroup.ads().get();
      while(keywordIterator.hasNext()){
        var keyword = keywordIterator.next();
        //        Logger.log(keyword.getText());
        keyword.applyLabel(specific_label);
      };
      while(adIterator.hasNext()){
        var ad = adIterator.next();
        //        Logger.log(ad.getHeadline());
        ad.applyLabel(specific_label);
      };
    };
  };
};
