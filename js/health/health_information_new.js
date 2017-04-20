$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    getAllClassInfo_port(); //获取全部班级列表

    // 切换班级时成员接口切换
    $("#allClass").change(function () {
        $(".reset01").val("").text("");// 数据初始化
        var orgid=$(this).val();
        getClassMemberInfo_port(orgid);
    });

    // 切换成员时获取学员年龄和生日
    $("#classMember").change(function () {
        $(".reset01").val("").text("");// 数据初始化
        var useruuid=$(this).val();
        getBirthdaySex(useruuid); //获取学员年龄和生日
    });

    // 体检日期输入函数
    $('#createDate').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        calculateAge_port($("#h-birthday").val(),$("#createDate").val());
        if($("#createDate").val()){
            $("#createDate").removeClass("empty");
        };
        $('#createDate').datepicker("hide");
    });

    //输入身高
    $("#h-height").change(function(){
        if($("#createDate").val()){
            if($(this).val()){
                getHeightPvalue();//取得身高P值
            };
            if($(this).val() && $("#h-weight").val()){
                getFatnessValue();//取得肥胖值
            };
        }else{
            $("#createDate").addClass("empty").focus();
        };
        Diagnosis();
    });

    //输入体重
    $("#h-weight").change(function(){
        if($("#createDate").val()){
            if($(this).val()){
                getWeightPvalue();//取得体重
            };
            if($(this).val() && $("#h-height").val()){
                getFatnessValue();//取得肥胖值
            };
        }else{
            $("#createDate").addClass("empty").focus();
        };
        Diagnosis();
    });

    // 正则
    //输入血色素
    $("#h-hemachrome").change(function(){
        if(!isInteger($("#h-hemachrome").val())){
            $("#h-hemachrome").val("");
            alert("身高请输入整数。");
        }
        Diagnosis();
    });
    //输入视力（小数点后一位，俩位数）
    $("#h-visionl,#h-visionr").change(function(){
        var _value = $(this).val(); 
        var reg = /^([0-9]|10|[0-9]\.\d)$/;
        if (!reg.test(_value)) {
            alert('请输入正确的视力值。');
            $(this).val("");
            return false;
        }  
        Diagnosis();
    });



    //取消(返回上一级)
    $("#h-btnBack").click(function(){
        window.location.href="health_information.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&orgId="+$('#allClass').val()+"&perssionNames=保健管理健康信息";
    });

    //保存
    $("#h-btnSubmit,#h-btnSubmitBack").click(function(){
        insertHealthInfo();
    });
    
};



// 根据导入日期计算年龄
function calculateAge_port(birthdayStr,examDateStr) {
    var data={
            birthdayStr:birthdayStr,
            examDateStr:examDateStr
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.calculateAge,param,calculateAge_callback);
};
function calculateAge_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-age").val(data.age);
        $("#createDate").removeClass("empty");
    }else{
        console.log('请求错误，返回code非200');
    }
};



// 获取全部班级列表
function getAllClassInfo_port(pageNumber) {
    var data={
            companyid:user.curCompany.id
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getAllClassInfo,param,getAllClassInfo_callback);
};
function getAllClassInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        var html=template("allClass_script",{data});
        $("#allClass").empty().append(html);

        if(data.length>0){
            var orgid = GetQueryString("orgId");
            $("#allClass >option[value="+orgid+"]").val(orgid);
            getClassMemberInfo_port(orgid);
        }
    
    }else{
        console.log('请求错误，返回code非200');
    }
};

function getClassMemberInfo_port(orgid) {
    var data={
            classId:orgid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassStudentInfo,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("classMember_script",{data});
        $("#classMember").empty().append(html);
        if(data.length>0){
             getBirthdaySex(); //获取学员年龄和生日
        };
    }else{
        // console.log('请求错误，返回code非200');
    }
};




//获取学员生日和性别
function getBirthdaySex(){
    var useruuid = $("#classMember").val();
    var data={
            useruuid:useruuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getBirthdaySex,param,getBirthdaySex_callback);

}
function getBirthdaySex_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-sex").val(data.sex)
        $("#h-birthday").val(data.birthday);
        if($("#createDate").val()){
            calculateAge_port($("#h-birthday").val(),$("#createDate").val());
        };
    }else{
        $("#h-birthday").val("");
        $("#h-age").val("");
        // console.log(res);
    }
};


function getHeightPvalue() {
    var data={
            sex:$("#h-sex").val(),
            ageStr:$("#h-age").val(),
            height:$("#h-height").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getPValue,param,getPValue_callback);
}
function getPValue_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-heightValue").val(data.PValue);
    }else{
        $("#h-heightValue").val("");
        // console.log(res);
    }
};

function getWeightPvalue() {
    var weight = $("#h-weight").val();
    var sex = $("#h-sex").val();
    var age = $("#h-age").val();
    var data={
            sex:sex,
            ageStr:age,
            weight:weight
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getPValue,param,getPValue_callback1);
}
function getPValue_callback1(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-weightValue").val(data.PValue);
    }else{
        $("#h-weightValue").val("");
        // console.log(res);
    }
};
//取得肥胖值
function getFatnessValue(){
    var data={
            sex:$("#h-sex").val(),
            ageStr:$("#h-age").val(),
            height:$("#h-height").val(),
            weight:$("#h-weight").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getFatnessValue,param,getFatnessValue_callback);

}
function getFatnessValue_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#h-fatValue").val(data.fatnessValue);
        $("#h-fat").val(data.fatnessResult);
        Diagnosis();
    }else{
        $("#h-fatValue").val("");
        // console.log(res);
    }
};
//取得诊断小结
function Diagnosis(){
    var a=0;
    for(var i=0;i<$("input.diagnosis").length;i++){
        if(!$("input.diagnosis").eq(i).val()){
            a++;
        };
    };
    if(a==0){
        var html = $("#classMember").find("option:selected").text()+"在"+$("#createDate").val()+"的体检记录中，身高为"+$("#h-height").val()+"cm，体重为"+$("#h-weight").val()+"kg，血色素为"+$("#h-hemachrome").val()+"，视力为"+$("#h-visionl").val()+"(左)/"+$("#h-visionr").val()+"(右)，"+"判定结果为：<span>"+$("#h-fat").val()+"</span>";
        $(".hf-zdxj").empty().append(html);
    }
}



//增加健康信息
function insertHealthInfo(){
    var data={
            loginuuid:user.userUuid,
            useruuid:$("#classMember").val(),
            username:$("#classMember").find("option:selected").text(),
            usersex:$("#h-sex").val(),
            userageStr:$("#h-age").val(),
            height:$("#h-height").val(),
            weight:$("#h-weight").val(),
            hemachrome:$("#h-hemachrome").val(),
            visionl:$("#h-visionl").val(),
            visionr:$("#h-visionr").val(),
            examdateStr:$("#createDate").val(),
            hpvalue:$("#h-heightValue").val(),
            wpvalue:$("#h-weightValue").val(),
            fatnessvalue:$("#h-fatValue").val(),
            fatnessresult:$("#h-fat").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.insertHealthInfo,param,insertHealthInfo_callback);
}
function insertHealthInfo_callback(res) {
    if(res.code==200){
        window.location.href="health_information.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&orgId="+$('#allClass').val()+"&perssionNames=保健管理健康信息";
    }else{
        console.log(res);
    }
};

/*
用途：检查输入对象的值是否符合整数格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function isInteger(str) {
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
}

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