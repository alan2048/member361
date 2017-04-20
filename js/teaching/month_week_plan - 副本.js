$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    getRootFileUUID();// 获取根文件夹UUID
    loadFiles(); //上传
    hiddenback(); //隐藏返回上一级按钮
}

// 获取根文件UUID
function getRootFileUUID() {
    var data={
        loginuuid:user.userUuid
    };
    var param={
        params:JSON.stringify(data)
    };
    initAjax(httpUrl.getRootFileUUID,param,getRootFileUUID_callback); 
};
function getRootFileUUID_callback(res) {
    if(res.code==200){
        var uid=JSON.parse(res.data);
        var data={
            loginuuid:user.userUuid,
            fileuuid:uid.rootUUID
        };
        var param={
            params:JSON.stringify(data)
        };
        $(".ysjh-yzjh-navgition li").attr('data-fileuuid',uid.rootUUID);  //面包屑
        initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback,uid); 
    }else{
        console.log('请求错误，返回code非200');
    }
};
function getAllChildInfo_callback(res,uid) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("todolist",{data});
        $("#todolist-wrap").empty().append(html);
        $("#todolist-wrap").attr('data-parentuuid',uid.rootUUID);
    }else{
        console.log('请求错误，返回code非200');
    }
};
// 获取子集文件UUID
$("#todolist-wrap").on('click','.todolist li.folder',function() {
    var thisname = $("span",this).html();  //面包屑
    var fileuuid = $(this).attr('data-fileuuid');
    var data={
        loginuuid:user.userUuid,
        fileuuid:fileuuid
    };
    var param={
        params:JSON.stringify(data)
    };
    $("#fh-back").attr('data-fileuuid',$("#todolist-wrap").attr('data-parentuuid'));  //面包屑 
    initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback1);
    function getAllChildInfo_callback1(res){
        if(res.code==200){
            var data=JSON.parse(res.data);
            var html=template("todolist",{data});
            $("#todolist-wrap").empty().append(html);
            $("#todolist-wrap").attr('data-parentuuid',fileuuid);
            $(".ysjh-yzjh-navgition ul").append('<li data-fileuuid="'+fileuuid+'">'+thisname+'</li>');  //面包屑
            hiddenback(); //隐藏返回上一级按钮  //面包屑
        }else{
            console.log('请求错误，返回code非200');
        }
    }
});

//新建文件夹
$("#modialog-xz").click(function() {
    $("#modal-dialog2 input").val("");
    $("#modal-dialog2 p.text-danger").html("");
    $('#modal-dialog2').modal();
});
$("#modal-dialog2 .btn-success").click(function(){
    var txt = $("#modal-dialog2 input").val();
    var parentuuid = $("#todolist-wrap").attr('data-parentuuid');
    var data={
        loginuuid:user.userUuid,
        filemd5:'91cad243103e3cc6785ee6bcd2a25b01',
        filename:txt,
        fileext:'folder',
        filetype:3,
        parentuuid:parentuuid
    };
    var param={
        params:JSON.stringify(data)
    };
    var reg = /^[^\/\\"<>\?\*:|\s]*$/;
    if(!reg.test(txt)){
        $("#modal-dialog2 p.text-danger").html("文件夹名称含有非法字符。");
        return;
    }else if(txt==""){
        $("#modal-dialog2 p.text-danger").html("文件夹名称不能为空。");
        return;
    }else{
        $("#modal-dialog2 input").val("");
        $("#modal-dialog2 p.text-danger").html("");
        initAjax(httpUrl.insertFileInfo,param,insertFileInfo_callback,parentuuid);
    }
});
function insertFileInfo_callback(res,parentuuid) {
    if(res.code==502){
        $("#modal-dialog2 p.text-danger").html("文件夹名称已存在。");
        return;
    }else{
        var data={
            loginuuid:user.userUuid,
            fileuuid:parentuuid
        };
        var param={
            params:JSON.stringify(data)
        };
        initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback2); 
    }
};
function getAllChildInfo_callback2(res) {
    $('#modal-dialog2').modal('hide');
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("todolist",{data});
        $("#todolist-wrap").empty().append(html);
    }else{
        console.log('请求错误，返回code非200');
    }
};

