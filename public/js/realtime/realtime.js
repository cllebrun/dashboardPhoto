/*******************************************************************************
* Copyright (c) 2016 IBM Corporation and other Contributors.
*
* All rights reserved. 
*
* Contributors: CLEMENCE LEBRUN
* IBM - Initial Contribution
*******************************************************************************/

var subscribeTopic = "";


var Realtime = function(api_key, auth_token, _simulstate, orgInfos) {
	console.log("simul: " + _simulstate);
	var hostname;
	if(_simulstate == "realtime"){
		var tabInfos = orgInfos.split(':');
		var orgId = tabInfos[1];
		var clientId="a:"+orgId+":" +Date.now();

		console.log("clientId: " + clientId);
		var hostname = orgId+".messaging.internetofthings.ibmcloud.com";
	}
	
	var firstMessage = true;

	
	var client;
	function startSimul(_simulstate) {
		if (_simulstate == "day"){
			if (document.getElementById('duty') != null)
				document.getElementById('duty').innerHTML = " 30%";
			if (document.getElementById('state_') != null)
				document.getElementById('state_').innerHTML = " Simulation DAY";
			if (document.getElementById('loudness') != null)
				document.getElementById('loudness').innerHTML = Math.round(100) +" %";
			if (document.getElementById('power') != null)
				document.getElementById('power').innerHTML = 8;
			if (document.getElementById('power_s') != null)
				document.getElementById('power_s').innerHTML = 8;
			if (document.getElementById('light') != null)
				document.getElementById('light').innerHTML = Math.round(100) +" %";
			if (document.getElementById('voltage_b') != null)
				document.getElementById('voltage_b').innerHTML = 50;
			//lamp turned off
			if (document.getElementById('lamp') != null){
				document.getElementById('lamp').innerHTML = "Turned Off";
				document.getElementById('panel_light').style.backgroundColor="Gainsboro";
			}	
			if(document.getElementById('efficiency') != null){
				document.getElementById('efficiency').innerHTML = 100+" %";
			}
			if (document.getElementById('charging-img') != null)
				document.getElementById('charging-img').style.display='block';
			if (document.getElementById('discharging-img') != null)
				document.getElementById('discharging-img').style.display='none';
			if (document.getElementById('stable-img') != null)
				document.getElementById('stable-img').style.display='none';
			if (document.getElementById('intensity') != null)
				document.getElementById('intensity').innerHTML = 50;
			if (document.getElementById('voltage') != null)
				document.getElementById('voltage').innerHTML = 50;
			if (document.getElementById('power') != null)
				document.getElementById('power').innerHTML = 50;
			if (document.getElementById('motion-text') != null){
				document.getElementById('motion-text').innerHTML = "Detected presence";
				document.getElementById('motion').className = "fa fa-child fa-5x";
			}else if (document.getElementById('motion') != null){
				document.getElementById('motion').innerHTML = 1;
			}
			if(document.getElementById('state_charging') != null){
				if(document.getElementById('state_light') != null){
					document.getElementById('state_light').checked = false;
					document.getElementById('state_power').checked = false;
					document.getElementById('state_charging').checked = true;
				}
			}
			if(document.getElementById('state_low') != null){
				document.getElementById('state_low').checked = false;
				document.getElementById('state_full').checked = true;
			}
			if(document.getElementById('current_dim') != null)
				document.getElementById('current_dim').innerHTML = "100 %";
			if(document.getElementById('charge_perc') != null )	
				document.getElementById('charge_perc').innerHTML = "95 %";
				

		} else if (_simulstate == "night"){
			if (document.getElementById('duty') != null)
				document.getElementById('duty').innerHTML = " 70%";
			if(document.getElementById('efficiency') != null){
				document.getElementById('efficiency').innerHTML = 0+" %";
			}
			if (document.getElementById('state_') != null)
				document.getElementById('state_').innerHTML = " Simulation NIGHT";
			if (document.getElementById('loudness') != null)
				document.getElementById('loudness').innerHTML = Math.round(2) +" %";
			if (document.getElementById('power') != null)
				document.getElementById('power').innerHTML = 0;
			if (document.getElementById('light') != null)
				document.getElementById('light').innerHTML = Math.round(15) +" %";
			if (document.getElementById('voltage_b') != null)
				document.getElementById('voltage_b').innerHTML = 50;
			//lamp turned off
			if (document.getElementById('lamp') != null){
				document.getElementById('lamp').innerHTML = "Turned On";
				document.getElementById('panel_light').style.backgroundColor="gold";
			}
			if (document.getElementById('charging-img') != null)
				document.getElementById('charging-img').style.display='none';
			if (document.getElementById('discharging-img') != null)
				document.getElementById('discharging-img').style.display='block';
			if (document.getElementById('stable-img') != null)
				document.getElementById('stable-img').style.display='none';
			if (document.getElementById('intensity') != null)
				document.getElementById('intensity').innerHTML = 0;
			if (document.getElementById('voltage') != null)
				document.getElementById('voltage').innerHTML = 5;
			if (document.getElementById('voltage_b') != null)
				document.getElementById('voltage_b').innerHTML = 5;
			if (document.getElementById('power_s') != null)
				document.getElementById('power_s').innerHTML = 0;
			if (document.getElementById('motion-text') != null){
				document.getElementById('motion-text').innerHTML = "No detected presence";
				document.getElementById('motion').className = "fa fa-male fa-5x";
			}else if (document.getElementById('motion') != null){
				document.getElementById('motion').innerHTML = 0;
			}
			if(document.getElementById('state_charging') != null){
				if(document.getElementById('state_light') != null){
					document.getElementById('state_light').checked = true;
					document.getElementById('state_power').checked = true;
					document.getElementById('state_charging').checked = false;
				}
			}	
			if(document.getElementById('state_low') != null){
				document.getElementById('state_low').checked = true;
				document.getElementById('state_full').checked = false;
			}
			if(document.getElementById('current_dim') != null)
				document.getElementById('current_dim').innerHTML = "100 %";
			if(document.getElementById('charge_perc') != null )	
				document.getElementById('charge_perc').innerHTML = "25 %";


		} else if (_simulstate == "nothing"){
			console.log("No simulation defined, no device conected");

		} else{
			console.log("Error, simulation state undifined");
		}	
		return;	
	}
	this.initialize = function(){

		
		if(_simulstate == "realtime"){
			client = new Messaging.Client(hostname, 8883,clientId);
			// Initialize the Realtime Graph
			var rtGraph = new RealtimeGraph();

			client.onMessageArrived = function(msg) {
				var topic = msg.destinationName;
				console.log("topic2: " + topic);
				console.log("payload: " + msg.payloadString);
				var payload = JSON.parse(msg.payloadString);
				console.log(payload);
				//First message, instantiate the graph  
			    if (firstMessage) {
			    	$('#chart').empty();
			    	firstMessage=false;
			    	rtGraph.displayChart(null,payload);
			    	rtGraph.displayChartCharge(null,payload);
	  
			    } else {
			    	rtGraph.graphData(payload);
			    	rtGraph.graphDataCharge(payload);

			    }
			    rtGraph.updateVal(payload);
			    rtGraph.updateGauge(payload);
			    //rtGraph.updateJoystick(payload);
			    
			};

		} else {
			startSimul(_simulstate);
		}
		
		if(_simulstate == "realtime"){


			client.onConnectionLost = function(e){
				console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
				this.connect(connectOptions);
			}

			var connectOptions = new Object();
			connectOptions.keepAliveInterval = 3600;
			connectOptions.useSSL=true;
			connectOptions.userName=api_key;
			connectOptions.password=auth_token;
			connectOptions.onSuccess = function() {
				console.log("MQTT connected to host: "+client.host+" port : "+client.port+" at " + Date.now());
			}

			connectOptions.onFailure = function(e) {
				console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
			}

			console.log("about to connect to " + client.host);
			client.connect(connectOptions);
		}

	}

	// Subscribe to the device when the device ID is selected.
	this.plotRealtimeGraph = function(){
		var subscribeOptions = {
			qos : 0,
			onSuccess : function() {
				console.log("subscribed to " + subscribeTopic);
			},
			onFailure : function(){
				console.log("Failed to subscribe to " + subscribeTopic);
				console.log("As messages are not available, visualization is not possible");
			}
		};
		

		console.log(orgInfos);
		var tokens = orgInfos.split(':');
		if(subscribeTopic != "") {
			console.log("Unsubscribing to " + subscribeTopic);
			client.unsubscribe(subscribeTopic);
		}

		//clear prev graphs
		$('#chart').hide(function(){ 
			$('#chart').empty(); 
			$('#chart').show();
			$('#chart').append(imageHTML);
		});
		
		$('#timeline').empty();
		$('#legend').empty();
		
		firstMessage = true;

		subscribeTopic = "iot-2/type/" + tokens[2] + "/id/" + tokens[3] + "/evt/+/fmt/json";
		console.log("topic: " + subscribeTopic)
		client.subscribe(subscribeTopic,subscribeOptions);
	};

	this.initialize();

	var imageHTML = '<div class="iotdashboardtext">The selected device is not currently sending events to the Internet of Things Foundation</div><br><div class="iotdashboardtext">Select to view historical data or select a different device.</div> <img class="iotimagesMiddle" align="middle" alt="Chart" src="images/IOT_Icons_Thing02.svg">';
}

function init(){
	
	//var paramsTab = decodeURIComponent(location.search).split('&');
	var apiKey = localStorage.getItem("api_key");
	var apiToken = localStorage.getItem("auth_token");
	var state = localStorage.getItem("simulstate");
	var deviceId = localStorage.getItem("deviceId");
	if(state == "realtime"){
		var realtime = new Realtime(apiKey, apiToken, state, deviceId );
		realtime.plotRealtimeGraph();
	} else{
		var realtime = new Realtime(apiKey, apiToken, state, deviceId );
	}
	
}
init();
