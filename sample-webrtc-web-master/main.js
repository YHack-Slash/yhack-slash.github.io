var params, chatUser, chatService, recipientID;
var signaling, videoChat, popups = {};
var isPopupClosed = true;
var userName;

var audio = {
	ring: $('#ring')[0]
};

$(document).ready(function() {
	// Web SDK initialization
	QB.init(QBAPP.appID, QBAPP.authKey, QBAPP.authSecret);
	
	// QuickBlox session creation
	QB.createSession(function(err, result) {
		if (err) {
			console.log(err.detail);
		} else {
			$('#loginForm').modal({
				backdrop: 'static',
				keyboard: false
			});
			
			$('.tooltip-title').tooltip();
			
			// events
			$('#loginForm button').click(login);
			$('#logout').click(logout);
			$('#doCall').click(createVideoChatInstance);
			$('#stopCall').click(stopCall);
			
			window.onbeforeunload = function() {
				if (videoChat) stopCall();
			};
		}
	});
});

function login() {
	$('#loginForm button').hide();
	$('#loginForm .progress').show();
	
	params = {
		login: users[$(this).val()].login,
		password: users[$(this).val()].password
	};
	userName = $(this).data('name');
	
	// chat user authentication
	QB.login(params, function(err, result) {
		if (err) {
			onConnectFailed();
			console.log(err.detail);
		} else {
			chatUser = {
				id: result.id,
				login: params.login,
				pass: params.password
			};
			
			connectChat();
		}
	});
}

function connectChat() {
	// set parameters of Chat object
	params = {
		onConnectFailed: onConnectFailed,
		onConnectSuccess: onConnectSuccess,
		onConnectClosed: onConnectClosed,

		debug: true
	};
	
	chatService = new QBChat(params);
	
	// connect to QB chat service
	chatService.connect(chatUser);
}

function logout() {
	if (videoChat) stopCall();
	chatService.disconnect();
}

function createSignalingInstance() {
	// set parameters of Signaling object
	params = {
		onCallCallback: onCall,
		onAcceptCallback: onAccept,
		onRejectCallback: onReject,
		onStopCallback: onStop,

		debug: false
	};
	
	signaling = new QBSignaling(chatService, params);
}

function createVideoChatInstance(event, sessionID, sessionDescription) {
	// set parameters of videoChat object
	params = {
		constraints: {audio: true, video: true},
		
		sessionID: sessionID,
		sessionDescription: sessionDescription,
		
		onGetUserMediaSuccess: function() {
			getMediaSuccess(sessionID)
		},
		
		onGetUserMediaError: getMediaError,

		debug: false
	};
	
	videoChat = new QBVideoChat(signaling, params);
	
	// set access to user media devices
	videoChat.getUserMedia();
}

function doCall() {
	var extraParams = {
		callType: 1,
		full_name: userName
	};
	
	$('#doCall').hide();
	$('#stopCall').show();
	
	videoChat.call(recipientID, extraParams);
}

function acceptCall() {
	var name, sessionDescription, sessionID;
	
	name = $(this).data('name');
	sessionID = $(this).data('id');
	sessionDescription = $(this).data('description');
	
	isPopupClosed = false;
	popups['remoteCall' + recipientID].close();
	delete popups['remoteCall' + recipientID];
	
	stopRing(popups);
	createVideoChatInstance(null, sessionID, sessionDescription);
}

function rejectCall(qbID, sessionID) {
	var extraParams = {
		full_name: userName
	};
	
	isPopupClosed = false;
	popups['remoteCall' + recipientID].close();
	delete popups['remoteCall' + recipientID];
	
	stopRing(popups);
	videoChat = videoChat || new QBVideoChat(signaling, {sessionID: sessionID});
	videoChat.reject(recipientID, extraParams);
	videoChat = null;
}

function stopCall() {
	var extraParams = {
		status: videoChat.stopReason.MANUALLY,
		full_name: userName
	};
	
	$('#stopCall').hide().parent().find('#doCall').show();
	videoChat.stop(recipientID, extraParams);
	videoChat.hangup();
	videoChat = null;
	
	$('video').attr('src', '');
	$('#localVideo').show();
	$('#remoteVideo, #miniVideo').hide();
}

/* Callbacks
----------------------------------------------------------*/
function onConnectFailed() {
	$('#loginForm .progress').hide();
	$('#loginForm button').show();
}

function onConnectSuccess() {
	var opponent = chooseOpponent(userName);
	recipientID = users[opponent].id;
	
	$('#loginForm').modal('hide');
	$('#wrap').show();
	$('#videochat-footer .opponent').text(opponent);
	createSignalingInstance();
	
	// create a timer that will send presence each 60 seconds
	chatService.startAutoSendPresence(60);
}

