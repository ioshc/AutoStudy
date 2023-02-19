
function startStudy() {
	// 找到“未完成课程”窗口
	var fnodeWindow = document.fnode4 ?? document.fnode5 ?? document.fnode6;

	// 还未打开“未完成课程”窗口
	if (!fnodeWindow) {
        top.$('#RegionPanel1_leftPanel_accordionMenu_ctl01_header').click();
		top.$('#tab-1047-btnWrap').click();

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
	if (index >= courseNodes.length) {
		var pageControl = document.fnode4.$('#AspNetPager1');
		var totalPages = $(pageControl.children()[0]).children();
		var currentPage = $(pageControl).find('span').text();

		if (currentPage < totalPages.length) {
			// 跳转到下一页
			totalPages[currentPage].click();
			// 20秒钟之后开始学习
			window.setTimeout("startStudy();", 20000);

			console.log('当前页面：' + currentPage + '，所有课程都已学习完成，跳转到下一页');
			console.log('20秒之后重新开始自动学习  ......');
		} else {
			console.log('所有课程都已学习完成');
		}
        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

		return;
	}

	var node = courseNodes[index];
	// 找到课程状态
	var trs = $(node).find('tr');
	var tds = $(trs[2]).find('td');
	var courseState = $(tds[2]).find('span').text();
	var courseTitle = $($(trs[0]).find('td')[1]).find('span').text();

	// 如果已完成
	if (courseState == '已完成') {
		console.log('当前课程', courseTitle, '已完成，开始学习下一个课程');
		playNext(courseNodes, index+1);
		return;
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

	console.log('延迟10s开始学习当前课程 ......');
	window.setTimeout(function() {
		courseBtn.click();
		console.log('开始学习课程： ', courseTitle);
		console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

		console.log();
		console.log("当前时间：", Date());
		var remaining = 45 - courseTime + 10;
    	console.log(remaining, '分钟后自动开始学习下一课程  ......');
		window.setTimeout(function() {
			playNext(courseNodes, index+1);
		}, 1000 * 60 * remaining);

	}, 1000 * 10);
}

function markCourseAsStuding(course) {
	// $.ajax({
 //        url: "/ashx/SelectApi.ashx?a=UpdateSelectState",
 //        type: "POST",
 //        data: { "selectclassid": course.params.scid },
 //        dataType: "json",
 //        success: function (data) {
 //            console.log('markCourseAsStuding response: ', data);
 //        },
 //        error: function (e) {
 //        	console.log('markCourseAsStuding error: ', e);	
 //        }
 //    });

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
