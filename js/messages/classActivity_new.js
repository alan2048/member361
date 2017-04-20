$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    onValid(); //input开启验证函数
    loadFiles();// 上传图片接口
    getUserClassInfo_port(); // 获取用户班级信息接口

    // 点击完成按钮，先执行验证再执行保存接口
    $("#finalBtn").click(function () {
        isValid();
        var aa=$(".textbox-invalid").length;
        if(aa==0){
            AddNewClassInfo_port();
            $(this).off();
        }else{
            alert('请先将红色区域的必填项补充完成。。')
        }
    });

};

// 查询接口函数
function AddNewClassInfo_port() {
    var data={
                username:user.userUuid,
                notifygroup:$("#userClass").val(),//必填
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
        initAjax(httpUrl.AddNewClassInfo,param,AddNewClassInfo_callback);
    }
};
function AddNewClassInfo_callback(res) {
    if(res.info=="OK"){
        window.location.href="classActivity.html"+"?userUuid="+user.userUuid+"&classId="+user.curClassId+"&perssionNames=通知管理班级活动";
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
        var val=$(this).val().search(/^.{1,120}$/);
        if(val<0){
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
            url: httpUrl.picUrl,//84服务器图片
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