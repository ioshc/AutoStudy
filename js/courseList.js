
function startStudy() {
	// 找到“未完成课程”窗口
	var fnodeWindow = document.fnode4

	// 还未打开“未完成课程”窗口
	if (!fnodeWindow) {
		top.$('#RegionPanel1_leftPanel_accordionMenu_ctl01_header').click();
        top.$('#treeview-1015-record-fnode4').click();

		setTimeout(function () {	
			var truthBeTold = window.confirm("已自动为您打开未完成课程窗口，是否自动开始学习！");
			if (truthBeTold) {
				startStudy();
			} else window.alert("请手动开始学习");
		}, 1000);
		return;
	};

	// 获取所有课程
	var courseNodes = fnodeWindow.$('.litable');
	if (courseNodes.length == 0) {
		alert('数据错误，请刷新页面后重试！');
		return;
	}

	playNext(courseNodes, 0)
}

function playNext(courseNodes, index) {
	console.log('received courseNodes: ', courseNodes);
	console.log('at index: ', index);

	// 如果本页所有课程都已完成则翻页
	if (trySwitchToNextPage(courseNodes, index)) {
		return;
	}

	var node = courseNodes[index];
	// 找到课程状态
	var trs = $(node).find('tr');
	var tds = $(trs[2]).find('td');
	var courseState = $(tds[2]).find('span').text();
	var studyRecordState = $($(trs[3]).find('td')[2]).find('span').text();
	var courseTitleElement = $($(trs[0]).find('td')[1]).find('span');
	var courseTitle = courseTitleElement.text();

	// 如果已完成
	if (courseState == '已完成') {
		if (studyRecordState == '未填写') {
			console.log('当前课程', courseTitle, '已完成，但未填写学习记录，自动填写 ......');
		} else {
			console.log('当前课程', courseTitle, '已完成，开始学习下一个课程');
			playNext(courseNodes, index+1);
			return;
		}
	}

	// 未完成课程开始按钮
	var courseBtn = $($(tds[3]).find('.xx_ben')).find('a')[0];

	// 未完成课程
	var course = parseURL(courseBtn.href);
	//未完成课程剩余时间
	var courseTime = parseInt(courseState);

	console.log('');
	console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	console.log('找到未完成的课程： ', courseTitle);

	console.log('标记当前课程为学习中 ......');
	markCourseAsStuding(course);

	console.log('延迟5s开始学习当前课程 ......');
	window.setTimeout(function() {
		
		// 点击开始按钮会打开新的窗口，不利于监测学习完成状态
		courseBtn.click();

		// 点击title则在当前页面打开课程学习，在当前页面打开，一段时间后页面会报错
		// courseTitleElement.click();

		// 延迟5s，等待页面加载完成，添加学习完成回调以继续下一课程，当前页面才需要
		// window.setTimeout(function() {
		// }, 1000 * 5);

		console.log('开始学习课程： ', courseTitle);
		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

		console.log("    ");
		console.log("当前时间：", Date());


		// 如果在新窗口中打开课程，则不能跟列表页面同步，只能写死45分钟（40分钟课程时间+5分钟buffer）一节课
		var periodStr = $($(trs[3]).find('td')[1]).text().replace(/[^0-9\.]/ig,"");
		var period = parseFloat(periodStr);
		console.log("课程学时为：", period);
		var courseTotalTime = courseTotalTimeFromPeriod(period);
		console.log("课程总学习时间为：", courseTotalTime, "分钟");
		var remaining = (courseTotalTime ?? 45) - courseTime + 1;

		// 如果在当前窗口学习，则可以通过课程倒计时时间获取剩余时间
		// var remaining = parseInt($('#labstudenttime').text().slice(-10).replace(/[^0-9]/ig,"")) + 1; // 加1分钟buffer

		if (remaining == 0) {
			// 已完成课程，填写学习记录，在当前页打开时才存在
			// completedCurrentCourse();
			// playNext(courseNodes, index+1);
		} else {
			console.log(remaining, '分钟后自动开始学习下一课程  ......');
			window.setTimeout(function() {
				playNext(courseNodes, index+1);
			}, 1000 * 60 * remaining);
		}

	}, 1000 * 5);
}

