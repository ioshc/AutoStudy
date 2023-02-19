// DOM文档加载流程：
// (1) 解析HTML结构。
// (2) 加载外部脚本和样式表文件。
// (3) 解析并执行脚本代码。
// (4) 构造HTML DOM模型。// DOMContentLoaded 相当于jQuery中的ready
// (5) 加载图片等外部文件。
// (6) 页面加载完毕。// load

// var eventHandler = function (event) {     
//     console.log(event.type);   
//     console.log(event.timeStamp);    
//     console.log(document.readyState);    
//     console.log('\n');
// }
// console.log(document.readyState);
// document.addEventListener('readystatechange', eventHandler,false);
// document.addEventListener('DOMContentLoaded', eventHandler, false);
// window.addEventListener('load', eventHandler, false);


// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
	// 注入自定义JS
	injectCustomJs('js/jquery-1.9.0.js');
	injectCustomJs('js/autoStudy.js');
});

// 向原始页面注入JS
function injectCustomJs(jsPath) {
	if (!jsPath) { return; };

	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	temp.setAttribute('id', 'autoStudy');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/autoStudy.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}