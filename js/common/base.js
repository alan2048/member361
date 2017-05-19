var user={
		userUuid:GetQueryString("userUuid"),
		classId:GetQueryString("classId"),
		perssionNames:GetQueryString("perssionNames")
};
var serverUrl01="http://www.member361.com";//84正式服务器
var serverUrl02="http://121.43.150.38";//38测试服务器
var serverHost="http://www.member361.com";

var path01="http://172.168.90.101";//38测试服务器

var path=serverUrl01; //更改服务器地址可设置此值
var httpUrl={
		// 基础接口
		loginId:getCookie("loginId"),
		login:path+"/jfinal_mbjy_basic/login",// 首页登入
		back:path+"/jfinal_mbjy_basic/back",//首页登入回调
		loginHttp:path+"/jfinal_mbjy_basic/", // 登入地址
		logoutHttp:path, // 注销地址
		path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // 图片地址
		picUrl:path+"/jfinal_mbjy_basic/file/upload", // 图片上传地址
		memberRecord:path+"/sample_front/memberRecord/memberRecord.html",//成长档案网址

		// 00公共接口
		permission:path+"/jfinal_mbjy_basic/permission",// NAV导航栏和右侧树结构
		getTeacherList:path+"/jfinal_mbjy_basic/account/getTeacherList", // 获取学校教师信息
		getUserClassInfo01:path+"/jfinal_mbjy_basic/basic/GetUserClassInfo",//获取用户班级信息 与下面一接口相同
		getAllClassInfo:path+"/jfinal_mbjy_basic/basic/getAllClassInfo",//获取全部班级列表
		getClassMemberInfo:path+"/jfinal_mbjy_basic/basic/getClassMemberInfo",//获取班级成员信息
		getClassStudentInfo:path+"/jfinal_mbjy_basic/basic/getClassStudentInfo",//获取学生信息
		
		// 01师资管理
		teacher:path+"/jfinal_mbjy_basic/teacher",// 教师信息查询

		// 02班务管理

		// 03教学管理
		courseList:path+"/jfinal_mbjy_sample/course/list",// 获取课程计划列表
		courseSave:path+"/jfinal_mbjy_sample/course/save",// 新增课程
		courseUpdate:path+"/jfinal_mbjy_sample/course/update",// 编辑课程
		courseDelete:path+"/jfinal_mbjy_sample/course/delete",// 删除课程
		courseDetail:path+"/jfinal_mbjy_sample/course/detail", // 查看课程详情
		getPersonCourse:path+"/jfinal_mbjy_sample/course/getPersonCourse",// 获取个人观察计划列表
		courseDim:path+"/jfinal_mbjy_sample/dim/courseDim",// 获取观察计划的维度列表
		
		dailyEvaluationList:path+"/jfinal_mbjy_sample/record/list", //获取日常评价记录列表
		dailyEvaluationTypicalList:path+"/jfinal_mbjy_sample/record/typicalList", //获取典型案例记录列表
		dailyEvaluationDelete:path+"/jfinal_mbjy_sample/record/delete", // 日常评价删除
		dailyEvaluationSaveLevel:path+"/jfinal_mbjy_sample/record/saveLevel", // 评价日常观察记录
		dailyEvaluationUpdate:path+"/jfinal_mbjy_sample/record/update", // 更新日常观察记录
		dailyEvaluationDetail:path+"/jfinal_mbjy_sample/record/detail", // 日常评价详情
		studentRecordList:path+"/jfinal_mbjy_sample/record/studentRecordList",//获取班级学生观察记录列表
		recordToWord:path+"/jfinal_mbjy_sample/file/recordToWord",//导出学生观察记录

		watchDimensions:path+"/jfinal_mbjy_sample/dim/list", // 观察维度树结构
		dimSave:path+"/jfinal_mbjy_sample/dim/save",// 新增观察维度
		dimUpdate:path+"/jfinal_mbjy_sample/dim/update",// 编辑观察维度
		dimDelete:path+"/jfinal_mbjy_sample/dim/delete", // 删除观察维度
		
		getDimLevelList:path+"/jfinal_mbjy_sample/dim/getDimLevelList", // 获取观察维度的水平描述
		saveDimLevel:path+"/jfinal_mbjy_sample/dim/saveDimLevel", // 新增观察维度水平描述
		updateDimLevel:path+"/jfinal_mbjy_sample/dim/updateDimLevel", // 编辑观察维度水平描述
		deleteDimLevel:path+"/jfinal_mbjy_sample/dim/deleteDimLevel", // 删除观察维度水平描述
		
		//月周计划
		fileUpload:path+":18081/FileCloud/fileUpload", // 上传
		fileDownload:path+":18081/FileCloud/fileDownload", // 下载
		insertFileInfo:path+":18081/FileCloud/insertFileInfo", // 添加新文件（夹）
		deleteFileInfo:path+":18081/FileCloud/deleteFileInfo", // 删除文件（夹）
		updateFileName:path+":18081/FileCloud/updateFileName", // 重命名文件（夹）
		updateEvaluate:path+":18081/FileCloud/updateEvaluate", // 更改文件评级
		getRootFileUUID:path+":18081/FileCloud/getRootFileUUID", // 获取根文件夹UUID
		getParentUUID:path+":18081/FileCloud/getParentUUID", // 获取上级文件夹UUID
		getAllChildInfo:path+":18081/FileCloud/getAllChildInfo", // 获取子级全部文件（夹）
		// 04保健管理
		getClassHealthInfo:path+":18082/HealthInfo/getClassHealthInfo",//获得班级健康信息
		calculateAge:path+":18082/HealthInfo/calculateAge",//根据导入日期计算年龄
		getExamDateListByClass:path+":18082/HealthInfo/getExamDateListByClass",//根据班级获得检查日期列表
		insertHealthInfo:path+":18082/HealthInfo/insertHealthInfo",//增加健康信息
		deleteHealthInfo:path+":18082/HealthInfo/deleteHealthInfo",//删除健康信息
		updateHealthInfo:path+":18082/HealthInfo/updateHealthInfo",//更新健康信息
		getPValue:path+":18082/HealthInfo/getPValue",//取得p值
		getFatnessValue:path+":18082/HealthInfo/getFatnessValue",//取得肥胖值
		getBirthdaySex:path+":18082/HealthInfo/getBirthdaySex",//取得学员生日和性别
		getSingleHealthInfo:path+":18082/HealthInfo/getSingleHealthInfo",// 健康信息编辑详情
		importHealthInfo:path+":18082/HealthInfo/importHealthInfo",// 批量导入

		getDateList:path+":18082/HealthInfo/getTableInfoList",// 获得菜谱日期列表
		healthGetTable:path+":18082/HealthInfo/getTable",// 获得整张表的内容
		healthSaveTable:path+":18082/HealthInfo/saveTable",// 新增编辑菜谱新表
		healthDeleteTable:path+":18082/HealthInfo/deleteTable",// 删除菜谱

		//风险预警
		getCompanyHealthAlert:path+":18082/HealthInfo/getCompanyHealthAlert",//获得预警信息
		insertHealthAlert:path+":18082/HealthInfo/insertHealthAlert",//增加健康预警
		getAlertType:path+":18082/HealthInfo/getAlertType",//获得预警类型
		getAlertAge:path+":18082/HealthInfo/getAlertAge",//获得预警年龄
		deleteHealthAlert:path+":18082/HealthInfo/deleteHealthAlert",//删除健康预警
		updateHealthAlert:path+":18082/HealthInfo/updateHealthAlert",//编辑健康预警
		getHealthAlert:path+":18082/HealthInfo/getHealthAlert",//编辑获得单条预警信息记录

		// 05家园互动
		recordStudent:path+":15001/mbtrack/dan/student",// 获取学生列表（含档案信息）
		recordList:path+":15001/mbtrack/danbook/list",// 获取档案册列表
		recordMonthList:path+":15001/mbtrack/danbook/danList",// 获取档案册档案页详情
		recordNewDanbook:path+":15001/mbtrack/danbook/save",// 新建档案册
		recordDownload:path+":15001/file/patch/download",//图片批量下载（档案页）
		recordDanbookUpdate:path+":15001/mbtrack/danbook/update",// 档案册名更新

		GetSchoolIds:path+":15001/imsInterface/TSCourse_GetSchoolIds",//特色课程 获取学校课程id
		GetSchoolJYIds:path+":15001/imsInterface/TSCourse_GetSchoolJYIds",//剧场活动 id
		GetSchoolCourses:path+":15001/imsInterface/TSCourse_GetSchoolCourses",//特色课程 获取学校课程
		AddCourse:path+":15001/imsInterface/TSCourse_AddCourse",//特色课程 新增
		GetCourseDetails:path+":15001/imsInterface/TSCourse_GetCourseDetails",//获取学校课程详情
		tsDelCourse:path+":15001/imsInterface/TSCourse_DelCourse",// 删除学校课程
		tsGetBookedChildren:path+":15001/imsInterface/TSCourse_GetBookedChildren",// 签到学生列表
		tsCallRoll:path+":15001/imsInterface/TSCourse_CallRoll",// 签到
		tsCancelRoll:path+":15001/imsInterface/TSCourse_CancelRoll",// 取消签到
		tsTempBookCourse:path+":15001/imsInterface/TSCourse_tempBookCourse",// 补加预约人数

		// 06消息发布
		GetClassNotifyInfos:path+":12001/YY/GetClassNotifyInfos",// 获得班级活动列表
		getUserClassInfo:path+":12001/YY/GetUserClassInfo",//获取用户班级信息
		AddNewClassInfo:path+":12001/YY/AddNewClassInfo",// 获取班级信息

		GetSchoolNotifyInfos:path+":12001/YY/GetSchoolNotifyInfos",// 获得学校通知列表
		AddNewSchoolInfo:path+":12001/YY/AddNewSchoolInfo",// 新增学校通知

		GetParentsLessionInfos:path+":12001/YY/GetParentsLessionInfos",// 获得家长课堂列表
		AddParentsLessionInfo:path+":12001/YY/AddParentsLessionInfo",// 新增家长课堂

		GetHealthColumnInfos:path+":12001/YY/GetHealthColumnInfos",// 获得健康专栏列表
		AddHealthColumnInfo:path+":12001/YY/AddHealthColumnInfo",// 新增健康专栏

		GetNotify2Info:path+":12001/YY/GetNotify2Info",// 长桥 新闻总口
		AddNotify2Info:path+":12001/YY/AddNotify2Info",// 长桥 新闻总口 新增

		// 07管理与统计
		getPersonEvaluate:path+":48080/jfinal_mbjy_sample/report/getPersonEvaluate",// 个人综合能力评价
		getClassEvaluate:path+":48080/jfinal_mbjy_sample/report/getClassEvaluate",// 班级综合能力水平
		classRecord:path+":15001/jfinal_mbjy_sample/report/classRecord",// 班级观察记录统计
		classRecordDim:path+":15001/jfinal_mbjy_sample/report/classRecordDim",// 观察指标对应观察记录统计
		getStudentAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentAbilityStrong",// 个人综合能力评价 雷达图
		getStudentCourseAbility:path+":15001/imsInterface/TJ_GCJL_GetStudentCourseAbility",// 个人课程 能力评价 雷达图
		getClassesAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassesAbilibySimple",// 班级综合能力水平 
		getCourseAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetCourseAbilibySimple",// 班级课程能力水平 
		getClassAbilibySimple:path+":15001/imsInterface/TJ_GCJL_GetClassAbilibySimple",// 班级综合能力水平 雷达图
		getCourseSimpleTJ:path+":15001/imsInterface/TSCourse_getCourseSimpleTJ",// 自选活动 活动统计 
		getCourseClassTJ:path+":15001/imsInterface/TSCourse_getCourseClassTJ",// 自选活动 班级统计 
		getCourseStudentTJ:path+":15001/imsInterface/TSCourse_getCourseStudentTJ",// 自选活动 学生统计 
		getCourseStudentDetailTJ:path+":15001/imsInterface/TSCourse_getCourseStudentDetailTJ",// 自选活动 活动统计详情 
		getCourseAllTJ:path+":15001/imsInterface/TSCourse_getCourseAllTJ",// 自选活动 活动统计01

		// 08设置
		setting:'' 
};