//下载文件（夹）
$("#yzjh-down").click(function() {
    var li = $("#todolist-wrap .todolist li");
    var liarray = new Array();
    for(var i = 0; i < li.length; i++){
        if(li.eq(i).hasClass('active')&&li.eq(i).hasClass('file')){
            alert("文件夹不可以下载。");
            return;
        }else if(li.eq(i).hasClass('active')){
            liarray.push(li[i]);
        }
    }
    if(liarray.length==0){
        alert("请选择需要下载的文件。");
    }else if(liarray.length>1){
        alert("请选择一个文件下载。");
    }else{ 
        try{ 
            var elemIF = document.createElement("iframe");   
            elemIF.src = httpUrl.fileDownload+'?params='+encodeURIComponent('{"fileMd5":"'+$("#todolist-wrap li.active").attr('data-filemd5')+'","fileName":"'+$("#todolist-wrap li.active span").html()+'"}'); 
            elemIF.style.display = "none";   
            document.body.appendChild(elemIF);   
        }catch(e){ 
            alert("下载失败。");
        } 
        // $.ajax({
        //     type:"POST",
        //     url:httpUrl.fileDownload,
        //     data:param,
        //     dataType:"json",
        //     statusCode:{
        //         404:function(){
        //             alert("访问地址不存在或接口参数有误 错误代码404");
        //         },
        //         500:function(){
        //             console.log("因为意外情况，服务器不能完成请求 错误代码500");
        //         },
        //         405:function(){
        //             alert("资源被禁止 错误代码405");
        //         }
        //     },
        //     success:function(result){
        //         console.log(res);
        //     },
        //     error:function(result){
        //         console.log("请求失败 error!");
        //     }
        // }); 
    }
});

// 预览
$("#preview").click(function() {
    var li = $("#todolist-wrap .todolist li");
    var liarray = new Array();
    for(var i = 0; i < li.length; i++){
        if(li.eq(i).hasClass('active')&&li.eq(i).hasClass('file')){
            alert("文件夹不可以下载。");
            return;
        }else if(li.eq(i).hasClass('active')){
            liarray.push(li[i]);
        }
    }
    if(liarray.length==0){
        alert("请选择需要下载的文件。");
    }else if(liarray.length>1){
        alert("请选择一个文件下载。");
    }else{ 
        try{ 
            var src = httpUrl.fileDownload+'?params='+encodeURIComponent('{"fileMd5":"'+$("#todolist-wrap li.active").attr('data-filemd5')+'","fileName":"'+$("#todolist-wrap li.active span").html()+'"}'); 
            window.open("http://dcsapi.com/?k=106194529&url="+encodeURIComponent(src)); 
        }catch(e){ 
            alert("下载失败。");
        } 
    }
});

