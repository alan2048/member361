$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    onValid(); //input开启验证函数
    courseDetail_port();// 获取课程详情接口函数
    // 点击完成按钮，先执行验证再执行保存接口
    $("#finalBtn").click(function () {
        isValid();
        var aa=$(".textbox-invalid").length;
        if(aa==0){
            var num=$(".aboutTeacher i.fa-check-square-o").length;
            if(num==0){
                alert('关联老师至少选择一位。。')
            }else{
                courseSave_port();
            };
        }else{
            alert('请先将红色区域的必填项补充完成。。')
        }
    });

};
// 维度能力接口函数
function getTeacherList_port(teacherList) {
    var data={
            companyid:user.curCompany.id
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getTeacherList,param,getTeacherList_callback,teacherList);
};
function getTeacherList_callback(res,teacherList) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        var num;
        $.each(data,function (index,value) {
            if(value.id==user.id){
                num=index;
            }
        });
        data.splice(num,1);//删除当前用户(教师）的数据，使得界面不显示，为之后默认选择上做准备
        
        var vm=new Vue({
                el:'#aboutTeacher',
                data:{
                    lists:data
                },
                methods:{
                    iclick:function (e) {
                        var aa=$(e.target).hasClass('fa-check-square-o');
                        if(aa){
                            $(e.target).removeClass('fa-check-square-o').addClass('fa-square-o');
                        }else{
                            $(e.target).removeClass('fa-square-o').addClass('fa-check-square-o');
                        }
                    },
                    spanclick:function (e) {
                        var aa=$(e.target).prev('i').hasClass('fa-check-square-o');
                        if(aa){
                            $(e.target).prev('i').removeClass('fa-check-square-o').addClass('fa-square-o');
                        }else{
                            $(e.target).prev('i').removeClass('fa-square-o').addClass('fa-check-square-o');
                        }
                    }
                }
        });
        if(teacherList.length>0){
            for(var i=0;i<teacherList.length;i++){
                $.each($("#aboutTeacher i"),function (index,value) {
                   if($(value).attr("data-useruuid")==teacherList[i]){
                        $("#aboutTeacher i").eq(index).removeClass("fa-square-o").addClass("fa-check-square-o");    
                   }
                });
            }
        }

    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 维度能力接口函数
function watchDimensions_port(dimList) {
    var data={
            companyid:user.curCompany.id
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.watchDimensions,param,watchDimensions_callback,dimList);
};
function watchDimensions_callback(res,dimList) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var newdata=res.data.replace(/name/g,'topic').replace(/childDimList/g,'children');
        
        var mind={
                "meta":{
                    "name":"jsMind remote",
                    "author":"hizzgdev@163.com",
                    "version":"0.2"
                },
                "format":"node_tree",
                "data":{"id":"root","topic":"维度能力","children":JSON.parse(newdata)}
        }
        var options={
                container:'jsmind_container',
                editable:false,
                theme:'primary',
                view:{
                    hmargin:0
                },
                layout:{
                    hspace:45,
                    vspace:10,
                    pspace:15
                }

        }
        jsMind.show(options,mind);

        $("#jsmind_container jmnode").click(function () {
            var jm=jsMind.current;
            var curId=jm.get_selected_node().id;
            var parent=jm.get_selected_node().parent;
            var parent2;
            if(parent.parent){
                parent2=parent.parent;
            };
            var children=jm.get_selected_node().children;
            var isChild=function () {
                    var num=0;
                    for(var i=0;i<children.length;i++){
                        var aa=$("#jsmind_container jmnode[nodeid="+children[i].id+"]").hasClass("activeselected");
                        if(aa){
                            num++;
                        }
                    }
                    if(num==0){
                        return false;
                    }else{
                        return true;
                    }
            }

            if($(this).hasClass("activeselected")){
                $(this).removeClass("activeselected");
            }else{
                $(this).addClass("activeselected");
                $("#jsmind_container jmnode[nodeid="+parent.id+"]").removeClass("activeselected");
                if(parent.parent){
                    $("#jsmind_container jmnode[nodeid="+parent2.id+"]").removeClass("activeselected");
                };
                if(isChild()){
                    $(this).removeClass("activeselected");
                }
            }
        });

        if(dimList.length>0){
            for(var i=0;i<dimList.length;i++){
                $("#jsmind_container jmnode").each(function (index,value) {
                   if($(value).attr("nodeid")==dimList[i]){
                        $(value).addClass("activeselected"); 
                   }
                });
            }
        }

    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 查询接口函数