function initAjax(url,param,callback,callback01) {
	$.ajax({
            type:"POST",
            url:url,
            data:param,
            dataType:"json",
            statusCode:{
                404:function(){
                    alert("访问地址不存在或接口参数有误 错误代码404");
                },
                500:function(){
                    console.log("因为意外情况，服务器不能完成请求 错误代码500");
                    // window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    alert("资源被禁止 错误代码405");
                }
            },
            beforeSend:function () {
            	// loadingIn();// loading载入
            },	
            success:function(result){
                callback(result,callback01);
                // loadingOut(); // loading退出
            },
            error:function(result){
                console.log("请求失败 error!000");
                window.location.href=httpUrl.loginHttp;
            }
        });	
};

function permission_port(callback01) {
	if(!user.userUuid && !user.classId){
		if(path==serverUrl01){
			user.userUuid="b0520db6-014e-49d9-8db1-206ae3530d58";// 默认开发用 小萌姐姐账号
			user.classId="264623"
			user.perssionNames=''
		}else{
			user.userUuid="eead86bb-87c2-4bec-8fd7-90246f1462a6";// 默认开发用 小炉账号
			user.classId="2"
			user.perssionNames=''
		}
	};
	var param={
                userUuid:user.userUuid,
                classId:user.classId,
                perssionNames:user.perssionNames
            };

	$.ajax({
            type:"POST",
            url:httpUrl.permission,
            data:param,
            dataType:"json",
            statusCode:{
                404:function(){
                    alert("访问地址不存在或接口参数有误 错误代码404");
                },
                500:function(){
                    console.log("因为意外情况，服务器不能完成请求 错误代码500");
                    window.location.href=httpUrl.loginHttp;
                },
                405:function(){
                    alert("资源被禁止 错误代码405");
                }
            },
            beforeSend:function () {
            	// loadingIn();// loading载入
            },	
            success:function(result){
                permission_callback(result,callback01);
                // loadingOut(); // loading退出
            },
            error:function(result){
                console.log("请求失败 error!");
                // window.location.href=httpUrl.loginHttp;
            }
    });
};
function permission_callback(res,callback01) {
	user.curCompany=res[0].curCompany;
	user.curClassId=res[3];
	user.id=res[0].curUser.id;
	callback01(res);
	spliceUrl(res);// 重新拼接treesURL地址
	if(!res[0].curOrgList){
		res[0].curOrgList;
	}
	for(var i=0;i<res[0].curOrgList.length;i++){
		res[0].curOrgList[i].class=path+'/back?userUuid='+res[0].curUser.uuid+'&classId='+res[0].curOrgList[i].id;
		res[0].curOrgList[i].theme=path+'/jfinal_mbjy_theme/home?userUuid='+res[0].curUser.uuid+'&userId='+res[0].curUser.id+'&classId='+res[0].curOrgList[i].id;
	}
	new Vue({
			el:'#header',
			data:{
				curCompany:{
					name:res[0].curCompany.name,
					id:res[0].curCompany.id
				},
				curUser:{
					userName:res[0].curUser.userName,
					jobTitle:'['+res[0].curUser.jobTitle+']',
					portraitId:httpUrl.path_img+res[0].curUser.portraitId+'&Thumbnail=1'
				},
				classItems:{
					classItems:res[0].curOrgList,
					curClass:res[4],
					curClassId:res[3]
				},
				logoutHttp:httpUrl.logoutHttp
			}
	});
	new Vue({
			el:'#breadcrumb',
			data:{
				curCompany:{
					name:res[0].curCompany.name,
					id:res[0].curCompany.id
				},
				curUser:{
					userName:res[0].curUser.userName,
					jobTitle:'['+res[0].curUser.jobTitle+']',
					portraitId:httpUrl.path_img+res[0].curUser.portraitId+'&Thumbnail=1'
				},
				classItems:{
					classItems:res[0].curOrgList,
					curClass:res[4]
				}
			}
	});
	new Vue({
			el:'#sidebar',
			data:{
				trees:res[1]
			}
	});
	treesToggle(); // 树结构收缩折叠功能函数
	treeHover(res);// 树结构加上hover效果函数
};
// 树结构收缩折叠功能函数
function treesToggle() {
	$(".has-sub").click(function(){
   		$(".has-sub").removeClass("active");
   		$(this).addClass("active");
   	});
   	$('.sidebar .nav > .has-sub > a').click(function () {
    	var e = $(this).next('.sub-menu');
    	var t = '.sidebar .nav > li.has-sub > .sub-menu';
    	$(t).not(e).slideUp(250);
    	$(e).slideToggle(250)
  	});
  	$('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function () {
    	var e = $(this).next('.sub-menu');
    	$(e).slideToggle(250)
  	});
};
// loading载入函数
function loadingIn() {
	$("#page-loader").removeClass('hide');
	$("#page-loader").css("z-index","999999");
};
function loadingOut(argument) {
	$("#page-loader").addClass('hide');	
};

Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

