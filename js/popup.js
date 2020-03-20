

var startButton = document.getElementById("startStudyButton");

startButton.onclick = function() { 

	//发送消息给content-script，通知其开始学习
	sendMessageToContentScript({cmd:'startStudy', value:'开始学习'}, function(response)
	{
		console.log('来自content的回复：'+ response);
	});
}

function sendMessageToContentScript(message, callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
