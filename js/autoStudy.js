replaceConfirmFunctionWindow();
startCheckIfCompleted();

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

// 在新窗口中学习课程时才需要检测是否完成
function startCheckIfCompleted() {
	var remainingMin = parseInt($('#labstudenttime').text().slice(-10).replace(/[^0-9]/ig,""));
	console.log("剩余时间：", remainingMin, "分钟", " ------ ", Date());

	// 课程未完成则递归检查
	if (!isNaN(remainingMin)) {
		window.setTimeout( function() {
	 		startCheckIfCompleted();
		}, 1000 * 60);
		return
	}

	fillStudyRecord();
}

// 填写学习记录，在新页面中学习
function fillStudyRecord() {
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

	console.log('填写评论成功，10s后关闭当前窗口');
	window.setTimeout( function() {
	 	window.close();
	}, 1000 * 10);
}