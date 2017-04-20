$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    chooseNiceScroll("#menu");
    getDateList_port(); //获得菜谱日期列表

    $("#menu").on("click","li",function () {
        var data=JSON.parse($(this).attr("data-json"));
        healthGetTable_port(data); //获得整张表的内容
    });

    $("#menuList >.hideBtn").click(function () {
        $(this).next("#menu").fadeToggle(200,"linear");
    });

    editTable();//编辑表格
};
function editTable() {
    $("#menuMain").on("dblclick","td",function () {
        var text=$(this).text();
        $(this).empty().append("<textarea></textarea>");
        $(this).find("textarea").focus().val(text);
    }).on("focusout","td > textarea",function () {
        var text=$(this).val();
        $(this).parent("td").text(text);
    });

    $("#menuMain").on("dblclick","th",function () {
        var text=$(this).text();
        $(this).empty().append("<textarea></textarea>");
        $(this).find("textarea").focus().val(text);
    }).on("focusout","th > textarea",function () {
        var text=$(this).val();
        $(this).parent("th").text(text);
    });

    // 单击选中行
    $("#menuMain").on("click","tbody >tr",function () {
        $(this).toggleClass("active").siblings().removeClass("active");
    });

    // 新增菜谱
    $("#newMenu").click(function () {
        $("#myModal").modal("show");
    });

    // 新增菜谱
    $("#finalBtn").click(function () {
        for(var i=0;i<$("input.fill").length;i++){
            if(!$("input.fill").eq(i).val()){
                $("input.fill").eq(i).addClass("empty");
            }
        }

        if($("input.fill").hasClass("empty")){
            $("input.fill").focus();
        }else{
            var json={
                    title:$("#healthTitle").val(),
                    startTime:$("#planBegintime").val(),
                    endTime:$("#planEndtime").val()
            };
        
            var arr=[];
            for(var i=0;i<$("#healthLine").val();i++){
                arr.push([]);
            };
            for(var i=0;i<arr.length;i++){
                for(var j=0;j<$("#healthCol").val();j++){
                    arr[i].push("")
                }
            };
            var res={
                    code:200,
                    data:JSON.stringify(arr)
            };
            healthGetTable_callback(res,json);
            $("#myModal").modal("hide");
        };
    });

    // 修改表格标题
    $("#menuMain").on("dblclick",".conTitle",function () {
        var json=JSON.parse($(this).attr("data-json"));
        $(this).text("").append("<input type=\"text\" >").children("input").focus().val(json.title);
    });

    $("#menuMain").on("focusout",".conTitle >input",function () {
        var json=JSON.parse($(this).parent(".conTitle").attr("data-json"));
        json.title=$(this).val();
        $(this).parent(".conTitle").attr("data-json",JSON.stringify(json)).empty().text(json.title);
    });

    // 验证必填项
    $("input.fill").keyup(function () {
        if($(this).val()){
            $(this).removeClass("empty")
        }else{
            $(this).addClass("empty")
        }
    });

    $(".btn-quit").click(function () {
        $("#menuMain").empty();
    });

    // 新增行
    $("#editLine").click(function () {
        if($("#menuMain > table").length !=0){
            var aa="<td></td>";
            var html="";
            for(var i=0;i<$("#menuMain > table > thead > tr >th").length;i++){
                html +=aa;
            };
            $("#menuMain >table >tbody").append("<tr>"+html+"</tr>");
        }else{
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }
    });

    // 删除行
    $("#deleteLine").click(function () {
        if($("#menuMain >table >tbody >tr").hasClass("active")){
            $("#menuMain >table >tbody >tr.active").remove();
        }else{
            toastTip("提示","请先选择行。。")
        }
    });

    // 增加列
    $("#newCol").click(function () {
        if($("#menuMain > table").length !=0){
            $("#menuMain >table >thead >tr").append("<th></th>");
            $("#menuMain >table >tbody >tr").append("<td></td>");

            var num=$("#menuMain >table >thead >tr >th").length;
            $("#menuMain").find("th").css("width",(1/num)*100+"%");
        }else{
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }
    });

    // 删除列
    $("#deleteCol").click(function () {
        if($("#menuMain >table >thead >tr >th").hasClass("current")){
            $("#menuMain >table >thead >tr >th.current").remove();
            $("#menuMain >table >tbody >tr >td.current").remove();
        }else{
            toastTip("提示","请先选择列。。")
        }
    });

    // 删除表格
    $("#deleteMenu").click(function () {
        if($("#menuMain").children().length !=0){
            var r=confirm("确定删除吗？");
            if(r == true){
                healthDeleteTable_port(JSON.parse($("#menuMain >.conTitle").attr("data-json")));
            };
        }else{
            toastTip("提示","请先选择表格。。。")
        }
        
    });

    // 删除列
    $("#editMenu").on({
        mouseover:function () {
            $(this).find("span").addClass("current");
        },
        mouseout:function () {
            $(this).find("span").removeClass("current")
        }
    });

    // 单击选中列
    $("#menuMain").on("click","thead >tr >th",function () {
        $(this).toggleClass("current").siblings().removeClass("current");
        var index=$(this).index()+1;
        $("#menuMain > table > tbody > tr").find("td:nth-of-type("+index+")").toggleClass("current").siblings().removeClass("current");
    });

    // 保存表格
    $("#saveBtn").click(function () {
        if($("#menuMain").children().length ==0){
            toastTip("提示","请先新建或选择菜谱列表。。。")
        }else{
            var arr=[];

            var thArr=[];
            for(var i=0;i<$("#menuMain > table > thead > tr > th").length;i++){
                var th=$("#menuMain > table > thead > tr > th");
                thArr.push(th.eq(i).text());
            }
            arr.push(thArr);

            var tb=$("#menuMain > table > tbody > tr");
            for(var i=0;i<tb.length;i++){
                var tbArr=[];
                for(var j=0;j<tb.eq(i).children().length;j++){
                    var aa=[];
                    tbArr.push(tb.eq(i).children().eq(j).text());
                };
                arr.push(tbArr);
            };

            var json=JSON.parse($("#menuMain >.conTitle").attr("data-json"));
            json.remark=arr;
            healthSaveTable_port(json);
        };
    });

    // 体检日期输入函数
    $('#planBegintime,#planEndtime').datepicker({
        todayHighlight:true,
        language:'zh-CN'
    }).on("changeDate",function (ev) {
        if($('#planBegintime,#planEndtime').val()){
            $('#planBegintime,#planEndtime').removeClass("empty");
        };
        $('#planBegintime,#planEndtime').datepicker("hide");
    });

};

