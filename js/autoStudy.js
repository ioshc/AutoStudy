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

replaceConfirmFunctionWindow();
startCheckIsCompleted();

function replaceConfirmFunctionWindow() {
	window.confirm = function(msg) {
		console.log('自动关闭confirm框：“' + msg + "”");
		return true;
	}
	console.log('替换自动弹窗confirm事件');

	window.alert = function(msg){
		console.log('自动关闭alert框：“' + msg + "”");
	}
	console.log('替换自动弹窗alert事件');

    showyzm = function() {
        console.log('阻止验证码框');
    }
    console.log('替换验证码弹窗事件');
}

function startCheckIsCompleted() {
	var remainingMin = parseInt($('#labstudenttime').text().slice(-10).replace(/[^0-9]/ig,""));
	console.log("剩余时间：", remainingMin, "分钟");

	// 课程未完成则递归检查
	if (!isNaN(remainingMin)) {
		window.setTimeout( function() {
	 		startCheckIsCompleted();
		}, 1000 * 60);
		return
	}

	// 填写学习记录并关闭当前学习页面
	var keyPoint = "授课内容新颖，独到，有自己的特色，能很好的启发、带动学生的思维。立意新，大大地启发了学生的创造性思维"
	var comments = "贴近学生实际情况，引入生活化，注意历史核心素养的培养。深入浅出。贴近学生实际情况，引入生活化。"

	var logPannel = $('.course-wrapper');
    // 切换到‘学习记录’
	logPannel.find('.clearFix').children()[1].click();
    // 填写内容要点
	logPannel.find('#txtareainnertContents').val(keyPoint);
    // 填写体会或感悟
	logPannel.find('#txtareaExperience').val(comments);
    // 提交
	logPannel.find('#AddRecord').click();

	console.log('填写评论成功，30s后关闭当前窗口');
	window.setTimeout( function() {
	 	window.close();
	}, 1000 * 30);
}
