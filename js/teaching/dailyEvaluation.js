$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入

    // 月份选择初始化
    var month=[1,2,3,4,5,6,7,8,9,10,11,12];
    var htmlMonth=template("month_script",{month});
    $("#month01").append(htmlMonth);

    getTeacherList_port();// 获取当前学校所有老师接口

    // 查询条件改变执行函数
    $("#coursesDim,#year01,#month01,#teachers").change(function () {
        studentRecordList_port();
    });

    // 点击具体学生，执行弹出函数
    $("#members").on('click','li >a.membersBg',function () {
        var  childUuid=$(this).attr('data-useruuid');
        $("#email-content").empty();//评价列表初始化
        $("#evaluation").empty();//评价详情初始化
        var data={
                courses:$("#courses option:selected").text(),
                coursesDim:$("#coursesDim option:selected").text(),
                year:$("#year01 option:selected").text(),
                month:$("#month01 option:selected").text(),
                childUuid:childUuid
        };
        var html=template("page-header_script",data);
        $("#page-header").empty().append(html);
        $("#dailyEvaluationDelete").attr("data-childid",childUuid);//删除Btn 埋藏childid
        dailyEvaluationList_port(childUuid);// 获取课程计划列表
    });
     
    // 删除接口
    $("#dailyEvaluationDelete").click(function () {
        if($("#email-content tbody tr i.fa-check-square-o").length !=0){
            var right=confirm("确认删除吗？");
            if(right){
                dailyEvaluationDelete_port();
            };
        }else{
            alert("请先选择删除项。。")
        };
    });

    // 点击完成按钮，先执行验证再执行保存接口
    $("#evaluation").on("click","#finalBtn",function () {
        var id=$(this).attr("data-id");
        var level=$("#level").val();
        var num=$("#level option").length;
        // num==1 解决option为空时能提交
        if(level || num ==1){
            dailyEvaluationUpdate_port(id);
        }else{
            alert("请先选择水平。。");
        };
        
    });

    // 点击水平下拉框自动切换水平描述
    $("#evaluation").on("change","#level",function () {
        if($(this).val()){
            var text=$(this).find("option[value="+$(this).val()+"]").attr("data-desc");
            $("#description").text(text);
        }else{
            $("#description").text("");
        }
    });

     // 是否标记为典型案例
    $("#evaluation").on("click","#switchBtn",function () {
        $(this).toggleClass("off");
    });

    deletePic();// 删除图片函数

    carousel();// 图片放大插件函数

    changeClass();// 切班函数

    exportAll();// 导出

    // niceScroll滚动条
    chooseNiceScroll("#modal-dialog-qunzu .first-content");
    chooseNiceScroll("#modal-dialog-qunzu .second-content");
};

// 删除图片函数
function deletePic() {
    $("#evaluation").on({
        mouseover:function () {
            $(this).find("span.deleteBtn").addClass("current");
        },
        mouseout:function () {
            $(this).find("span.deleteBtn").removeClass("current");
        }
    },"#carousel li");
    $("#evaluation").on("click","#carousel > li span.deleteBtn",function (event) {
        $(this).parents("li").remove();
        event.stopPropagation();
    });
};

