
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
	// 注入自定义JS
	injectCustomJs('js/jquery-1.9.0.js');
	injectCustomJs('js/courseList.js');
});

// 向原始页面注入JS
function injectCustomJs(jsPath) {
	if (!jsPath) {
		return;
	};

	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.setAttribute('id', 'courseList');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/autoStudy.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd != 'startStudy') {
		sendResponse('不要发骚扰信息');
		return;
	}
	injectCustomJs('js/autoStudyOnceInvoker.js');
	sendResponse('成功注入自动学习代码');
});
