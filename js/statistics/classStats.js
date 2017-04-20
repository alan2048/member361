var jsonAll,jsonAll01;
$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入

    // 月份选择初始化
    var month=[1,2,3,4,5,6,7,8,9,10,11,12];
    var htmlMonth=template("month_script",{month});
    var d=new Date();
    $("#month02").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);
    $("#year02").find("option[value="+(d.getFullYear())+"]").prop("selected",true);

    echart_A02_port();//echart02初始化

    $(window).resize(function () {
        echart_A02("email-content02",jsonAll01);
    });

    // echart_A02接口函数
    $("#range02,#year02,#month02").change(function () {
        echart_A02_port();
    });
    $("#btn02").click(function () {
        echart_A02_port();  
    });
};


// echart_A02接口
function echart_A02_port() {
    var data={
            gradeId:$("#range02").val(),
            time:$("#year02").val() +"-"+$("#month02").val(),
            useruuid:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassesAbilibySimple,param,echart_A02_callback);
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
    for(var i=0;i<json.length;i++){
        res.legend.push(json[i].name);
    };
    res.xAxis=json[0].detail.BJNames;
    
    var color=colorfn(1);
    for(var i=0;i<json.length;i++){
        var per01={
                name:json[i].name,
                type:'bar',
                // barWidth: 0.0001,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {normal: {color:color[i], label:{show:false}}},
                data:json[i].detail.BJVals
        };
        res.series.push(per01);
    };

    var option={
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'4%',
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
            },
            legend: {
                x:'center',
                y:'bottom',
                selectedMode:'single',
                // selected:res.selected,// 子项初始化series
                data:res.legend
            },
            xAxis : [
                {
                    type : 'category',
                    data : res.xAxis,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : res.series
    };

    myChart.setOption(option);
      
};