// 切班函数
function changeClass() {
    $("#header ul.nav > li:nth-of-type(3) ul.dropdown-menu a").attr("href","#");
    $("#changeClass ul.dropdown-menu").on("click",'li.media a',function () {
       var classId=$(this).attr("data-classid");
       var name=$(this).attr("data-name");
       $("#changeClass >a >i").text(name).attr("data-classid",classId); 
       $("#breadcrumb li:nth-of-type(2)").text(name);
       user.classId=classId;
       studentRecordList_port();
    });
};
// 查询接口函数
function dailyEvaluationList_port(childUuid,pageNumber) {
    var data={
            useruuid:user.userUuid,
            childUuid:childUuid,
            teacherUuid:$("#teachers").val(),
            courseid:$("#courses").val(),
            dimid:$("#coursesDim").val(),
            year:$("#year01").val(),
            month:$("#month01").val(),
            pageSize:12,
            curPageNumber:pageNumber || 1
        };
    var param={
            params:JSON.stringify(data),
            loginid:''
    };
    initAjax(httpUrl.dailyEvaluationList,param,dailyEvaluationList_callback);
};
function dailyEvaluationList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        // console.log(data);
        for(var i=0;i<data.list.length;i++){
            switch (data.list[i].state){
                case '0':
                    data.list[i].STATE="<span class=\"unRead\"></span>";
                    break;
                default:
                    data.list[i].STATE=data.list[i].state;
            }
        }

        var html=template("table-email",data);
        $("#email-content").empty().append(html);

        chooseRow();// Row行选择函数
        editRow();// 编辑行函数   
        // 渲染分页
        $("#pagination").pagination({
            items: data.totalRow,
            itemsOnPage: data.pageSize,
            currentPage: data.pageNumber,
            cssStyle:'',
            // cssStyle: 'pagination-without-border pull-right m-t-0',
            onPageClick: function (pageNumber, event) {
                dailyEvaluationList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);
            }
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除接口函数
function dailyEvaluationDelete_port() {
    var data={
            recordIdList:[]
    };
    var num=$("#email-content tbody tr i.fa-check-square-o");
    for(var i=0;i<num.length;i++){
        data.recordIdList.push(num.eq(i).attr('data-id'));
    }
    var param={
            params:JSON.stringify(data)
    };
    
    initAjax(httpUrl.dailyEvaluationDelete,param,dailyEvaluationDelete_callback);
};
function dailyEvaluationDelete_callback(res) {
    $("#evaluation").empty();//评价详情初始化
    var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
    dailyEvaluationList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);// 获取课程计划列表
    studentRecordList_port();// 学生初始化
};
// Row行选择函数
function chooseRow() {
    $("#email-content tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            $("#evaluation").empty();//评价详情初始化
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o');
            $(this).siblings().find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
            var id=$(this).find('i').attr("data-id");
            dailyEvaluationDetail_port(id); 
        };
    });
}

// 评价行
function editRow() {
    //  编辑接口函数
    $("#dailyEvaluation").click(function () {
        var num=$("#email-content tbody tr i.fa-check-square-o").length;
        if(num>1){
            alert("编辑时为单选，请重新选择。。");
            $("#email-content tbody tr i.fa-check-square-o").removeClass('fa-check-square-o').addClass('fa-square-o');
        }else if(num==0){
            alert("请先选择。。");
        }else{
            var dailyEvaluationId=$("#email-content tbody tr i.fa-check-square-o").attr('data-id');  
            window.location.href="dailyEvaluation_new.html"+"?userUuid="+user.userUuid+"&classId="+user.classId+"&perssionNames=教学管理过程性监测日常监测"+"&dailyEvaluationId="+dailyEvaluationId;
        }
    });   
}

// 获取学校教师信息
function getTeacherList_port() {
    var data={
            companyid:user.curCompany.id
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getTeacherList,param,getTeacherList_callback);
};
function getTeacherList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("teachers_script",{data});
        $("#teachers").append(html).find("option[value="+user.userUuid+"]").prop("selected",true);

        getPersonCourse_port();// 获取个人观察计划列表

    }else{
        // console.log('请求错误，返回code非200');
    }
};
// 获取关联课程接口
function getPersonCourse_port() {
    var data={
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getPersonCourse,param,getPersonCourse_callback);
};
function getPersonCourse_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("courses_script",{data});
        $("#courses").append(html);

        courseDim_port();// 获取观察计划的维度列表
        $("#courses").change(function () {
            var courseid=$(this).val();
            courseDim_port(courseid);
        });


    }else{
        // console.log('请求错误，返回code非200');
    }
};
// 获取关联指标接口
function courseDim_port(courseid) {
    var data={
            useruuid:user.userUuid,
            courseid:courseid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.courseDim,param,courseDim_callback);
};
function courseDim_callback(res) {
    if(res.data){
        var data=JSON.parse(res.data);
    }else{
        var data="";
    };
        
    var html=template("coursesDim_script",{data});
    $("#coursesDim").empty().append(html);

    studentRecordList_port();//获取班级学生观察记录列表
};

