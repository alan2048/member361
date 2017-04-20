$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入

    GetSchoolIds_port();// 获取园区ID
    getUserClassInfo_port(); // 获取用户班级信息接口

    // 选项卡切换
    $("#tabs >ul >li").click(function () {
        $(this).addClass("current").siblings().removeClass("current"); 
        $("#row >.tabs:eq("+$(this).index()+")").addClass("current").siblings().removeClass("current");

        switch($(this).index()){
            case 0:
                if($("#email-content").children().length ==0){
                    getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#createDate").val()))/1000);
                };
                break;
            case 1:
                if($("#email-content01").children().length ==0){
                    getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#createDate01").val()))/1000);
                };
                break;
            case 2:
                if($("#email-content02").children().length ==0){
                    getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
                };
                break;
            default:
                if($("#email-content").children().length ==0){
                    getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#createDate").val()))/1000);
                };
        };
    });

    // 01 活动统计时间切换
    $('#createDate').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#createDate').datepicker("hide");
        getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#createDate").val()))/1000);
    });

    $("#school").change(function () {
        getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#createDate").val()))/1000);
    });

    // 活动统计详情
    $("#email-content").on("click",".detailBtn",function () {
        // console.log($(this).attr("data-id"));
        getCourseStudentDetailTJ_port($(this).attr("data-id"),Date.parse(new Date($("#createDate").val()))/1000);
    });

    // 02 班级统计时间切换
    $('#createDate01').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        $('#createDate01').datepicker("hide");
        getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#createDate01").val()))/1000);
    });

    $("#userClass").change(function () {
        getCourseClassTJ_port($("#userClass").val(),Date.parse(new Date($("#createDate01").val()))/1000);
    });

    // 03 学生统计
    $("#userClass01,#student").change(function () {
        getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
    });
};

// 获取园区ID
function GetSchoolIds_port() {
    var data={
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetSchoolJYIds,param,GetSchoolIds_callback);
};
function GetSchoolIds_callback(res) {
    if(res.code==200){
        if(res.data =="[]"){
            $("#modal03").modal("show");
        }else{
            var data=JSON.parse(res.data);
            var data01={data:data};
            var html=template("school_script",data01);
            $("#school").empty().append(html);
            $("#createDate").val(new Date().Format("yyyy-MM-dd"));
            getCourseSimpleTJ_port($("#school").val(),Date.parse(new Date($("#createDate").val()))/1000);
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 01 自选活动 活动统计
function getCourseSimpleTJ_port(schoolId,time) {
    var data={
            schoolId:schoolId,
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseSimpleTJ,param,getCourseSimpleTJ_callback);
};
function getCourseSimpleTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].image=httpUrl.path_img+data[i].pic+"&Thumbnail=1";
        };
        var data01={data:data};
        var html=template("table-email_script",data01);
        $("#email-content").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 自选活动 活动统计详情
function getCourseStudentDetailTJ_port(courseId,time) {
    var data={
            courseId:courseId,
            useruuid:user.userUuid,
            time:(time-28800).toString()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseStudentDetailTJ,param,getCourseStudentDetailTJ_callback);
};
function getCourseStudentDetailTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email03_script",data01);
        $("#email-content03").empty().append(html);
        $("#myModal").modal("show")
    }else{
        // console.log('请求错误，返回code非200');
    }
};




// 获取用户班级信息接口
function getUserClassInfo_port(pageNumber) {
    var data={
            username:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getUserClassInfo,param,getUserClassInfo_callback);
};
function getUserClassInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userClass_script",{data});
        $("#userClass,#userClass01").empty().append(html);
        $("#createDate01").val(new Date().Format("yyyy-MM-dd"));
        if($("#student").children().length ==0){
            getClassStudentInfo_port($("#userClass01").val())
        };
        // 切换班级时成员接口切换
        $("#userClass01").change(function () {
            getClassStudentInfo_port($(this).val());
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function getClassStudentInfo_port(classId) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassStudentInfo,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("student_script",{data});
        $("#student").empty().append(html);

        getCourseStudentTJ_port($("#userClass01").val(),$("#student").val());
    }else{
        // console.log('请求错误，返回code非200');
    }
};



// 02 自选活动 班级统计
function getCourseClassTJ_port(classId,time) {
    var data={
            classId:classId,
            useruuid:user.userUuid,
            time:(time-28800).toString(),
            type:"2"
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseClassTJ,param,getCourseClassTJ_callback);
};
function getCourseClassTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email01_script",data01);
        $("#email-content01").empty().append(html);
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 03 自选活动 学生统计
function getCourseStudentTJ_port(classId,userUuid) {
    var data={
            classId:classId,
            useruuid:userUuid,
            type:"2"
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCourseStudentTJ,param,getCourseStudentTJ_callback);
};
function getCourseStudentTJ_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={data:data};
        var html=template("table-email02_script",data01);
        $("#email-content02").empty().append(html);
    }else{
        // console.log('请求错误，返回code非200');
    }
};


(function($){
    $.fn.datepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
    };
}(jQuery));