// 获得菜谱日期列表
function getDateList_port() {
    var data={
            loginuuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getDateList,param,getDateList_callback);
};
function getDateList_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        for(var i=0;i<data.length;i++){
            data[i].startTime=new Date(data[i].startdate).Format("yyyy-MM-dd");
            data[i].endTime=new Date(data[i].enddate).Format("yyyy-MM-dd");
            data[i].json=JSON.stringify(data[i]);
        };
        var data01={data:data};
        var html=template("menu_script",data01);
        $("#menu").empty().append(html);

        if(1){
            $("#menuMain").empty();
            // $("#menu > li:first").click();
        };
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 获得整张表的内容
function healthGetTable_port(json) {
    var data={
            loginuuid:user.userUuid,
            startdate:json.startdate
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.healthGetTable,param,healthGetTable_callback,json);
};
function healthGetTable_callback(res,json) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        json.json=JSON.stringify(json);
        json.data=data;
        var html=template("menuMain_script",json);
        $("#menuMain").empty().append(html).find("th").css("width",(1/data[0].length)*100+"%");
    }else{
        console.log('请求错误，返回code非200');
    }
};

// 新增编辑表格
function healthSaveTable_port(json) {
    var data={
            loginuuid:user.userUuid,
            startdateStr:json.startTime,
            enddateStr:json.endTime,
            title:json.title,
            remark:json.remark
        };
    var param={
            params:JSON.stringify(data)
    };
    toastTip("提示","正在保存，请稍候。。。");
    initAjax(httpUrl.healthSaveTable,param,healthSaveTable_callback,json);
};
function healthSaveTable_callback(res,json) {
    if(res.code==200){
        toastTip("提示","保存成功。。。")
        getDateList_port();
    }else{
        toastTip("提示","保存失败，请重试。。。")
        console.log('请求错误，返回code非200');
    }
};

// 删除表格
function healthDeleteTable_port(json) {
    var data={
            loginuuid:user.userUuid,
            startdateStr:json.startTime
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.healthDeleteTable,param,healthDeleteTable_callback,json);
};
function healthDeleteTable_callback(res,json) {
    if(res.code==200){
        getDateList_port();
    }else{
        console.log('请求错误，返回code非200');
    }
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


(function($){
    $.fn.datepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"]
    };
}(jQuery));