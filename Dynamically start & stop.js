//   This function provides a helper method for dynamically starting & stopping ads. 
//   Checks each DestURL and pauses / enables it on the right date
//   Syntax: yourdomain.com/blablabla?start=02-03&end=6-3
//   Works with variations of date: eg. 02-03 or 2-3
//   MONTH-YEAR
//
function main() {
  var date = new Date().getDate()
  var month = new Date().getMonth()+1
  var datevariations = [(date+'-'+month),('0'+date+'-'+month), (date+'-'+'0'+month) , ('0'+date+'-'+'0'+month), 
                        (date+'.'+month),('0'+date+'.'+month), (date+'.'+'0'+month) , ('0'+date+'.'+'0'+month),
                       (date+'/'+month),('0'+date+'/'+month), (date+'/'+'0'+month) , ('0'+date+'/'+'0'+month)]
  var ads_iterator = AdWordsApp
  .ads()
  .withCondition('CampaignStatus = ENABLED')
  .withCondition('AdGroupStatus = ENABLED')
  .withCondition('Status = ENABLED')
  .get()
  while (ads_iterator.hasNext()) {
    var ad = ads_iterator.next()
    var destURL = ad.getDestinationUrl()
    if (destURL && destURL.match('start=')) {      
      for (var i = 0; i < datevariations.length; i++) {
        if (destURL.match('start='+datevariations[i])){
          Logger.log('enabled : ' + 'start=' +datevariations[i] + ' -- ' + destURL)
          ad.enable() 
        }
      }
    }
    if (destURL && destURL.match('stop=')) {      
      for (var i = 0; i < datevariations.length; i++) {
        if (destURL.match('stop=' + datevariations[i])){
          Logger.log(destURL)
          Logger.log('paused : ' + 'start=' + datevariations[i] + ' -- ' + destURL)
          ad.pause()
        }
      }
    }
  }
  var paused_ads_iterator = AdWordsApp
  .ads()
  .withCondition('CampaignStatus = ENABLED')
  .withCondition('AdGroupStatus = ENABLED')
  .withCondition('Status = PAUSED')
  .get()
  while (paused_ads_iterator.hasNext()) {
    var ad = paused_ads_iterator.next()
    var destURL = ad.getDestinationUrl()
    if (destURL && destURL.match('start=')) {     
      for (var i = 0; i < datevariations.length; i++) {
        if (destURL.match('start='+datevariations[i])){
          Logger.log('enabled : ' + 'start=' +datevariations[i] + ' -- ' + destURL)
          ad.enable()
        }
      }
    }
    if (destURL && destURL.match('stop=')) {      
      for (var i = 0; i < datevariations.length; i++) {
        if (destURL.match('stop=' + datevariations[i])){
          Logger.log('paused : ' + 'start=' + datevariations[i] + ' -- ' + destURL)
          ad.pause()
        }
      }
    }
  }
}
