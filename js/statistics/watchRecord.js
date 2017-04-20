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
    $("#month01").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);
    $("#month02").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);

    echart_A01_port();//echart01初始化
    getPersonCourse_port();// 获取个人关联课程接口

    $(window).resize(function () {
        echart_A01("email-content01",jsonAll);
        echart_A02("email-content02",jsonAll01);
    });

    // echart_A01接口函数
    $("#gradeId01,#month01,#year01").change(function () {
        echart_A01_port();
    });
    $("#btn01").click(function () {
        echart_A01_port();  
    });

    // echart_A02接口函数
    $("#gradeId02,#month02,#year02").change(function () {
        echart_A02_port();
    });
    $("#btn02").click(function () {
        echart_A02_port();  
    });
    $("#sonTabs").on('click','span',function () {
        $(this).addClass("current").siblings().removeClass("current");
        echart_A02_port(); 
    });
};


// echart_A01接口
function echart_A01_port() {
    var data={
            useruuid:user.userUuid,
            gradeId:$("#gradeId01").val(),
            year:$("#year01").val(),
            month:$("#month01").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.classRecord,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        if(res.data){
            var data=JSON.parse(res.data);
            jsonAll=data;
            echart_A01("email-content01",data);
        }else{
            $("#email-content01").empty();
        }
    }else if(res.code==500){
        if(res.data){
            var data=JSON.parse(res.data);
            jsonAll=data;
            echart_A01("email-content01",data);
        }else{
            $("#email-content01").empty();
        }
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json){
    var res={
            xAxis:[],
            series:[{
                    data:[],
                    markPoint:[]
                },{
                    data:[],
                    markPoint:[]
            }]
    }

    if(json){
        $.each(json,function (index,value) {
            res.xAxis.push(value.className);
            $.each(value.classRecordList,function (j,value01) {
                if(j==0){
                    res.series[0].data.push(value01.number);
                };
                if(j==1){
                    res.series[1].data.push(value01.number);   
                }
            });
        });
    }


    var myChart = echarts.init(document.getElementById(id));
    var option={
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top:'8%',
            left: '5%',
            right: '5%',
            bottom: '8%',
            containLabel: true
        },
        legend: {
            x:'center',
            y:'bottom',
            data:['本月','上月']
        },
        xAxis: [
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
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}'
                    }
            }
        ],
        series : [
            {
                name:'本月',
                type:'bar',
                itemStyle: {normal: {color:'#6fcbe5', label:{show:true}}},
                data:res.series[0].data
            },
            {
                name:'上月',
                type:'bar',
                itemStyle: {normal: {color:'#e0acc6', label:{show:true}}},
                data:res.series[1].data
            }
        ]
    };

    myChart.setOption(option);
};


// echart_A02接口
function echart_A02_port() {
    var data={
            useruuid:user.userUuid,
            gradeId:$("#gradeId02").val(),
            year:$("#year02").val(),
            month:$("#month02").val(),
            courseid:$("#sonTabs span.current").attr("data-courseid")
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.classRecordDim,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        if(res.data){
            var data=JSON.parse(res.data);
            jsonAll01=data;
            echart_A02("email-content02",data);
        }else{
            $("#email-content02").empty();
        }
    }else if(res.code==500){
        if(res.data){
           var data=JSON.parse(res.data);
            jsonAll01=data;
            echart_A02("email-content02",data); 
        }else{
            $("#email-content02").empty();
        }
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A02(id,json){
    var res={
            xAxis:[],
            legend:[],
            series:[],
            color:["#49b6d6","#e0acc6","#a691ea","#deca6e","#ee828f","#eead82","#a6d677","#77d690","#69cfd5","#da79d9","#7982da","#d96f88"]
    }

    if(json){
        $.each(json,function (index,value) {
            res.legend.push(value.className);//图例列表
            var AA={
                    name:value.className,
                    type:'bar',
                    itemStyle: {normal: {color:res.color[index], label:{show:true}}},
                    data:[]
            };
            $.each(value.classDimList,function (j,value01) {
                if(index==0){
                    res.xAxis.push(value01.dimName);//xAxis 初始化
                };
                AA.data.push(value01.number);
            });
            res.series.push(AA);
        });
    };



    var myChart = echarts.init(document.getElementById(id));
    var option={
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'8%',
                left: '5%',
                right: '5%',
                bottom: '8%',
                containLabel: true
            },
            legend: {
                x:'center',
                y:'bottom',
                selectedMode:'single',
                data:res.legend
            },
            xAxis: [
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
                    type : 'value',
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        formatter: '{value}'
                        }
                }
            ],
            series : res.series   
        };
        myChart.setOption(option);
};





