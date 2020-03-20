chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					// 只有打开继续教育学习网时才高亮
					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'http://www.cdjxjy.com/IndexMain.aspx'}})
				],
				actions: [new chrome.declarativeContent.ShowPageAction()]
			}
		]);
	});
});