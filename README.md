Adwords-Scripts
===============

A collection of useful Adwords Scripts

## Campaign Level Params.js
- Uploads keyword-level parameters based on parameters defined in a Google doc

## Copy Labels.js
-  This script copies campaign-level labels down to all its descendants (adgroups, keywords &ads)

## Dynamically start & stop.js
-  This function provides a helper method for dynamically starting & stopping ads. 
-  Checks each DestURL and pauses / enables it on the right date
-  Syntax: yourdomain.com/blablabla?start=02-03&end=6-3
-  Works with variations of date: eg. 02-03 or 2-3
-  MONTH-YEAR

## Offers.js
-  Functions provide a 'shortcut' for rolling out lots of repetative ads.
-  There is one master campaign (in this case, '_offers').
-  This maps to other campaigns and it puts the ads to the 'core' adgroup.
-  It pauses all currently live ads in the core adgroup unless it is the same as a 'master' ad.

## Update Params & Pause Sold Products.js
-  This script takes a list of campaign names & adgroups and paramater values
-  It then updates all keywords within those campaigns / adgroups with the specified parameters.