function echart_A03(id,json){
    // console.log(json);
    var myChart = echarts.init(document.getElementById(id));
    var res={
            xAxis:[],
            legend:[],
            series:[],
            parentSeries:[],
            sonSeries:[],
            selected:{}
    }
    
    for(var i=0;i<json.length;i++){
        // X轴列表
        res.xAxis.push(json[i].classname);
        if(i==0){
            for(var j=0;j<json[i].classEvaluateInfoList.length;j++){
                // 图例
                res.legend.push(json[i].classEvaluateInfoList[j].rootDimName);
                // 第一层级series 无数据
                var color=colorfn(1);
                var per01={
                        name:json[i].classEvaluateInfoList[j].rootDimName,
                        type:'bar',
                        barWidth: 0.0001,
                        itemStyle: {normal: {color:color[j], label:{show:false}}},
                        data:[]
                };
                res.series.push(per01);
                res.parentSeries.push(per01);

                // 第二级series 无数据
                for(var m=0;m<json[i].classEvaluateInfoList[j].detailInfo.length;m++){
                    var son=json[i].classEvaluateInfoList[j].detailInfo[m];
                    //子series的颜色的渐变递减
                    if(m>8){
                        var t=0.1;
                    }else{
                        var t=0.1*(10-m);
                    }
                    var sonColor=colorfn(t);
                    var sonList={
                            name:son.name,
                            type:'bar',
                            stack:json[i].classEvaluateInfoList[j].rootDimName,
                            itemStyle: {normal: {color:sonColor[j], label:{show:true}}},
                            data:[]
                    };
                    res.series.push(sonList);
                    res.sonSeries.push(sonList);
                }
            };
        };
        // console.log(res.series);
        
        for(var n=0;n<json[i].classEvaluateInfoList.length;n++){
            var name01=json[i].classEvaluateInfoList[n].rootDimName;
            // 第一级series 加载数据
            for(var m=0;m<res.series.length;m++){
                if(res.series[m]["name"]==name01){
                    res.series[m].data.push(json[i].classEvaluateInfoList[n].totalScore);
                }
            };
            // 第二级series 加载数据
            for(var a=0;a<json[i].classEvaluateInfoList[n].detailInfo.length;a++){
                var detaliSon=json[i].classEvaluateInfoList[n].detailInfo[a];
                for(var m=0;m<res.series.length;m++){
                    if(res.series[m]["name"]==detaliSon.name){
                        res.series[m].data.push(detaliSon.dimScore);
                    }
                };
            }

            
        }
    }
    
    // 子项初始化series
    for(var i=0;i<res.sonSeries.length;i++){
        if(res.sonSeries[i]["stack"]==res.parentSeries[0].name){
            res.selected[res.sonSeries[i]["name"]]=true;
        }else{
            res.selected[res.sonSeries[i]["name"]]=false;
        }
    };
    // console.log(res);

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
        selected:res.selected,// 子项初始化series
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
    
    myChart.on("legendselectchanged",function (param) {
        var current=[];
        for(var i=0;i<res.sonSeries.length;i++){
            if(res.sonSeries[i].stack==param.name){
                current.push(res.sonSeries[i].name);
            };
        };
        var newSelected=option.legend.selected;
        // 先回复默认全部false
        for(var value in newSelected){
            newSelected[value]=false;
        }
        // 当前的true
        for(var i=0;i<current.length;i++){
            newSelected[current[i]]=true;
        }
        
        var newOption={
                legend:{
                    selected:newSelected
                }
        };
        // console.log(newOption);
        myChart.setOption(newOption);
    });      
};
function colorfn(trans) {
    var color=['rgba(42,159,194,'+trans+')','rgba(39,107,182,'+trans+')','rgba(104,73,203,'+trans+')','rgba(198,91,207,'+trans+')','rgba(199,83,96,'+trans+')','rgba(203,140,89,'+trans+')'];
    return color;
}


// 获取个人关联课程接口
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
        var html=template("sonTabs_script",{data});
        $("#sonTabs").empty().append(html);

        echart_A02_port();//echart_A02初始化
    }else{
        // console.log('请求错误，返回code非200');
    }
};