// 地址栏search参数筛选函数
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
}
function spliceUrl(res) {
	var userUuid=res[0].curUser.uuid;
	var classId=res[3];
	var treesArr=res[1];
	for(var i=0;i<treesArr.length;i++){
		if(treesArr[i].url!="#"){
			treesArr[i].url=treesArr[i].url+"?userUuid="+userUuid+"&classId="+classId+"&perssionNames="+treesArr[i].description;
		};
		if(treesArr[i].redisPermissionList && treesArr[i].redisPermissionList.length!=0){
			var sonArr=treesArr[i].redisPermissionList;
			for(var j=0;j<sonArr.length;j++){
				if(sonArr[j].url!="#"){
					sonArr[j].url=sonArr[j].url+"?userUuid="+userUuid+"&classId="+classId+"&perssionNames="+treesArr[i].description+sonArr[j].description;
				}
				if(sonArr[j].redisPermissionList && sonArr[j].redisPermissionList.length!=0){
					var sonsonArr=sonArr[j].redisPermissionList;
					for(var n=0;n<sonsonArr.length;n++){
						if(sonsonArr[n].url!="#"){
							sonsonArr[n].url=sonsonArr[n].url+"?userUuid="+userUuid+"&classId="+classId+"&perssionNames="+treesArr[i].description+sonArr[j].description+sonsonArr[n].description;
						}
					}
					
				}
			}
		}
		
	}
}
function treeHover(res) {
	var perssionNames=GetQueryString("perssionNames");
	if(perssionNames){
		var trees=res[1];
		var A01;
		$.each(trees,function (index,value) {
			if(perssionNames.indexOf(value.description)>=0){
				A01=index;
			};
		});
		$("#sidebar ul.nav >li").eq(A01+1).addClass("active");

		if(trees[A01].redisPermissionList){
			var B01;
			$.each(trees[A01].redisPermissionList,function (index,value) {
				if(perssionNames.indexOf(value.description)>=0){
					B01=index;
				};
			});
			$("#sidebar ul.nav >li").eq(A01+1).find("li.has-sub").eq(B01).addClass("active");
		};
	};
};

// 设置cookie 过期时间s20代表20秒 h12代表12小时 d30代表30天
function setCookie(name,value,time){
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);
	// document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+"path=/; domain="+domain;
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};
function getsec(str){
	var str1=str.substring(1,str.length)*1;
	var str2=str.substring(0,1);
	if (str2=="s"){
		return str1*1000;                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
	}
	else if (str2=="h")
	{
		return str1*60*60*1000;
	}
	else if (str2=="d")
	{
		return str1*24*60*60*1000;
	}
};
// 获取cookie
function getCookie(name){
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return unescape(arr[2]);
	}
	else{
		return null;
	}
};
// 删除cookie
function delCookie(name){
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null){
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	};
};