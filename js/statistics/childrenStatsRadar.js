var jsonAll,jsonAll03;
$(function () {
    permission_port(loginSuccess);
});
function loginSuccess(res) {
    App.init();// 侧边树结构、loading载入

    // 月份选择初始化
    var month=[1,2,3,4,5,6,7,8,9,10,11,12];
    var htmlMonth=template("month_script",{month});
    var d=new Date();
    $("#month03,#month01,#month02").append(htmlMonth).find("option[value="+(d.getMonth()+1)+"]").prop("selected",true);
    $("#year03,#year01,#year02").find("option[value="+(d.getFullYear())+"]").prop("selected",true);

    getUserClassInfo_port();
    getUserClassInfo_port01();

    $(window).resize(function () {
        echart_A01("email-content01",jsonAll,$("#classMember").find("option:selected").text());
        echart_A01("email-content03",jsonAll03,$("#classMember").find("option:selected").text());
    });

    // echart_A01接口函数
    $("#classMember,#month01,#year01").change(function () {
        echart_A01_port();
    });
    $("#btn01").click(function () {
        echart_A01_port();  
    });

    $("#classMember03,#month03,#year03,#course").change(function () {
        echart_A03_port();
    });
    $("#btn03").click(function () {
        echart_A03_port();  
    });

    // echart_A02接口函数
    $("#userClass01,#year02,#month02").change(function () {
        echart_A02_port();
    });
    $("#btn02").click(function () {
        echart_A02_port();  
    });
}

// echart_A01接口
function echart_A01_port() {
    var data={
            classId:$("#userClass").val(),
            useruuid:$("#classMember").val(),
            time: $("#year01").val() +"-"+$("#month01").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getStudentAbility,param,echart_A01_callback);
};
function echart_A01_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll=data;
        /*data.Val=[];
        data.Val=[
            [30,34.62,30.55,36.10,32.21,28.30],
            [40.5,37.50,36.36,45.3,38.30,35.30],
            [48.5,42.62,42.55,48.10,51.21,42.30]
        ]*/
        var name=$("#classMember").find("option:selected").text();
        echart_A01("email-content01",data,name);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll=data;
        var name=$("#classMember").find("option:selected").text();
        echart_A01("email-content01",data,name);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A01(id,json,curName){
    var myChart = echarts.init(document.getElementById(id));

    var data={
            name:curName,
            indicator:[],
            legend:json.ExtraInfo,
            value:json.Val
    };

    for(var i=0;i<json.Name.length;i++){
        var aa={};
        aa.name=json.Name[i];
        aa.max=json.ValMax[i];
        data.indicator.push(aa);
    };

    var option={
            backgroundColor: '#161627',
            title: {
                text: '领域发展水平—'+data.name,
                left: 'center',
                textStyle: {
                    color: '#eee',
                    fontSize: 24
                },
                subtextStyle: {
                    color: '#eee',
                    fontSize: 16
                }
            },
            legend: {
                bottom: 5,
                icon:"roundRect",
                data: data.legend,
                itemGap: 20,
                textStyle: {
                    color: '#eee',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor : 'rgba(19,181,221,0.2)'
            },
            radar: {
                indicator: data.indicator,
                shape: 'circle',
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: '#6ecce3',
                        fontSize:16
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(110, 204, 227, 0.1)', 'rgba(110, 204, 227, 0.2)',
                            'rgba(110, 204, 227, 0.4)', 'rgba(110, 204, 227, 0.6)',
                            'rgba(110, 204, 227, 0.8)', 'rgba(110, 204, 227, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(110, 204, 227, 0.5)'
                    }
                }
            },
            series: [
                {
                    name: data.legend[0],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[0],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }

                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#13b5dd'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: data.legend[1],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[1],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#7ceda5'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: data.legend[2],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[2],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#d6f571'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                }
            ]
        };

    myChart.setOption(option);
};