//重命名文件（夹）
$("#modialog-cmm").click(function() {
    var li = $("#todolist-wrap .todolist li");
    var liarray = new Array();
    for(var i = 0; i < li.length; i++){
        if(li.eq(i).hasClass('active'))
        liarray.push(li[i]);
    }
    if(liarray.length==0){
        alert("请选择需要重命名的文件（夹）。");
    }else if(liarray.length>1){
        alert("请选择一个文件（夹）重命名。");
    }else{
        $("#modal-dialog input").val("");
        $("#modal-dialog p.text-danger").html("");
        $('#modal-dialog').modal();
    }
});
$("#modal-dialog .btn-success").click(function(){
    var txt = $("#modal-dialog input").val();
    var fileuuid = $("#todolist-wrap li.active").attr('data-fileuuid');
    var parentuuid = $("#todolist-wrap").attr('data-parentuuid');
    var data={
        loginuuid:user.userUuid,
        fileuuid:fileuuid,
        filename:txt
    };
    var param={
        params:JSON.stringify(data)
    };
    var reg = /^[^\/\\"<>\?\*:|\s]*$/;
    if(!reg.test(txt)){
        $("#modal-dialog p.text-danger").html("文件夹名称含有非法字符。");
        return;
    }else if(txt==""){
        $("#modal-dialog p.text-danger").html("文件夹名称不能为空。");
        return;
    }else{
        $("#modal-dialog p.text-danger").html("");
        initAjax(httpUrl.updateFileName,param,updateFileName_callback,parentuuid);
    }
});
function updateFileName_callback(res,parentuuid) {
    if(res.code==502){
        $("#modal-dialog p.text-danger").html("文件夹名称已存在。");
        return;
    }else{
        var data={
            loginuuid:user.userUuid,
            fileuuid:parentuuid
        };
        var param={
            params:JSON.stringify(data)
        };
        initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback3); 
    }
};
function getAllChildInfo_callback3(res) {
    $('#modal-dialog').modal('hide');
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("todolist",{data});
        $("#todolist-wrap").empty().append(html);
    }else{
        console.log('请求错误，返回code非200');
    }
};

//删除文件（夹）
$("#yzjh-delete").click(function() {
    var li = $("#todolist-wrap .todolist li");
    var liarray = new Array();
    //var fileuuid = $("#todolist-wrap li.active").attr('data-fileuuid');
    var parentuuid = $("#todolist-wrap").attr('data-parentuuid');
    for(var i = 0; i < li.length; i++){
        if(li.eq(i).hasClass('active'))
        liarray.push(li.eq(i).attr('data-fileuuid'));
    }
    if(liarray.length==0){
        alert("请选择需要删除的文件（夹）。");
    }else{
        for(var i = 0; i < liarray.length; i++){
            var data={
                loginuuid:user.userUuid,
                fileuuid:liarray[i]
            };
            var param={
                params:JSON.stringify(data)
            };
            initAjax(httpUrl.deleteFileInfo,param,deleteFileInfo_callback,parentuuid);
        }
    }
});
function deleteFileInfo_callback(res,parentuuid) {
    if(res.code==502){
        alert("该文件夹下存在文件");
        return;
    }else{
        var data={
            loginuuid:user.userUuid,
            fileuuid:parentuuid
        };
        var param={
            params:JSON.stringify(data)
        };
        initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback4); 
    }
};
function getAllChildInfo_callback4(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("todolist",{data});
        $("#todolist-wrap").empty().append(html);
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 上传
function loadFiles() {
    Dropzone.options.myAwesomeDropzone=false;
    Dropzone.autoDiscover=false;
    var myDropzone=new Dropzone('#yzjh-upload',{
        url: httpUrl.picUrl,
        paramName: "mbFile",
        maxFilesize: 20, // MB
        addRemoveLinks: true,
        dictFileTooBig:"文件过大({{filesize}}MB). 上传文件最大支持: {{maxFilesize}}MB.",
        previewTemplate: "<div style='display:none'></div>",
        init:function(){
            this.on("addedfile", function(file) { 
                $(".ysjh-yzjh-progress").show(); //显示进度条
            });
            this.on("queuecomplete",function(file) {
                $(".ysjh-yzjh-progress").hide(); //隐藏进度条
            });
            this.on("removedfile",function(file){
                //删除文件时触发的方法
            });
        }
    });
    myDropzone.on('success',function(file,responseText){
        var parentuuid = $("#todolist-wrap").attr('data-parentuuid');
        if(responseText.uploadFileMd5==undefined){
            alert('没有上传成功,请重试');
            return ;
        };
        var fileext = file.name.split('.').pop().toLowerCase();
        var data={
            loginuuid:user.userUuid,
            filemd5:responseText.uploadFileMd5,
            filename:file.name,
            fileext:fileext,
            filetype:2,
            parentuuid:parentuuid
        };
        var param={
            params:JSON.stringify(data)
        };
        initAjax(httpUrl.insertFileInfo,param,insertFileInfo_callback1,parentuuid); 
    });
    myDropzone.on('error',function(file,errorMessage,httpRequest){
        alert('没有上传成功,请重试:'+errorMessage);
        this.removeFile(file);
    });
    myDropzone.on('totaluploadprogress',function(x,y,z){
        $(".ysjh-yzjh-progress .progress-bar").css("width",x+"%");
    });
}
function insertFileInfo_callback1(res,parentuuid) {
    if(res.code==502){
        alert("文件名称已存在。");
        return;
    }else{
        var data={
            loginuuid:user.userUuid,
            fileuuid:parentuuid
        };
        var param={
            params:JSON.stringify(data)
        };
        initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback5); 
    }
};
function getAllChildInfo_callback5(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("todolist",{data});
        $("#todolist-wrap").empty().append(html);
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 面包屑
$(".ysjh-yzjh-navgition").on('click','li',function() {
    var liindex = $(this).index()+1;
    var syli = $(".ysjh-yzjh-navgition li").length - liindex;

    var fileuuid = $(this).attr('data-fileuuid');
    var data={
        loginuuid:user.userUuid,
        fileuuid:fileuuid
    };
    var param={
        params:JSON.stringify(data)
    };
    initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback6); 
    function getAllChildInfo_callback6(res) {
        if(res.code==200){
            var data=JSON.parse(res.data);
            var html=template("todolist",{data});
            $("#todolist-wrap").empty().append(html);
            $("#todolist-wrap").attr('data-parentuuid',fileuuid);
            for(var i=0;i<syli;i++){
                $(".ysjh-yzjh-navgition li:last").remove();
            }
            hiddenback(); //隐藏返回上一级按钮
        }else{
            console.log('请求错误，返回code非200');
        }
    };
    $("#fh-back").attr('data-fileuuid',$(this).prev().attr('data-fileuuid'));
});