// 现在无法获取当前课程的学习总时间（分钟数），只能通过学时转换
function courseTotalTimeFromPeriod(period) {
	// 根据范围来转换成时间，等累计足够多的数据后，能大概推出转换规则，目前采取【左闭又开】的方式判断
	
	/* 这是目前已知的对应关系
		5		0.22
		15		0.34
		20		0.51
		30		0.67
		30		0.75
		30 		0.76
		30 		0.78
		75 		1.7
		85		2
		90		2.04
	*/

	if (period >= 0 && period < 0.23) {
		return 5
	}

	if (period >= 0.23 && period < 0.35) {
		return 15
	}

	if (period >= 0.35 && period < 0.52) {
		return 20
	}

	if (period >= 0.52 && period < 0.79) {
		return 30
	}

	if (period >= 0.79 && period < 1.71) {
		return 75
	}

	if (period >= 1.71 && period < 2.01) {
		return 85
	}

	if (period >= 2.01 && period < 2.05) {
		return 90
	}
}

function trySwitchToNextPage(courseNodes, index) {
	if (index < courseNodes.length) {
		return false;
	}

	var pageControl = document.fnode4.$('#AspNetPager1');
	var totalPages = $(pageControl.children()[0]).children();
	var currentPage = $(pageControl).find('span').text();

	if (currentPage < totalPages.length) {
		// 跳转到下一页
		totalPages[currentPage].click();
		// 20秒钟之后开始学习
		window.setTimeout("startStudy();", 20000);

		console.log('当前页面：' + currentPage + '，所有课程都已学习完成，跳转到下一页');
		console.log('10秒之后重新开始自动学习  ......');
	} else {
		console.log('所有课程都已学习完成');
	}
	console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

	return true;
}

// 在当前页面播放时才需要
// function completedCurrentCourse() {
// 	fillStudyRecord();

// 	console.log('延迟2s退回到先前页面继续学习 ......');

// 	window.setTimeout(function() {
// 		// window.history.go(-1);
// 		$('#tab-1043-closeEl').click();

// 		window.setTimeout("startStudy();", 20000);
// 	}, 2000);
// }

// 填写学习记录，在当前页面学习
// function fillStudyRecord() {
// 	var keyPoint = "授课内容新颖，独到，有自己的特色，能很好的启发、带动学生的思维。立意新，大大地启发了学生的创造性思维"
// 	var comments = "贴近学生实际情况，引入生活化，注意历史核心素养的培养。深入浅出。贴近学生实际情况，引入生活化。"

// 	var fnodeWindow = document.fnode4

// 	// 切换到‘学习记录’
// 	fnodeWindow.$('div.courseToggle_hook')[1].click();

//     // 填写内容要点
// 	fnodeWindow.$('#txtareainnertContents').val(keyPoint);
//     // 填写体会或感悟
// 	fnodeWindow.$('#txtareaExperience').val(comments);
//     // 提交
// 	fnodeWindow.$('#AddRecord').click();

// 	console.log('成功添加学习记录 ......');

// 	// 关闭学习记录成功弹窗 
// 	fnodeWindow.$('a.layui-layer-btn0').click()
// }

function markCourseAsStuding(course) {
    $.ajax({
        url: "/ashx/SelectApi.ashx?a=IsOpenOldWeb",
        type: "POST",
        data: { "selectclassid": course.params.scid },
        dataType: "json",
        success: function (data) {
        	console.log('IsOpenOldWeb response: ', data);
        	console.log('调用UpdateSelectState ......');
            if (data.state == "success") {
                $.ajax({
                    url: "/ashx/SelectApi.ashx?a=UpdateSelectState",
                    type: "POST",
                    data: { "selectclassid": course.params.scid },
                    dataType: "json",
                    success: function (data) {
                        console.log('UpdateSelectState response: ', data);
                    }
                });
            }
        }
    });
}

function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
            seg = a.search.replace(/^\?/,'').split('&'),
            len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}