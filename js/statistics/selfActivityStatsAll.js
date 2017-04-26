var jsonAll,jsonAll01;
$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入
    GetSchoolIds_port();

    $(window).resize(function () {
        echart_A02("email-content02",jsonAll01);
    });

    // echart_A02接口函数
    $("#school").change(function () {
        echart_A02_port();
    });
    $("#btn02").click(function () {
        echart_A02_port();  
    });
};


// echart_A02接口
function echart_A02_port() {
    var data={
            schoolId:$("#school").val(),
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };

    initAjax(httpUrl.getCourseAllTJ,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll01=data;
        echart_A02("email-content02",data);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        echart_A02("email-content02",data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function colorfn(trans) {
    var color=['rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')'];
    return color;
}
function echart_A02(id,json){
    var myChart = echarts.init(document.getElementById(id));
    var res={
            legend:[],
            series:[]
    };
    for(var i=0;i<json.datas.length;i++){
        res.legend.push(json.datas[i].name);
    };
    
    var color=colorfn(1);
    for(var i=0;i<json.datas.length;i++){
        var per01={
                name:json.datas[i].name,
                type:'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json.datas[i].data
        };
        res.series.push(per01);
    };

    var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:res.legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: json.time
            },
            yAxis: {
                type: 'value'
            },
            series: res.series
        };

    myChart.setOption(option);
      
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
            
            echart_A02_port();//echart02初始化
        }
    }else{
        // alert("系统故障，请稍候重试。。");
        // console.log('请求错误，返回code非200');
    }
};