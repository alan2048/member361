var user={
		userUuid:GetQueryString("userUuid"),
		userName:GetQueryString("userName"),
		userPhoto:GetQueryString("userPhoto"),
		bookId:GetQueryString("bookId"),
		classId:GetQueryString("classId"),
		month:GetQueryString("month"),
		year:GetQueryString("year")
};

var serverUrl01="http://www.member361.com";//84正式服务器
var serverUrl02="http://121.43.150.38";//38测试服务器

var path=serverUrl01; //更改服务器地址可设置此值

if(window.location.protocol=="file:"){
	setCookie("loginId",GetQueryString("loginId"),"d30");// 打开本地文件时，默认设置本地cookie
};
var httpUrl={
		loginId:getCookie("loginId"),// cookie
		// 基础接口
		login:path+"/jfinal_mbjy_basic/login",// 首页登入
		back:path+"/jfinal_mbjy_basic/back",//首页登入回调
		loginHttp:path, // 登入地址
		logoutHttp:path+"/jfinal_mbjy_basic/logout", // 注销地址
		path_img:path+"/jfinal_mbjy_basic/file/showImg?fileMd5=", // 图片地址
		picUrl:path+"/jfinal_mbjy_basic/file/upload", // 图片上传地址

		// 成长档案
		recordPageType:path+":15001/mbtrack/page/type",// 获取模板类型列表
		recordPageList:path+":15001/mbtrack/page/list",// 获取模板页列表
		recordPageDetail:path+":15001/mbtrack/page/detail", // 获取模板页详情
		recordStudent:path+":15001/mbtrack/dan/student",// 获取学生列表（含档案信息）
		recordNewDanbook:path+":15001/mbtrack/danbook/save",// 新建档案册

		recordDanList:path+":15001/mbtrack/dan/list", // 获取成长档案页列表
		recordDanDelete:path+":15001/mbtrack/dan/delete", // 删除档案页
		recordDanDetail:path+":15001/mbtrack/dab/detail", // 获取档案页详情
		recordDanbookList:path+":15001/mbtrack/danbook/list", // 获取档案册列表
		recordUploadList:path+":15001/mbtrack/upload/list", // 获取上传的文件列表
		recordUploadSave:path+":15001/mbtrack/upload/save", // 添加上传文件成功之后的保持图片
		recordDanCopy:path+":15001/mbtrack/dan/copy", // 档案复制
		recordAdjustPosition:path+":15001/mbtrack/dan/adjustPosition", // 档案顺序
		recordDanMessage:path+":15001/mbtheme/dan/message", // 获取对应幼儿帖子列表

		recordLabelList:path+":15001/mbtheme/label/list", // 获取学校所有标签
		recordPiclib:path+":15001/mbtheme/dan/piclib", // 获取图片库(成长档案)

		recordSaveOrUpdate:path+":15001/mbtrack/dan/saveOrUpdate", // 新增或者编辑档案页(成长档案)

		// 成长主题系统档案
		themeMessage:path+":15001/mbtheme/dan/message",// 获取对应幼儿帖子列表
		themePic:path+":15001/mbtheme/dan/piclib",// 获取图片库(成长档案)
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
                console.log("请求失败 error!");
                // window.location.href=httpUrl.loginHttp;
            }
        });	
};

// 地址栏search参数筛选函数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var result = window.location.search.substr(1).match(reg);
     return result?decodeURIComponent(result[2]):null;
}

// 设置cookie 过期时间s20代表20秒 h12代表12小时 d30代表30天
function setCookie(name,value,time){
	var strsec = getsec(time);
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);
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


document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
};