// 面包屑（返回上一级）
$("#fh-back").click(function(){
    var fileuuid = $(this).attr('data-fileuuid');
    var data={
        loginuuid:user.userUuid,
        fileuuid:fileuuid
    };
    var param={
        params:JSON.stringify(data)
    };
    initAjax(httpUrl.getAllChildInfo,param,getAllChildInfo_callback7,fileuuid); 
    function getAllChildInfo_callback7(res,fileuuid) {
        if(res.code==200){
            var data=JSON.parse(res.data);
            var html=template("todolist",{data});
            $("#todolist-wrap").empty().append(html);
            $("#todolist-wrap").attr('data-parentuuid',fileuuid);
            $(".ysjh-yzjh-navgition li:last").remove();
            var syli = $(".ysjh-yzjh-navgition li").length - 2;
            $("#fh-back").attr('data-fileuuid',$(".ysjh-yzjh-navgition li").eq(syli).attr('data-fileuuid'));
            hiddenback(); //隐藏返回上一级按钮
        }else{
            console.log('请求错误，返回code非200');
        }
    };
});

// 隐藏返回上一级按钮
function hiddenback(){
    if($(".ysjh-yzjh-navgition li").length==1){
        $("#fh-back").hide();
    }else{
        $("#fh-back").show();
    }
}

// 复选框
$("#todolist-wrap").on('click','.todolist .todolist-container',function(event) {
    event.stopPropagation();
    var e = $(this).closest("li");
    if ($(e).hasClass("active")) {
        $(e).removeClass("active");
    } else {
        $(e).addClass("active");
    }
});
// 全选
$("#mwp-qx").click(function(){
    var qx = $("i",this);
    var checkbox = $("ul.todolist li");   
    if(qx.hasClass("fa-check-square-o")) {
        qx.attr("class","fa fa-square-o");
        $("ul.todolist li").removeClass("active");
    }else{
        qx.attr("class","fa fa-check-square-o");
        $("ul.todolist li").addClass("active");
    }
});