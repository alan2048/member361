$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    onValid(); //input开启验证函数
    loadFiles();// 上传图片接口

    // 点击完成按钮，先执行验证再执行保存接口
    $("#finalBtn").click(function () {
        isValid();
        var aa=$(".textbox-invalid").length;
        if(aa==0){
            AddNotify2Info_port();
            $(this).off();
        }else{
            alert('请先将红色区域的必填项补充完成。。')
        }
    });

    //获取全部班级列表 
    $("#allClassBtn").click(function () {
        if($("#allClass li").length==0){
            getAllClassInfo_port(); 
        } 
    });

    // 点击班级链接班级成员项接口函数
    $("#allClass").on("click","li > a",function () {
        var tabIndex=$(this).attr("data-tab");
        if($("#default-tab-"+tabIndex+" label").length==0){
            var classId=$(this).attr("data-orgid");
            getClassMemberInfo_port(classId,tabIndex);
        }
    });

    // 点击班级全选按钮判断是否选择班级全体成员
    $("#allClass").on("click","li > input",function () {
        $(this).prev("a").click();
        var tabIndex=$(this).attr("data-tab");
        var ArrLabel=$("#default-tab-"+tabIndex+" label >input");
        if($(this).is(":checked")){
            $.each(ArrLabel,function (index,value) {
                $(value).prop("checked",true);
            });
        }else{
            $.each(ArrLabel,function (index,value) {
                $(value).prop("checked",false);
            });
        }
    });

    // 班级成员项点击判断是否全选
    $("#classMember").on("click","input",function () {
        var parent=$(this).parents(".tab-pane").eq(0);
        var AA=0;
        $.each(parent.find("input"),function (index,value) {
            if(!$(value).is(":checked")){
                AA++;
            }
        });

        var curOrgid=parent.attr("data-orgid");
        if(AA>0){
            $("#allClass input[data-orgid="+curOrgid+"]").attr("checked",false);
        }else{
            $("#allClass input[data-orgid="+curOrgid+"]").attr("checked",true);
        }
    });

    // 全选按钮函数
    $("#chooseAll").click(function () {
        if($(this).is(":checked")){
            $("#allClass li input").attr("checked",true);
        }else{
            $("#allClass li input").attr("checked",false);
        }
    });

    // 判断是否选中通知成员
    $("#chooseMemberBtn").click(function () {
        var ban=$("#allClass input");
        var i=0;
        $.each($("#allClass input"),function (index,value) {
            if($(value).is(":checked")){
                i++;
            }
        });
        $.each($("#classMember input"),function (index,value) {
            if($(value).is(":checked")){
                i++;
            }
        });
        if(i>0){
            $("#allClassBtn").text("已选择");
            $("#allClassBtn").removeClass('textbox-invalid');
        }else{
            $("#allClassBtn").text("未选择");
            $("#allClassBtn").addClass('textbox-invalid');
        }
    });
};

