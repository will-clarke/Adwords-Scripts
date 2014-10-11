// Functions provide a 'shortcut' for rolling out lots of repetative ads.
// There is one master campaign (in this case, '_offers').
// This maps to other campaigns and it puts the ads to the 'core' adgroup.
// It pauses all currently live ads in the core adgroup unless it is the same as a 'master' ad.

function enableThisAd (template_Ad, adgroup){
  var adIterator = adgroup.ads()
  .withCondition("Headline = '" + template_Ad.getHeadline() + "'")
  .withCondition("Description1 = '" + template_Ad.getDescription1() + "'")
  .withCondition("Description1 = '" + template_Ad.getDescription1() + "'")
  .withCondition("Description2 = '" + template_Ad.getDescription2() + "'")
  .withCondition("DisplayUrl = '" + template_Ad.getDisplayUrl() + "'")
  .withCondition("DestinationUrl = '" + template_Ad.getDestinationUrl() + "'")
  .withCondition("Status = PAUSED ")
  .get()
  while (adIterator.hasNext()) {
    var ad = adIterator.next();
    ad.enable();
  } 
}
function createTemplateAd(template_Ad, adgroup){
  adgroup.createTextAd(template_Ad.getHeadline(), template_Ad.getDescription1(), template_Ad.getDescription2(), template_Ad.getDisplayUrl(), template_Ad.getDestinationUrl());
}
function isThisAdInTheAdgroup(adToTest, adgroup) {
  var returnArray = [];
  var adIterator = adgroup.ads()
  .withCondition('Status = ENABLED')
  .get();
  while (adIterator.hasNext()) {
    var ad = adIterator.next();
    returnArray.push( ad.getHeadline() == adToTest.getHeadline()&&
      ad.getDescription1() == adToTest.getDescription1() &&
        ad.getDescription2() == adToTest.getDescription2() &&
          ad.getDestinationUrl() == adToTest.getDestinationUrl() &&
            ad.getDisplayUrl() == adToTest.getDisplayUrl() &&
              //              ad.getApprovalStatus() == adToTest.getApprovalStatus() &&
              ad.isMobilePreferred() == adToTest.isMobilePreferred() );
  }
  for (var i = 0; i < returnArray.length; i++) {
    if (returnArray[i] === true) {
      return true;
    }
  }
  return false;
}
var brands = [];

function main() {
  var templateAdGroupIterator = AdWordsApp.adGroups()
  .withCondition('CampaignName = "_Offers"').get();
  while (templateAdGroupIterator.hasNext()) {
    var templateAdGroup = templateAdGroupIterator.next();
    Logger.log('Brand: ' + templateAdGroup.getName());
    brands.push(templateAdGroup.getName());
  
    // PAUSE ALL CURRENT ADS IN CORE ADGROUPS WITHIN SPECIFIC BRAND CAMPAIGNS
    var coreAdGroupIterator = AdWordsApp.adGroups()
    .withCondition('CampaignName CONTAINS_IGNORE_CASE "' + templateAdGroup.getName() + '"')
    .withCondition('Name CONTAINS_IGNORE_CASE  "core"')
    .get();
    while (coreAdGroupIterator.hasNext()) {
      var coreAdGroup = coreAdGroupIterator.next();
      
      var coreAdsIterator = coreAdGroup.ads()
      .withCondition('Type=TEXT_AD')
      .withCondition('CampaignStatus = ENABLED')
      .withCondition('AdGroupStatus = ENABLED')
      .withCondition('Status = ENABLED')
      .get();
      while (coreAdsIterator.hasNext()) {
        var coreAd = coreAdsIterator.next();
        //      logAd(ad);
//        Logger.log("Checking " + coreAd.getHeadline() + " -- " + coreAd.getAdGroup().getName() + " -- " + coreAd.getCampaign().getName() );
        //ONLY PAUSE ADS WHICH AREN'T SUPPOSED TO BE THERE (KEEP THE RIGHT ONES)
        if (isThisAdInTheAdgroup(coreAd, templateAdGroup)) {
          //
        }
        else {
          coreAd.pause();
//          Logger.log('Paused ' + coreAd.getHeadline());
        }
      }
      //        coreAd.pause();
      // Search for each ad in the template adgroup in the core adgroups & enable them or create new ads.
      var templateAdIterator = templateAdGroup.ads()
      .withCondition('Status = ENABLED')
      .get();
      while (templateAdIterator.hasNext()) {
        var templateAd = templateAdIterator.next();
        if (isThisAdInTheAdgroup(templateAd, coreAdGroup)){
//          Logger.log("YES This is live and should be- " + templateAd.getHeadline() );
          enableThisAd(templateAd, coreAdGroup);
        }
        else {
//          Logger.log("NO - Creating: " + templateAd.getHeadline() );
          //CREATE AD HERE... OMG
        }
      }
    }
  } 
}
