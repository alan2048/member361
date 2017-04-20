$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    getAllClassInfo_port(); //获取全部班级列表

    // 班级切换
    $("#allClass").change(function () {
        getExamDateListByClass_port($(this).val());
        healthInfoAddBtn();// 新增按钮
    });

    // 体检日期切换
    $("#time").change(function () {
        getClassHealthInfo($("#allClass").val(),$("#time").val());
    });

    //编辑按钮
    $("#health_information_edit").click(function(){
        if($(".health-info tbody tr").hasClass("active")){
            var hiuuid = $(".health-info tbody tr.active").attr('data-hiuuid');
            window.location.href="health_information_edit.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&orgId="+$('#allClass').val()+"&orgIdName="+$('#allClass').find("option:selected").text()+"&hiuuid="+hiuuid+"&perssionNames=保健管理健康信息";
        }else{
            alert("请选择一个学生");
        }
    });

    //删除按钮
    $("#health_information_delete").click(function(){
        if($(".health-info tbody tr").hasClass("active")){
            var hiuuid = $(".health-info tbody tr.active").attr('data-hiuuid');
            deleteHealthInfo_port(hiuuid);
        }else{
            alert("请选择一个学生");
        }
    });

    // 批量导入
    $("#importHealth").click(function () {
        var data={
                loginUUID:user.userUuid,
                classID:$("#allClass").val()
            };
        $("#filesUpload input[name=params]").val(JSON.stringify(data));
        $("#filesUpload input[type=file]").click();
    });
    $("#filesUpload input[type=file]").change(function () {
        ajaxSubmitForm();
    });

    //选中一条
    $(".health-info tbody").on("click","tr",function(){
        if($(this).hasClass("active")){
            $(this).removeClass("active");
        }else{
            $(".health-info tbody tr").removeClass("active");
            $(this).addClass("active");
        }
    });

    //查看预警信息
    $("#class-healthi-info").on("mousemove","td.warning",function(){
        $(".chi-alert ul",this).show();
    });
    $("#class-healthi-info").on("mouseleave","td.warning",function(){
        $(".chi-alert ul",this).hide();
    });
};

// 获取全部班级列表
function getAllClassInfo_port() {
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
        $("#allClass").append(html);

        if(data.length>0){
            if(GetQueryString("orgId")){
                $("#allClass option[value="+GetQueryString("orgId")+"]").attr("selected",true);
            }
        };

        healthInfoAddBtn();// 新增按钮
        getExamDateListByClass_port($("#allClass").val());
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 根据班级获得检查日期列表
function getExamDateListByClass_port(classid) {
    var data={
            classid:classid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getExamDateListByClass,param,getExamDateListByClass_callback);
};
function getExamDateListByClass_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i]=new Date(data[i]).Format("yyyy-MM-dd");
        };
        var data01={data:data};
        var html=template("time_script",data01);
        $("#time").empty().append(html);
        getClassHealthInfo($("#allClass").val(),$("#time").val());
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 获得班级健康信息
function getClassHealthInfo(firstOrgid,time) {
    var data={
            loginuuid:user.userUuid,
            classid:firstOrgid,
            examdateStr:time
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassHealthInfo,param,getClassHealthInfo_callback);
};
function getClassHealthInfo_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].creationtime = new Date(data[i].creationtime).Format("yyyy-MM-dd");  //录入日期
            if(data[i].visionr){
                data[i].visionr=data[i].visionr.toFixed(1);
            }
            if(data[i].visionl){
                data[i].visionl=data[i].visionl.toFixed(1);
            }
            if(data[i].usersex==0){
                data[i].usersex="";
            }else if(data[i].usersex==1){
                data[i].usersex="男";
            }else{
                data[i].usersex="女";
            }
        }
        var html=template("class-healthi-info_script",{data});
        $("#class-healthi-info").empty().append(html);
        
    }else{
        $("#class-healthi-info").empty().append('<h2>没有添加学生健康信息</h2>');
    }
};

// 新增按钮
function healthInfoAddBtn() {
    var userUuid=user.userUuid;
    var classId=user.classId;
    var urlSearch="health_information_new.html"+"?userUuid="+userUuid+"&classId="+classId+"&orgId="+$('#allClass').val()+"&perssionNames=保健管理健康信息";
    $("#health_information_new").attr('href',urlSearch);
};

// 删除接口
function deleteHealthInfo_port(hiuuid) {
    var data={
            loginuuid:user.userUuid,
            hiuuid:hiuuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteHealthInfo,param,deleteHealthInfo_callback);
};
function deleteHealthInfo_callback(res) {
    if(res.code==200){
        // console.log(res);
        var firstOrgid = $("#allClass").val();
        getClassHealthInfo($("#allClass").val(),$("#time").val());
    }else{
        console.log(res);
    }
};


function ajaxSubmitForm() {
    var option = {
            url : httpUrl.importHealthInfo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                getClassHealthInfo($("#allClass").val(),$("#time").val());

                toastTip("提示",data.info);
            },
            error: function(data) {
                console.log(data);   
            }
    };
    $("#filesUpload").ajaxSubmit(option);
    return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
};
// 消息提示函数
function toastTip(heading,text,hideAfter) {
    $.toast({
            heading: heading,
            text: text,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: hideAfter || 1500,
            loaderBg: '#13b5dd',
            position: 'bottom-right'
    });
}