// 查询接口函数
function AddNotify2Info_port() {
    var notifygroup=[];
    var notifyperson=[];
    $.each($("#allClass input"),function (index,value) {
        var orgId=$(value).attr("data-orgid");
       if($(value).is(":checked")){
            notifygroup.push(orgId);
       }else{
            var members=$("#classMember .tab-pane[data-orgid="+orgId+"]").find("input:checked"); 
            $.each(members,function (index01,value01) {
                  var id=$(value01).attr('data-id');
                  notifyperson.push(id);
            });      
       } 
    });
    
    var data={
                pmid:10,// 10=财务介绍
                username:user.userUuid,
                notifygroup:notifygroup,//必填
                notifyperson:notifyperson,
                title:$("#activityTitle").val(),//必填
                picture:$("#activityPicture").attr("data-md5"),//必填
                summary:$("#activitySummary").val(),
                link:$("#activityLink").val(),
                content:''
        };


    if(!data.link && !ue.getContent()){
        alert('原文链接和内容至少得填一个');
    }else if(data.link && ue.getContent()){
        alert('原文链接和内容至多填一个');
    }else{
        if(ue.getContent()){
                        data.content='<!DOCTYPE html>'+
                            '<html lang="en">'+
                                '<head>'+
                                    '<meta charset="gbk" />'+
                                    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">'+
                                    '<title>'+$("#activityTitle").val()+'</title>'+
                                '</head>'+
                                '<body>'+ue.getContent()+'</body>'+
                            '</html>';
        }else{
            if(data.link.indexOf("http")<0){
                data.link="http://"+data.link;
            }
        }
        var param={
                params:JSON.stringify(data)
        };
        initAjax(httpUrl.AddNotify2Info,param,AddNotify2Info_callback);
    }
};
function AddNotify2Info_callback(res) {
    if(res.info=="OK"){
        window.location.href="newsActivity10.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&perssionNames=通知管理财务介绍";
    }else{
        alert(res.info);
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
        $("#userClass").append(html);
    }else{
        // console.log('请求错误，返回code非200');
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
        $("#allClass").append(html);
        var html01=template("allClassTab_script",{data});
        $("#classMember").append(html01);

        if(data.length>0){
            var firstOrgid=data[0].orgId;
            getClassMemberInfo_port(firstOrgid,1);
        }
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};
// 获取班级成员信息
function getClassMemberInfo_port(classId,tabIndex) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassMemberInfo,param,getClassMemberInfo_callback,tabIndex);
};
function getClassMemberInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("classMember_script",{data});
        $("#classMember >#default-tab-"+tabIndex).append(html);
        var aa=$("#allClass >li input[data-tab="+tabIndex+"]").is(":checked");
        if(aa){
            $("#classMember >#default-tab-"+tabIndex).find("input").attr("checked",true);
        }
    }else{
        // console.log('请求错误，返回code非200');
    }
};

function isValid() {
    if(!$("#activityTitle").val()){
        $("#activityTitle").addClass('textbox-invalid');
    };
    if(!$("#userClass").val()){
        $("#userClass").addClass('textbox-invalid');
    };
    if($("#activityPicture").attr("src").indexOf("ywglImg3")>=0){
        $("#activityPicture").addClass("textbox-invalid");
    }

    if($("#activityLink").val()){
        var aa=isURL($("#activityLink").val());
        if(aa){
            $("#activityLink").removeClass('textbox-invalid');
        }else{
            $("#activityLink").addClass('textbox-invalid');
            alert('原文链接格式不对,请重新输入');
        };
    }

};
// 开启验证
function onValid() {
    $("#activityTitle").focusout(function () {
        if(!$(this).val()){
            $(this).addClass("textbox-invalid");
        }else{
            $(this).removeClass("textbox-invalid");
        }
    });
    $("#userClass").click(function () {
        if(!$(this).val()){
            $(this).addClass("textbox-invalid");
        }else{
            $(this).removeClass("textbox-invalid");
        }
    });
};
function loadFiles() {
        Dropzone.options.myAwesomeDropzone=false;
        Dropzone.autoDiscover=false;
        var myDropzone=new Dropzone('#activityPicture',{
            url: httpUrl.picUrl,// 84服务器图片
            paramName: "mbFile",
            maxFiles: 2,
            maxFilesize: 10,
            acceptedFiles: ".jpg,.png",
            addRemoveLinks:false,
            headers:{'zyfiletype':'10'},
            accept: function(file, done) {
                if(this.files.length>1){
                    this.removeFile(this.files[0]);
                }
                done();
            }
        });
        myDropzone.on('success',function(file,responseText){
            if(responseText.uploadFileMd5==undefined){
                alert('没有上传成功,请重试');
                return ;
            }
            $("#activityPicture").attr("data-md5",responseText.uploadFileMd5).attr("src",httpUrl.path_img+responseText.uploadFileMd5+"&Thumbnail=1").removeClass("textbox-invalid");
        });
        myDropzone.on('error',function(file,errorMessage,httpRequest){
            alert('没有上传成功,请重试:'+errorMessage);
            this.removeFile(file);
        });
}

function isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
}

