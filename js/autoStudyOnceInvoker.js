
//如果有已经开始学习的课程则忽略此次请求
var alreadyStarted = false;
var playingFrame = top.lhgfrm_lhgdgId;
if (playingFrame) {
	alreadyStarted = true;
	alert('已经有窗口在自动学习，若需要重新开始，请先关闭之前的窗口');
} else {
	if (confirm('是否开始自动学习') && !alreadyStarted) {
		startStudy();
		alreadyStarted = true;
	};
}