// 查询接口函数
function studentRecordList_port(pageNumber) {
    var data={
            useruuid:user.userUuid,
            classid:user.classId,
            teacherUuid:$("#teachers").val(),
            courseid:$("#courses").val(),
            dimid:$("#coursesDim").val(),
            year:$("#year01").val(),
            month:$("#month01").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.studentRecordList,param,studentRecordList_callback);
};
function studentRecordList_callback(res) {
    if(res.code==200){
        if(res.data){
            var data=JSON.parse(res.data);
            for(var i=0;i<data.length;i++){
                data[i].portrait=httpUrl.path_img+data[i].portrait+"&Thumbnail=1";
            };
            var html=template("members_script",{data});
            $("#members").empty().append(html);
        }else{
            $("#members").empty();
        };
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 查询接口函数
function dailyEvaluationDetail_port(id) {
    var data={
            id:id || 107,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dailyEvaluationDetail,param,dailyEvaluationDetail_callback);
};
function dailyEvaluationDetail_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        data.path_img=httpUrl.path_img;
        for(var i=0;i<data.voiceMd5List.length;i++){
            data.voiceMd5List[i]=httpUrl.path_img+data.voiceMd5List[i]+'&Thumbnail=1'
        };
        if(data.measure.detail){
            data.measure.detail=JSON.parse(data.measure.detail);
        };
        
        data.measureResultList=JSON.parse(data.measureResultList);

        var html=template("evaluation_script",data);
        $("#evaluation").empty().append(html);
       
        
        if(data.measure.type==1){
            for(var i=0;i<data.measureResultList.length;i++){
                $("#measureTable tbody >tr").eq(i).children("td").eq(data.measureResultList[i].xvalue).append('<img src="../../img/jxgl-pjgl-rcpj-lbjl-icon.png" width="20" height="20">');
            };
        }else{
            for(var i=0;i<data.measureResultList.length;i++){
                $("#measureTable .typeRadio >ul >li").eq(i).find("input[type=radio]").eq(data.measureResultList[i].xvalue-1).click();
            };
        };
        

        // 已评价的初始化
        if(data.state==1){
            $("#level option[value="+data.recordLevelInfo.levelId+"]").prop("selected", true);
            $("#description").text($("#level option[value="+data.recordLevelInfo.levelId+"]").attr("data-desc"));
            $("#evaluate").val(data.recordLevelInfo.evaluate);
            $("#advice").val(data.recordLevelInfo.advice);

        };

        loadFiles();// 上传图片接口
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 先执行 更新日常观察记录
function dailyEvaluationUpdate_port(id) {
    var picMd5List=[];
    for(var i=0;i<$("#carousel a.pic").length;i++){
        var pic=$("#carousel a.pic").eq(i).attr("data-pic");
        picMd5List.push(pic);
    };
    // console.log(picMd5List);
    
    
    var data={
                id:id,
                comment:$("#comment").val(),
                picMd5List:picMd5List,
                typical:function () {
                    if($("#switchBtn").hasClass("off")){
                        return 0;
                    }else{
                        return 1;
                    }
                }()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dailyEvaluationUpdate,param,dailyEvaluationUpdate_callback,id);
};
function dailyEvaluationUpdate_callback(res,id) {
    dailyEvaluationSaveLevel_port(id);
};


function dailyEvaluationSaveLevel_port(id) {
    var data={
                recordid:id,
                levelId:$("#level").val(),
                evaluate:$("#evaluate").val(),
                advice:$("#advice").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dailyEvaluationSaveLevel,param,dailyEvaluationSaveLevel_callback,id);
};
function dailyEvaluationSaveLevel_callback(res,id) {

    // 刷新一次评价列表
    var pageNumber=Number($("#pagination span.current:not(.prev,.next)").text());   
    dailyEvaluationList_port($("#dailyEvaluationDelete").attr("data-childid"),pageNumber);// 获取课程计划列表

    // 刷新一次评价详情
    dailyEvaluationDetail_port(id);
    $.toast({
        heading: 'Success',
        text: '修改成功',
        showHideTransition: 'slide',
        icon: 'success',
        hideAfter: 1500,
        loaderBg: '#13b5dd',
        position: 'bottom-right'
    });
};

function carousel() {
    $("#evaluation").on("click","#carousel a.pic",function () {
        $("#imgBg").addClass("current");
        var src=$(this).attr("data-src");
        $("#carousel_img").empty().append("<img src="+src+" />");
    });
    $("#modal-dialog-img").click(function () {
        $("#imgBg").removeClass("current"); 
    });
    // 关闭拟态弹出框
    $("body").keydown(function (e) {
         if(e.which === 27){
            $("#imgBg").removeClass("current");
         };
    });
}
function loadFiles() {
        Dropzone.options.myAwesomeDropzone=false;
        Dropzone.autoDiscover=false;
        var myDropzone=new Dropzone('#addPicBtn',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone.on('success',function(file,responseText){
            if(responseText.uploadFileMd5==undefined){
                alert('没有上传成功,请重试');
                return ;
            };
            var imgUrl=httpUrl.path_img+responseText.uploadFileMd5;
            var html="<li>"+
                        "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" data-src="+imgUrl+" class=\"pic\" data-pic="+responseText.uploadFileMd5+">"+
                            "<img src="+imgUrl+"&Thumbnail=1>"+
                            "<span class=\"deleteBtn\"></span>"+
                        "</a>"+
                    "</li>";
            $("#addPicBtn").parent("li").before(html).find("div").remove();
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });
}
// niceScroll滚动条
function chooseNiceScroll(AA) {
    $(AA).niceScroll({ 
        cursorcolor: "#ccc",//#CC0071 光标颜色 
        cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0 
        touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备 
        cursorwidth: "6px", //像素光标的宽度 
        cursorborder: "0", //     游标边框css定义 
        cursorborderradius: "5px",//以像素为光标边界半径 
        autohidemode: false //是否隐藏滚动条 
    });
};

// 导出
function exportAll() {
    // 单选
    $("#members").on("click",".membersTitle",function () {
        $(this).find("span").toggleClass("checked");
    });
    // 全选
    $("#checkedAll").click(function () {
        var n=0;
        for(var i=0;i<$(".membersTitle >span").length;i++){
            if(!$(".membersTitle >span").eq(i).hasClass("checked")){
                n++;
            }
        };
        if(n > 0){
            $(".membersTitle >span").addClass("checked"); 
        }else{
            $(".membersTitle >span").removeClass("checked"); 
        };
    });   
    // 导出
    $("#export").click(function () {
        if(!$("#year01").val()){
            $.toast({
                heading: 'Success',
                text: '请先选择导出年份',
                showHideTransition: 'slide',
                icon: 'success',
                hideAfter: 1500,
                loaderBg: '#13b5dd',
                position: 'bottom-right'
            }); 
        }
        if(!$("#month01").val()){
            $.toast({
                heading: 'Success',
                text: '请先选择导出月份',
                showHideTransition: 'slide',
                icon: 'success',
                hideAfter: 1500,
                loaderBg: '#13b5dd',
                position: 'bottom-right'
            }); 
        }
        if($("#year01").val() && $("#month01").val()){
            if($(".membersTitle >span.checked").length >0){
                var arr=[];
                for(var i=0;i<$(".membersTitle >span.checked").length;i++){
                    arr.push($(".membersTitle >span.checked").eq(i).attr("data-useruuid"))
                };
                window.open(httpUrl.recordToWord+"?studentUuidList="+arr.join()+"&year="+$("#year01").val()+"&month="+$("#month01").val())
            }else{
                $.toast({
                    heading: 'Success',
                    text: '请先选择导出的学生',
                    showHideTransition: 'slide',
                    icon: 'success',
                    hideAfter: 1500,
                    loaderBg: '#13b5dd',
                    position: 'bottom-right'
                }); 
            }
        }  
    });
}