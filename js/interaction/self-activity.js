$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    mousehover();
    GetSchoolIds_port();
    deletePic();
    loadFiles();
};
function mousehover() {
    // 年度档案册hover效果
    $("#activityList").on({
        mouseover:function () {
          $(this).addClass("current");
        },
        mouseout:function () {
          $(this).removeClass("current");
        }
    }," >li >div.yearBg");

    // 查询条件改变执行函数
    $("#school").change(function () {
        GetSchoolCourses_port($(this).val());
        $("form.form-horizontal input[name=schoolId]").val($(this).val());
    });

    // 新建活动
    $("#activity_new").click(function () {
        $(".content").addClass("hide01");
        $("#content01").removeClass("hide01");
        $("#content01 > h1 > span").text("自选活动");
        $("#content01 > h1 > small").text("新建");
        $("form.form-horizontal input,form.form-horizontal textarea").val("");
        $("form.form-horizontal input[name=schoolId]").val($("#school").val());
        $("form.form-horizontal input[name=isStop]").val(0);
        $("#addPicBtn01,#addPicBtn02").siblings().remove();
        $("#addPicBtn").css({"background":""});
        $("#switchBtn").removeClass("close").text("启用").next("input[name=isStop]").val();
    });

    // 编辑活动
    $("#activityList").on("click","span.editBtn",function () {
        GetCourseDetails_port($(this).attr("data-id"),$(this).attr("data-name"));
    });

    // 活动 签到学生列表
    $("#activityList").on("click","span.signInBtn",function () {
        $(".content").addClass("hide01");
        $("#backBtn").removeClass("hide01");
        $("#content02").removeClass("hide01");
        $("#content02 > h1 > span").text($(this).attr("data-name"));
        $("#content02 > h1 > small").text("签到");
        tsGetBookedChildren_port($(this).attr("data-id"),$(this).attr("data-time"));
    });

    // 签到
    $("#members").on("click","a.membersBg",function () {
        if($(this).children("span").hasClass("active")){
            tsCancelRoll_port($(this).attr("data-courseId"),$(this).attr("data-time"),$(this).attr("data-useruuid"));
        }else{
            tsCallRoll_port($(this).attr("data-courseId"),$(this).attr("data-time"),$(this).attr("data-useruuid"));
        }
    });

    // 删除活动
    $("#activityList").on("click","span.deleteBtn",function () {
        $("#myModal").modal("show");
    });
    $("#finalBtn").click(function () {
        tsDelCourse_port($(this).attr("data-id"));
    });

    // 返回上一层级按钮执行函数
    $("#backBtn").on({
        click:function () {
          $(".content").addClass("hide01")
          $("#content").removeClass("hide01");
          $("#backBtn").addClass("hide01");
        },
        mouseover:function () {
          $(this).children("span").addClass("current");
        },
        mouseout:function () {
          $(this).children("span").removeClass("current");
        }
    });

    $("#submit").click(function () {
        if(!$(".form-horizontal input.fill").val()){
            $(".form-horizontal input.fill").attr("placeholder","此为必填项。。").addClass("empty");
        };

        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        if(!$(".form-horizontal input.fillnum").val() || !$(".form-horizontal input.fillnum").val().match(reg)){
            $(".form-horizontal input.fillnum").attr("placeholder","容纳人数需为数字。。").addClass("empty");
        };

        if($(".faceimage.fill").css("background-image").indexOf("addBtn.png") >0){
            $(".faceimage.fill").addClass("empty");
        };

        if($(".form-horizontal input.fill.empty").length==0 && $(".faceimage.fill.empty").length==0 && $(".form-horizontal input.fillnum.empty").length==0){
            var data={};
            var arr=$("form.form-horizontal").serializeArray();
            for(var i=0;i<arr.length;i++){
                data[arr[i].name]=arr[i].value
            };
            AddCourse_port(data);
        };
    });

    // 新增活动 取消按钮
    $("#quit").click(function () {
        $(".content").addClass("hide01")
        $("#content").removeClass("hide01");
    });


    // 是否停用此活动
    $("#switchBtn").click(function () {
        $(this).toggleClass("close");
        if($(this).hasClass("close")){
            $(this).text("停用");
            $(this).next("input[name=isStop]").val(1);
        }else{
            $(this).text("启用");
            $(this).next("input[name=isStop]").val(0);
        }
    });

    $(".form-horizontal").on("keyup","input.fill.empty",function () {
        if($(this).val()){
            $(this).removeClass("empty");
        }; 
    });
    $(".form-horizontal").on("keyup","input.fillnum",function () {
        var reg = new RegExp("^[0-9]*[1-9][0-9]*$");
        if($(this).val().match(reg)){
            $(this).removeClass("empty");
        }else{
            $(this).addClass("empty");
        }; 
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
    initAjax(httpUrl.GetSchoolIds,param,GetSchoolIds_callback);
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

            GetSchoolCourses_port($("#school").val());
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 删除课程
function tsDelCourse_port(id) {
    var data={
            courseId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.tsDelCourse,param,tsDelCourse_callback);
};
function tsDelCourse_callback(res) {
    if(res.code==200){
        $("#myModal").modal("hide");
        GetSchoolCourses_port($("#school").val());
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 签到学生列表
function tsGetBookedChildren_port(id,time) {
    var data={
            courseId:id,
            time:time,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.tsGetBookedChildren,param,tsGetBookedChildren_callback,data);
};
function tsGetBookedChildren_callback(res,json) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={
                data:data,
                courseId:json.courseId,
                time:json.time,
                path:httpUrl.path_img
        };
    
        var html=template("members_script",data01);
        $("#members").empty().append(html);
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};

// 签到
function tsCallRoll_port(id,time,userUuid) {
    var data={
            courseId:id,
            time:time,
            useruuid:userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.tsCallRoll,param,tsCallRoll_callback,data);
};
function tsCallRoll_callback(res,json) {
    if(res.code==200){
        tsGetBookedChildren_port(json.courseId,json.time);
    }else{
        console.log("错误");
    }
};

// 签到 取消
function tsCancelRoll_port(id,time,userUuid) {
    var data={
            courseId:id,
            time:time,
            useruuid:userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.tsCancelRoll,param,tsCancelRoll_callback,data);
};
function tsCancelRoll_callback(res,json) {
    if(res.code==200){
        tsGetBookedChildren_port(json.courseId,json.time);
    }else{
        console.log("错误");
    }
};

// 获取学校课程
function GetSchoolCourses_port(id) {
    var data={
            schoolId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetSchoolCourses,param,GetSchoolCourses_callback,id);
};
function GetSchoolCourses_callback(res,id) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].pic=httpUrl.path_img+data[i].pic
        };
        var data01={data:data};
        var html=template("activityList_script",data01);
        $("#activityList").empty().append(html);
       
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 获取学校课程
function AddCourse_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.AddCourse,param,AddCourse_callback);
};
function AddCourse_callback(res) {
    if(res.code==200){
        $("#quit").click(); 
       GetSchoolCourses_port($("#school").val());
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 课程详情 
function GetCourseDetails_port(id,name) {
    var data={
            courseId:id,
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetCourseDetails,param,GetCourseDetails_callback,name);
};
function GetCourseDetails_callback(res,name) {
    if(res.code==200){
        var data=JSON.parse(res.data);

        $(".content").addClass("hide01");
        $("#content01").removeClass("hide01");
        $("#content01 > h1 > span").text(name);
        $("#content01 > h1 > small").text("编辑");
        $("form.form-horizontal input,form.form-horizontal textarea").val("");
        $("form.form-horizontal input[name=id]").val($(this).attr("data-id"));
        $("form.form-horizontal input[name=schoolId]").val($("#school").val());
        $("#addPicBtn01,#addPicBtn02").siblings().remove();

        for(i in data){
            $("input[name="+i+"]").val(data[i]);
            $("textarea[name="+i+"]").val(data[i]);
        };

        data.pic=httpUrl.path_img+data.pic;
        data.coursePics=JSON.parse(data.coursePics);
        data.workShow=JSON.parse(data.workShow);
        data.path=httpUrl.path_img;
        
        $("#addPicBtn").css({
            "background":"transparent url("+data.pic+") center center no-repeat",
            "background-size":"contain"
        });

        var html01=template("addPicBtn01_script",data);
        $("#addPicBtn01").before(html01);

        var html02=template("addPicBtn02_script",data);
        $("#addPicBtn02").before(html02);


    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除图片函数
function deletePic() {
    $(".form-horizontal").on({
        mouseover:function () {
            $(this).find("span.deleteIcon").addClass("current");
        },
        mouseout:function () {
            $(this).find("span.deleteIcon").removeClass("current");
        }
    },".pagination li");
    $(".form-horizontal").on("click",".pagination > li span.deleteIcon",function (event) {
        $(this).parents("li").remove();
        var arr01=[];
            for(var i=0;i<$("#addPicBtn01").parent("ul").find("a.pic").length;i++){
                arr01.push($("#addPicBtn01").parent("ul").find("a.pic").eq(i).attr("data-pic"))
            };
        $("input[name=coursePics]").val(JSON.stringify(arr01));

        var arr02=[];
            for(var i=0;i<$("#addPicBtn02").parent("ul").find("a.pic").length;i++){
                arr02.push($("#addPicBtn02").parent("ul").find("a.pic").eq(i).attr("data-pic"))
            };
        $("input[name=workShow]").val(JSON.stringify(arr02));
        event.stopPropagation();
    });
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
            $("#addPicBtn").css({
                "background":"transparent url("+imgUrl+") center center no-repeat",
                "background-size":"contain"
            });

            $("#addPicBtn").removeClass("empty").empty().next("input[name=pic]").val(responseText.uploadFileMd5);
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });



        var myDropzone01=new Dropzone('#addPicBtn01',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone01.on('success',function(file,responseText){
            if(responseText.uploadFileMd5==undefined){
                alert('没有上传成功,请重试');
                return ;
            };
            var imgUrl=httpUrl.path_img+responseText.uploadFileMd5;
            var html="<li>"+
                        "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" class=\"pic\" data-pic="+responseText.uploadFileMd5+">"+
                            "<img src="+imgUrl+"&Thumbnail=1>"+
                            "<span class=\"deleteBtn\"></span>"+
                        "</a>"+
                    "</li>";
            $("#addPicBtn01").before(html);
            var arr=[];
            for(var i=0;i<$("#addPicBtn01").parent("ul").find("a.pic").length;i++){
                arr.push($("#addPicBtn01").parent("ul").find("a.pic").eq(i).attr("data-pic"))
            };
            $("input[name=coursePics]").val(JSON.stringify(arr));
        });
        myDropzone01.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });


        var myDropzone02=new Dropzone('#addPicBtn02',{
            url: httpUrl.picUrl,//84服务器图片
            paramName: "mbFile", // The name that will be used to transfer the file
            maxFilesize: 50, // MB
            addRemoveLinks: true,
            acceptedFiles: 'image/*'
        });
        myDropzone02.on('success',function(file,responseText){
            if(responseText.uploadFileMd5==undefined){
                alert('没有上传成功,请重试');
                return ;
            };
            var imgUrl=httpUrl.path_img+responseText.uploadFileMd5;
            var html="<li>"+
                        "<a href=\"#modal-dialog-img\" data-toggle=\"modal\" class=\"pic\" data-pic="+responseText.uploadFileMd5+">"+
                            "<img src="+imgUrl+"&Thumbnail=1>"+
                            "<span class=\"deleteBtn\"></span>"+
                        "</a>"+
                    "</li>";
            $("#addPicBtn02").before(html);
            var arr=[];
            for(var i=0;i<$("#addPicBtn02").parent("ul").find("a.pic").length;i++){
                arr.push($("#addPicBtn02").parent("ul").find("a.pic").eq(i).attr("data-pic"))
            };
            $("input[name=workShow]").val(JSON.stringify(arr));
        });
        myDropzone02.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });
};