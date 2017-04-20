$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    getCompanyHealthAlert(); //获得预警信息
}

// 获得预警信息
function getCompanyHealthAlert() {
    var data={
            loginuuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getCompanyHealthAlert,param,getCompanyHealthAlert_callback);
};
function getCompanyHealthAlert_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].creationtime = new Date(data[i].creationtime).Format("yyyy-MM-dd");  //录入日期
        }
        var html=template("class-healthi-info_script",{data});
        $("#class-healthi-info").empty().append(html);
        
    }else{
        $("#class-healthi-info").empty().append('<h2>没有风险预警信息</h2>');
    }
};

//增加健康预警按钮
$("#risk_alarm_new").click(function(){
    getAlertType();// 获得预警类型
    $(".ristalarm-submit").show();
});
// 获得预警类型
function getAlertType() {
    var data={
            loginuuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getAlertType,param,getAlertType_callback);
    function getAlertType_callback(res) {
        if(res.code==200){
            var data=JSON.parse(res.data);
            var html=template("getAlertType_script",{data});
            $("#getAlertType").empty().append(html);

            if(data.length>0){
                var alerttype=$("#getAlertType").val();
                getAlertAge(alerttype);
            }
            // 切换预警类型时年龄接口切换
            $("#getAlertType").change(function () {
                var alerttype=$(this).val();
                getAlertAge(alerttype);
            });
        }else{
            console.log(res);
        }
    };
};
// 获得预警年龄
function getAlertAge(alerttype) {
    var data={
            loginuuid:user.userUuid,
            alerttype:alerttype
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getAlertAge,param,getAlertAge_callback);
    function getAlertAge_callback(res) {
        if(res.code==200){
            var data=JSON.parse(res.data);
            var html=template("getAlertAge_script",{data});
            $("#getAlertAge").empty().append(html);
            
        }else{
            console.log(res);
        }
    };
};
//增加健康预警 提交
$('.ristalarm-submit #h-btnSubmit').click(function(){
    var data={
            loginuuid:user.userUuid,
            alerttypename:$("#getAlertType").find("option:selected").text(),
            alertType:$("#getAlertType").val(),
            alertAge:$("#getAlertAge").val(),
            alertValue:$("#alertValue").val(),
            remark:$("#remark").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.insertHealthAlert,param,insertHealthAlert_callback);
})
function insertHealthAlert_callback(res) {
    if(res.code==200){
        getCompanyHealthAlert(); //获得预警信息
        $(".ristalarm-submit").hide();
        $(".ristalarm-wrap input,.ristalarm-wrap textarea").val("");//清空
    }else{
        console.log(res);
    }
};

//编辑健康预警按钮
$("#risk_alarm_edit").click(function(){
    if($(".health-info tbody tr").hasClass("active")){
        var alertuuid = $(".health-info tbody tr.active").attr('data-alertuuid');
    
        var data={
                loginuuid:user.userUuid,
                alertuuid:alertuuid
            };
        var param={
                params:JSON.stringify(data)
        };
        initAjax(httpUrl.getHealthAlert,param,getHealthAlert_callback);
    }else{
        alert("请选择预警类型");
    }
});
function getHealthAlert_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        $("#getAlertType1").val(data.alerttypename);
        $("#getAlertType1").parent(".input").attr("data-alerttype",data.alerttype);
        $("#getAlertAge1").val(data.alertage);
        $("#alertValue1").val(data.alertvalue);
        $("#remark1").val(data.remark);
        $(".ristalarm-edit").show();
    }else{
        console.log(res);
    }
};
//编辑健康预警 提交
$('.ristalarm-edit #h-btnEdit').click(function(){
    var data={
            loginuuid:user.userUuid,
            alertuuid:$(".health-info tbody tr.active").attr('data-alertuuid'),
            alerttypename:$("#getAlertType1").val(),
            alertType:$("#getAlertType1").parent(".input").attr("data-alerttype"),
            alertAge:$("#getAlertAge1").val(),
            alertValue:$("#alertValue1").val(),
            remark:$("#remark1").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.updateHealthAlert,param,updateHealthAlert_callback);
})
function updateHealthAlert_callback(res) {
    if(res.code==200){
        getCompanyHealthAlert(); //获得预警信息
        $(".ristalarm-edit").hide();
        $(".ristalarm-wrap input,.ristalarm-wrap textarea").val("");//清空
    }else{
        console.log(res);
    }
};

//删除健康预警按钮
$("#risk_alarm_delete").click(function(){
    if($(".health-info tbody tr").hasClass("active")){
        var alertuuid = $(".health-info tbody tr.active").attr('data-alertuuid');
        var data={
                loginuuid:user.userUuid,
                alertuuid:alertuuid
            };
        var param={
                params:JSON.stringify(data)
        };
        initAjax(httpUrl.deleteHealthAlert,param,deleteHealthAlert_callback);
    }else{
        alert("请选择预警类型");
    }
});
function deleteHealthAlert_callback(res) {
        console.log(res);
    if(res.code==200){
        getCompanyHealthAlert(); //获得预警信息
    }else{
        console.log(res);
    }
};

//关闭弹出
$('.h-btnclose').click(function(){
    $(".ristalarm-wrap").hide();
    $(".ristalarm-wrap input,.ristalarm-wrap textarea").val("");//清空
})
$(".ristalarm-wrap").click(function(){
    $(this).hide();
    $(".ristalarm-wrap input,.ristalarm-wrap textarea").val("");//清空
})
$(".ristalarm-panel").click(function(e){
    e.stopPropagation();
})
//选中一条
$(".health-info tbody").on("click","tr",function(){
    if($(this).hasClass("active")){
        $(this).removeClass("active");
    }else{
        $(".health-info tbody tr").removeClass("active");
        $(this).addClass("active");
    }
});