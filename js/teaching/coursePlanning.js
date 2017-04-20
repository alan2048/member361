$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    pagination01();// 列表底下小分页函数

    courseList_port();// 获取课程计划列表
    courseSaveBtn(res);// 新增btn按钮添加search参数;
    // 删除接口
    $("#courseDelete").click(function () {
        var right=confirm("确认删除吗？");
         if(right){
            courseDelete_port();
         };
    });
}
function courseSaveBtn(res) {
    var userUuid=res[0].curUser.uuid;
    var classId=res[3];
    var urlSearch="coursePlanning_new.html"+"?userUuid="+userUuid+"&classId="+classId+"&perssionNames=教学管理预设计划课程计划新增";
    $("#courseSave").attr('href',urlSearch);
};
// 查询接口函数
function courseList_port(pageNumber) {
    var data={
            useruuid:user.userUuid,
            classid:user.classId,
            curPageNumber:pageNumber || 1
        };
    var param={
            params:JSON.stringify(data),
            loginid:''
    };
    initAjax(httpUrl.courseList,param,courseList_callback);
};
function courseList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        
        for(var i=0;i<data.list.length;i++){
            data.list[i].begintime01=new Date(data.list[i].begintime).Format("yyyy-MM-dd");
            data.list[i].endtime01=new Date(data.list[i].endtime).Format("yyyy-MM-dd");
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
            cssStyle: 'pagination-without-border pull-right m-t-0',
            onPageClick: function (pageNumber, event) {
                courseList_port(pageNumber);
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
    courseList_port();// 获取课程计划列表
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
        var pageNumber=Number($(this).attr("data-num"));
        courseList_port(pageNumber);
    });
}