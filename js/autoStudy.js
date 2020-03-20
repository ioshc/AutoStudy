

function startStudy() {

	//找到“未完成课程”窗口
	var fnode3Window = window;
	if (fnode3Window == top) {
		fnode3Window = document.fnode3;
	};

	//还未打开“未完成课程”窗口
	if (!fnode3Window) {
		top.$('#RegionPanel1_leftPanel_accordionMenu_ctl01_header-innerCt').click();
		top.$('#ext-gen1152').click();

		setTimeout(function () {	
			var truthBeTold = window.confirm("已自动为您打开未完成课程窗口，是否自动开始学习！");
			if (truthBeTold) {
				startStudy();
			} else window.alert("请手动开始学习");
		}, 1000);
		return;
	};

	//获取所有课程
	var courseNodes = fnode3Window.$('.litable');
	if (courseNodes.length == 0) {
		alert('数据错误，请刷新页面后重试！');
		return;
	}

	var unfinishedCourseBtn;//未完成课程开始按钮
	var unfinishedCourseTitle;//未完成课程名称
	courseNodes.each( function( index, val ) {
		//找到课程状态
		var trs = $(val).find('tr');
		var tds = $(trs[2]).find('td');
		var courseState = $(tds[2]).find('span').text();

		//如果未完成
		if (courseState != '已完成') {
			unfinishedCourseBtn = $($(tds[3]).find('.xx_ben')).find('a');
			unfinishedCourseTitle = $($(trs[0]).find('td')[1]).find('span').text();
			return false;
		}
	});	
	console.log(' ');
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

	//如果本页所有课程都已完成则翻页
	if (!unfinishedCourseBtn) {

		var pageControl = fnode3Window.$('#AspNetPager1');
		var totalPages = $(pageControl.children()[0]).children();
		var currentPage = $(pageControl).find('span').text();

		if (currentPage < totalPages.length + 1) {
			//跳转到下一页
			totalPages[currentPage].click();
			//20秒钟之后开始学习
			window.setTimeout("startStudy();", 20000);

			console.log('当前页面：' + currentPage + '，所有课程都已学习完成，跳转到下一页');
			console.log('20秒之后重新开始自动学习  ......');
		} else {
			console.log('所有课程都已学习完成');
		}
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

		return;
	}

	//开始学习未完成的课程
	unfinishedCourseBtn.click();
	console.log('开始学习课程： “' + unfinishedCourseTitle + "”");

	//获取学习窗口
	var playingFrame = top.lhgfrm_lhgdgId;

	//立即重写弹框函数，让有其他课程正在学习的弹框自动确定并消失
	replaceConfirmFunctionOfIFrame(playingFrame);

	//等待学习窗口加载完成后再注入自动学习代码
    playingFrame.onload = function() {    
		replaceUpdateFunctionOfIFrame(this);

    };    
}

function replaceConfirmFunctionOfIFrame(coursePlayFrame) {

	if (!coursePlayFrame) {
		coursePlayFrame = top.lhgfrm_lhgdgId;
	};

	coursePlayFrame.contentWindow.confirm = function(msg) {

		console.log('自动关闭警告框：“' + msg + "”");
		return true;
	}
}

function replaceUpdateFunctionOfIFrame(coursePlayFrame) {

	if (!coursePlayFrame) {
		coursePlayFrame = top.lhgfrm_lhgdgId;
	};

	coursePlayFrame.contentWindow.updata = function() {

		var remainingTime = 2800 - coursePlayFrame.contentWindow.Startime;

		if (remainingTime > 0) {

			//小于47分钟则继续学习
            coursePlayFrame.contentWindow.UpdateTime();
            coursePlayFrame.contentWindow.__doPostBack("lbtnStudentCourse", "");
            console.log('记录学时，总时间： ' + coursePlayFrame.contentWindow.Startime + '秒  ......');
            window.setTimeout( "var iframe = top.lhgfrm_lhgdgId; if (iframe) {iframe.contentWindow.updata();};" , Math.min(remainingTime*1000, 300000));
        } else {

			//超过47分钟则结束当前学习
			coursePlayFrame.contentWindow.$('.jh_btn').click();

            console.log('当前课程学习完毕');
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        	console.log(' ');

            //5秒后开始学习下一课程
			window.setTimeout("startStudy();", 5000);
            console.log('5秒后自动开始学习下一课程  ......');
        }
	}
}