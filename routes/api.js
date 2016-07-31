/*--*******************************************************************************
* Copyright (c) 2016 IBM Corporation and other Contributors.
*
* All rights reserved. 
*
* Contributors: CLEMENCE LEBRUN
* IBM - Initial Contribution
********************************************************************************/

var express = require('express');
var router = express.Router();

var util = require('../utils/util');

var pathSeperator ='/';
var base_path='/api/v0002';
var historian_path =  base_path + pathSeperator + 'historian';
var getdevices_path = 'devices';

//Org APIs
// api to get info of a org
router.get('/organization', function(req, res) {

  var orgId = req.session.api_key.split('-')[1];
  console.log("Info for orgId "+orgId); 
  
  var uri= base_path;

  util.orgId = orgId;
  util.iot_httpCall(uri, req.session.api_key, req.session.auth_token, res, null, true);
  
});

// api to get devices of a org
router.get('/organization/getdevices', function(req, res) {

  var orgId = req.session.api_key.split('-')[1];
  console.log("Fetching the devices for orgId "+orgId); 
  
  util.orgId = orgId;
  console.log("Calling get");
  util.getDevices(req.session.api_key, req.session.auth_token, res);
  
});
// api to get data
router.get('/organization/getdata', function(req, res) {
  
  var orgId = req.session.api_key.split('-')[1];
  console.log("Fetching the devices for orgId "+orgId); 
  
  var uri= base_path + pathSeperator + getdevices_path;
  util.orgId = orgId;

  util.iot_httpCall(uri, api_key, auth_token, res);
  
});

//Historian APIs

//get historical data of a org
router.get('/historian/:orgId', function(req, res) {
  
  var orgId = req.params.orgId;

  console.log("Fetching the historian data for orgId "+orgId); 
  
  var uri= historian_path;

  util.orgId = orgId;
  util.iot_httpCall(uri, api_key, auth_token, res, req.query);
  
});

//get historical data of a deviceType of a org
router.get('/historian/:orgId/:deviceType', function(req, res) {
  
  var orgId = req.params.orgId;
  var deviceType = req.params.deviceType;

  console.log("Fetching the historian data for orgId "+orgId+" for deviceType : "+deviceType); 
  
  var uri= historian_path + pathSeperator + deviceType;

  util.orgId = orgId;
  util.iot_httpCall(uri, api_key, auth_token, res, req.query);
  
});

//get historical data of a device of particular deviceType
router.get('/historian/:orgId/:deviceType/:deviceId', function(req, res) {
  
  var orgId = req.params.orgId;
  var deviceType = "ARM";
  var deviceId= "photocontroller";

  console.log("Fetching the historian data  for orgId "+orgId+" for device : "+deviceId);
    
  var uri= historian_path + pathSeperator + deviceType +  pathSeperator + deviceId;

  util.orgId = orgId;
  util.iot_httpCall(uri, api_key, auth_token, res, req.query);
  
});


module.exports = router;