function onConnectClosed() {
	$('#wrap').hide();
	$('#loginForm').modal('show');
	$('#loginForm .progress').hide();
	$('#loginForm button').show();
	
	chatUser = null;
	chatService = null;
	signaling = null;
	videoChat = null;
}

function getMediaSuccess(sessionID) {
	var extraParams = {
		full_name: userName
	};
	
	$('#doCall, #stopCall').attr('data-qb', recipientID);
	if (sessionID)
		$('#doCall').hide().parent().find('#stopCall').show();
	
	videoChat.localVideoElement = $('#localVideo')[0];
	videoChat.remoteVideoElement = $('#remoteVideo')[0];
	videoChat.attachMediaStream(videoChat.localVideoElement, videoChat.localStream);
	
	if (sessionID) {
		getRemoteStream();
		videoChat.accept(recipientID, extraParams);
	} else {
		doCall();
	}
}

function getMediaError() {
	var extraParams = {
		full_name: userName
	};
	videoChat.reject(recipientID, extraParams);
}

function onCall(qbID, extraParams) {
	var win, selector, winName = 'remoteCall' + qbID;
	
	if (popups[winName]) {
		popups[winName].close();
		delete popups[winName];
	}
	
	popups[winName] = openPopup(winName, {width: 250, height: 280});
	win = popups[winName];
	
	win.onload = function() {
		selector = $(win.document);
		selector.find('#acceptCall').click(acceptCall);
		selector.find('#rejectCall').click(function() {rejectCall(qbID, extraParams.sessionID)});
		
		htmlRemoteCallBuilder(selector, qbID, extraParams.sdp, extraParams.sessionID, extraParams.full_name);
		audio.ring.play();
		
		win.onbeforeunload = function() {
			if (isPopupClosed)
				rejectCall(qbID, extraParams.sessionID);
			isPopupClosed = true;
		};
	};
}

function onAccept(qbID, extraParams) {
	getRemoteStream();
}

function onReject(qbID, extraParams) {
	$('#stopCall').hide().parent().find('#doCall').show();
	videoChat.hangup();
	videoChat = null;
	
	$('video').attr('src', '');
	$('#localVideo').show();
	$('#remoteVideo, #miniVideo').hide();
}

function onStop(qbID, extraParams) {
	$('#stopCall').hide().parent().find('#doCall').show();
	videoChat.hangup();
	videoChat = null;
	
	$('video').attr('src', '');
	$('#localVideo').show();
	$('#remoteVideo, #miniVideo').hide();
	
	var win = popups['remoteCall' + qbID];
	if (win) {
		isPopupClosed = false;
		win.close();
		delete popups['remoteCall' + qbID];
		
		stopRing(popups);
	}
}

/* Helpers
----------------------------------------------------------*/
function chooseOpponent(currentLogin) {
	return currentLogin == 'Bob' ? 'Sam' : 'Bob';
}

function getRemoteStream() {
	var miniVideo = $('#miniVideo')[0];
	videoChat.reattachMediaStream(miniVideo, videoChat.localVideoElement);
	
	$('#localVideo').hide();
	$('#remoteVideo, #miniVideo').show();
}

function openPopup(winName, sizes) {
	var scrWidth, scrHeight, winWidth, winHeight, disWidth, disHeight;
	var url, params;
	
	scrWidth = window.screen.availWidth;
	scrHeight = window.screen.availHeight;
	
	if (sizes) {
		winWidth = sizes.width;
		winHeight = sizes.height;
	}
	
	disWidth = (scrWidth - winWidth) / 2;
	disHeight = (scrHeight - winHeight) / 2;
	
	url = window.location.origin + window.location.pathname + 'remotecall.html';
	params = ('width='+winWidth+', height='+winHeight+', left='+disWidth+', top='+disHeight+', ');
	
	return window.open(url, winName, params);
}

function htmlRemoteCallBuilder(selector, qbID, sessionDescription, sessionID, name) {
	var avatar = 'images/avatar_default.jpg';
	
	selector.find('title').text('Remote call');
	selector.find('.avatar').attr('src', avatar);
	selector.find('.author').html('<b>' + name + '</b><br>is calling you');
	selector.find('#acceptCall').attr('data-qb', qbID).attr('data-name', name).attr('data-id', sessionID).attr('data-description', sessionDescription);
	selector.find('#remoteCall').show();
}

function stopRing(popups) {
	if (Object.keys(popups).length == 0 || Object.keys(popups).length == 1)
		audio.ring.pause();
}
