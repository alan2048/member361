$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    pagination01();// 列表底下小分页函数
    
    GetNotify2Info_port();// 获取课程计划列表
    
    // 删除接口
    $("#courseDelete").click(function () {
        var right=confirm("确认删除吗？");
         if(right){
            courseDelete_port();
         };
    });
    // 查询按钮
    $("#search").click(function () {
        GetNotify2Info_port();
    });
    classActivitySaveBtn(res);// 新增btn按钮添加search参数;

        // 未阅读函数
    $("#email-content").on('mouseover','table > tbody > tr >td:last-of-type',function () {
        $(this).find("div").show();
    }).on('mouseout','table > tbody > tr >td:last-of-type',function () {
        $(this).find("div").hide();
    });
}


// 查询接口函数
function GetNotify2Info_port(pageNumber) {
    var data={
            pmid:10,// 10=财务介绍
            req_username:user.userUuid,
            req_page_num:pageNumber || 1
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.GetNotify2Info,param,GetNotify2Info_callback);
};
function GetNotify2Info_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.PM_Infos.length;i++){
            data.PM_Infos[i].Time01=new Date(data.PM_Infos[i].Time*1000).Format("yyyy-MM-dd");
            data.PM_Infos[i].image=httpUrl.path_img+data.PM_Infos[i].Pic+'&Thumbnail=1';
        }
        var html=template("table-email",data);
        $("#email-content").empty().append(html);


        chooseRow();// Row行选择函数
        editRow();// 编辑行函数
        
        // 渲染分页
        $("#pagination").pagination({
            items: data.TotalMsgs,
            itemsOnPage: data.CountPerPage,
            currentPage: data.NowPage,
            cssStyle: 'pagination-without-border pull-right m-t-0',
            onPageClick: function (NowPage, event) {
                GetNotify2Info_port(NowPage);
            }
        });
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除接口函数
function courseDelete_port() {
    var data={
            courseIdList:[]
    };
    // console.log(data);
    var num=$("#email-content tbody tr i.fa-check-square-o");
    for(var i=0;i<num.length;i++){
        data.courseIdList.push(num.eq(i).attr('data-id'));
    }
    var param={
            params:JSON.stringify(data)
    };
    // console.log(param);
    initAjax(httpUrl.courseDelete,param,courseDelete_callback);
};
function courseDelete_callback(res) {
    GetNotify2Info_port();// 获取课程计划列表
};

// 新增btn按钮添加search参数;
function classActivitySaveBtn(res) {
    var userUuid=res[0].curUser.uuid;
    var classId=res[3];
    var urlSearch="newsActivity_new10.html"+"?userUuid="+userUuid+"&classId="+classId+"&perssionNames=通知管理财务介绍";
    $("#classActivity_new").attr('href',urlSearch);
};
// Row行选择函数
function chooseRow() {
    $("#email-content thead tr i").click(function () {
            var aa=$("#email-content thead tr i").hasClass('fa-check-square-o');
            if(aa){
                $("#email-content tbody tr i").removeClass('fa-check-square-o').addClass('fa-square-o');
                $(this).removeClass('fa-check-square-o').addClass('fa-square-o');
            }else{
                $("#email-content tbody tr i").removeClass('fa-square-o').addClass('fa-check-square-o');
                $(this).removeClass('fa-square-o').addClass('fa-check-square-o');
            };
        });
    $("#email-content tbody tr").click(function () {
        var aa=$(this).find('i').hasClass('fa-check-square-o');
        if(aa){
            $(this).find('i').removeClass('fa-check-square-o').addClass('fa-square-o');
        }else{
            $(this).find('i').removeClass('fa-square-o').addClass('fa-check-square-o'); 
        }
    });
}

// 编辑行
function editRow() {
    //  编辑接口函数
    $("#courseEdit").click(function () {
        var num=$("#email-content tbody tr i.fa-check-square-o").length;
        if(num>1){
            alert("编辑时为单选，请重新选择。。");
            $("#email-content tbody tr i.fa-check-square-o").removeClass('fa-check-square-o').addClass('fa-square-o');
        }else if(num==0){
            alert("请先选择。。");
        }else{
            var courseId=$("#email-content tbody tr i.fa-check-square-o").attr('data-id');  
            window.location.href="coursePlanning_edit.html"+"?userUuid="+user.userUuid+"&classId="+user.classId+"&perssionNames=教学管理预设计划课程计划编辑"+"&courseId="+courseId;
        }
    });   
}

// 列表底下小分页函数
function pagination01() {
    $("#email-content").on("click","#pagination01 >li:not(.disabled) >a",function () {
        var pageNumber=$(this).attr("data-num");
        GetNotify2Info_port(pageNumber);
    });
}