function courseSave_port(pageNumber) {
    var teacherList=[user.userUuid];
    var teachers=$(".aboutTeacher i.fa-check-square-o");
    for(var i=0;i<teachers.length;i++){
        teacherList.push(teachers.eq(i).attr("data-useruuid"));
    };
    var dimList=[];
    var dims=$("#jsmind_container jmnode.activeselected");
    for(var i=0;i<dims.length;i++){
        dimList.push(dims.eq(i).attr("nodeid"));
    };

    var data={
                course:{
                    id:GetQueryString("courseId"),
                    name:$("#planName").val(),
                    target:$("#planTarget").val(),
                    diffpoint:$("#planDiffpoint").val(),
                    begintime:$("#planBegintime").val(),
                    endtime:$("#planEndtime").val(),
                    keypoint:$("#planKeypoint").val(),
                    prepare:$("#planPrepare").val(),
                    companyid:user.curCompany.id
                },
                teacherList:teacherList,
                dimList:dimList
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.courseUpdate,param,courseSave_callback);
};
function courseSave_callback(res) {
    // console.log(res);
    window.location.href="coursePlanning.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&perssionNames=教学管理预设计划课程计划";
};

function isValid() {
    if(!$("#planName").val()){
        $("#planName").addClass('textbox-invalid');
    };
    if(!$("#planTarget").val()){
        $("#planTarget").addClass('textbox-invalid');
    };
    if(!$("#planDiffpoint").val()){
        $("#planDiffpoint").addClass('textbox-invalid');
    };
    if(!$("#planBegintime").val()){
        $("#planBegintime").addClass('textbox-invalid');
    };
    if(!$("#planEndtime").val()){
        $("#planEndtime").addClass('textbox-invalid');
    };
    if(!$("#planKeypoint").val()){
        $("#planKeypoint").addClass('textbox-invalid');
    };
    if(!$("#planPrepare").val()){
        $("#planPrepare").addClass('textbox-invalid');
    };
};
// 开启验证
function onValid() {
    $("#planName,#planTarget,#planDiffpoint,#planBegintime,#planEndtime,#planKeypoint,#planPrepare").focusout(function () {
        if(!$(this).val()){
            $(this).addClass("textbox-invalid");
        }else{
            $(this).removeClass("textbox-invalid");
        }
    });
};
function courseDetail_port() {
    var courseId=GetQueryString("courseId");
    // console.log(courseId);
    var data={
            courseId:courseId
        };
    var param={
            params:JSON.stringify(data),
    };
    initAjax(httpUrl.courseDetail,param,courseDetail_callback);
}
function courseDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);


        data.course.begintime01=new Date(data.course.begintime).Format("yyyy-MM-dd");
        data.course.endtime01=new Date(data.course.endtime).Format("yyyy-MM-dd");
       
        $("#planName").val(data.course.name);
        $("#planTarget").val(data.course.target);
        $("#planDiffpoint").val(data.course.diffpoint);
        $("#planKeypoint").val(data.course.keypoint);
        $("#planPrepare").val(data.course.prepare);
        $("#planBegintime").val(data.course.begintime01);
        $("#planEndtime").val(data.course.endtime01);

        watchDimensions_port(data.dimList); // 观察维度接口
        getTeacherList_port(data.teacherList); // 获取学校教师信息接口

    }
}