// echart_A03接口  儿童课程能力统计
function echart_A03_port() {
    var data={
            courseId:$("#course").val(),
            classId:$("#userClass03").val(),
            useruuid:$("#classMember03").val(),
            time: $("#year03").val() +"-"+$("#month03").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getStudentCourseAbility,param,echart_A03_callback);
};
function echart_A03_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        jsonAll03=data;
        var name=$("#classMember03").find("option:selected").text();
        echart_A03("email-content03",data,name);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
        jsonAll03=data;
        var name=$("#classMember03").find("option:selected").text();
        echart_A03("email-content03",data,name);
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function echart_A03(id,json,curName){
    var myChart = echarts.init(document.getElementById(id));

    var data={
            name:curName,
            indicator:[],
            legend:json.ExtraInfo,
            value:json.Val
    };

    for(var i=0;i<json.Name.length;i++){
        var aa={};
        aa.name=json.Name[i];
        aa.max=json.ValMax[i];
        data.indicator.push(aa);
    };

    var option={
            backgroundColor: '#161627',
            title: {
                text: '游戏与生活观察—'+data.name,
                left: 'center',
                textStyle: {
                    color: '#eee',
                    fontSize: 24
                },
                subtextStyle: {
                    color: '#eee'
                }
            },
            legend: {
                bottom: 5,
                icon:"roundRect",
                data: data.legend,
                itemGap: 20,
                textStyle: {
                    color: '#eee',
                    fontSize: 14
                }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor : 'rgba(19,161,221,0.2)'
            },
            radar: {
                indicator: data.indicator,
                shape: 'circle',
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: '#6ecce3',
                        fontSize:16
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(110, 204, 227, 0.1)', 'rgba(110, 204, 227, 0.2)',
                            'rgba(110, 204, 227, 0.4)', 'rgba(110, 204, 227, 0.6)',
                            'rgba(110, 204, 227, 0.8)', 'rgba(110, 204, 227, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(110, 204, 227, 0.5)'
                    }
                }
            },
            series: [
                {
                    name: data.legend[0],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[0],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#13b5dd'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: data.legend[1],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[1],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#7ceda5'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: data.legend[2],
                    type: 'radar',
                    data: [
                        {
                            value: data.value[2],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    },
                                    textStyle: {
                                        fontSize:16
                                    }
                                }
                            }
                        }
                    ],
                    itemStyle: {
                        normal: {
                            color: '#d6f571'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                }
            ]
        };

    myChart.setOption(option);
};


// echart_A02接口
function echart_A02_port() {
    var data={
            classId:$("#userClass01").val(),
            useruuid:user.userUuid,
            time: $("#year02").val() +"-"+$("#month02").val()
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassAbilibySimple,param,echart_A02_callback);
};
function echart_A02_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var data01={
                data:data
        };
        var html=template("email-content02_script",data01);
        $("#email-content02").empty().append(html);
    }else if(res.code==500){
        var data=JSON.parse(res.data);
    }else{
        // console.log('请求错误，返回code非200');
    }
};





















// 获取用户班级信息接口
function getUserClassInfo_port() {
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
        $("#userClass,#userClass01").append(html);

        // 默认第一班级的所有成员
        if(data.length>0){
            echart_A02_port();
            getClassStudentInfo_port(data[0].classId);
        };

        // 切换班级时成员接口切换
        $("#userClass").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port(classId);
        });

    }else{
        // console.log('请求错误，返回code非200');
    }
};
function getClassStudentInfo_port(classId) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassStudentInfo,param,getClassStudentInfo_callback);
};
function getClassStudentInfo_callback(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("classMember_script",{data});
        $("#classMember").empty().append(html);

        // 初始化echartA01
        echart_A01_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};


// 获取用户班级信息接口
function getUserClassInfo_port01() {
    var data={
            username:user.userUuid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getUserClassInfo,param,getUserClassInfo_callback01);
};
function getUserClassInfo_callback01(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("userClass_script",{data});
        $("#userClass03").append(html);

        // 默认第一班级的所有成员
        if(data.length>0){
            echart_A02_port();
            getClassStudentInfo_port01(data[0].classId);
        };

        // 切换班级时成员接口切换
        $("#userClass03").change(function () {
            var classId=$(this).val();
            getClassStudentInfo_port01(classId);
        });

    }else{
        // console.log('请求错误，返回code非200');
    }
};
function getClassStudentInfo_port01(classId) {
    var data={
            classId:classId
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getClassStudentInfo,param,getClassStudentInfo_callback01);
};
function getClassStudentInfo_callback01(res,tabIndex) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        var html=template("classMember_script",{data});
        $("#classMember03").empty().append(html);

        // 获取课程列表
        if($("#course").children().length ==0){
            getPersonCourse_port();
        }else{
            echart_A03_port();
        };
    }else{
        // console.log('请求错误，返回code非200');
    }
};

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
        var html=template("course_script",{data});
        $("#course").empty().append(html);

        echart_A03_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};