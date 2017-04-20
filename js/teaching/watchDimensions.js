var Arr=[];
$(function () {
    permission_port(loginSuccess);
});
function loginSuccess() {
    App.init();// 侧边树结构、loading载入
    watchDimensions_port();// 登入成功之后再回调执行函数,解决curCompanyId取不到的问题
    // 
    
}
function watchDimensions_port(pageNumber) {
    var data={
            companyid:user.curCompany.id
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.watchDimensions,param,watchDimensions_callback);
};
function watchDimensions_callback(res) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        Arr.length=0;
        Arr=tree2json(data);

        getDimLevelList_port(Arr[0].id);//默认查询第一项

        var html=template("trees_script",{data});
        $("#trees").empty().append(html);
        
        watchDimensions_after();
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function watchDimensions_after(){
    // 第一层级点击折叠效果函数
    $("#trees").on("click",'li.has-sub01 >a',function () {
        var e = $(this).next('.sub-menu01');
        var t = '#trees >ul >li.has-sub01 > .sub-menu01';
        $(t).not(e).slideUp(250);
        $(e).slideToggle(250);
        var dimId=$(e).attr("data-dimid");
        getDimLevelList_port(dimId);
    });

    addDim();// 添加维度执行函数区
    deleteDim();// 删除维度执行函数
    keepclick();// 右侧维度执行函数区
}

// 添加维度执行函数区
function addDim() {
    // 添加按钮功能
    $("#trees").on("click",'.maxAddBtn,li.addbtn',function () {
        $(this).prev('li.level01input').children('input').val('');
        $(this).prev('li.level01input').show();
        $(this).prev('li.level01input').children('input').focus();
    });

    // 最高层级input新增接口函数
    $("#trees >ul").on({
        blur:function () {
            var value=$(this).val();
            if(value){
                var param={
                        companyid:user.curCompany.id,
                        level:$(this).attr("data-level"),
                        name:value,
                        parentid:$(this).attr("data-parentid"),
                        type:''
                };
                // dimSave_port(param); 

            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimSave,
                data:{params:JSON.stringify(param)},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="has-sub01" data-dimid='+data.id+'  data-parentid='+data.parentid+' data-level='+data.level+' data-type='+data.type+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentid+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+
                                        '<b>&gt;</b>'+
                                    '</a>'+
                                    '<ul class="sub-menu01" data-dimid='+data.id+' data-level="1" data-type='+data.type+' style="display: none;">'+
                                        '<li class="level01input">'+
                                            '<input placeholder="请输入描述。。" type="text">'+
                                        '</li>'+
                                        '<li class="addbtn"></li>'+
                                    '</ul>'+
                                '</li>'
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });

            }else{
                $(this).parent(".level01input").hide();
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    },">li.level01input >input");

    // 第二层级input新增接口函数
    $("#trees").on({
        blur:function () {
            var value=$(this).val();
            var _self=$(this).parents("ul.sub-menu01").eq(0);
            if(value){
                var param={
                        companyid:user.curCompany.id,
                        level:_self.attr("data-level"),
                        name:value,
                        parentid:_self.attr("data-dimid"),
                        type:''//默认传空值
                };

            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimSave,
                data:{params:JSON.stringify(param)},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="has-sub02" data-dimid='+data.id+'  data-parentid='+data.parentid+' data-level='+data.level+' data-type='+data.type+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentid+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+'</a>'+
                                '</li>';
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });              
            }else{
                $(this).parent().hide();
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    },"ul.sub-menu01 >li.level01input input");

    // 第二层级点击显示右侧结构函数
    $("#trees").on("click","li.has-sub02 >a",function () {
        var dimId=$(this).attr("data-dimid");
        getDimLevelList_port(dimId);
        var newArr=[];
        $.each(Arr,function (i,value) {
            if(value.parentid==dimId){
                newArr.push(value)
            }
        });
        if(newArr.length>0){
            var html=template('treesmain_script',{newArr});
            $("#treesmain").empty().append(html);
        }else{
            var html='<ul class="tree-menu" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+'>'+
                        '<li class="leftArrow"></li>'+
                        '<li class="level01input">'+
                            '<input type="text" placeholder="请输入描述。。" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+'>'+
                        '</li>'+
                        '<li class="addsmall"></li>'+
                        '<li class="rightArrow"></li>'+
                    '</ul>';
            $("#treesmain").empty().append(html);
        }
    });
}


// 删除维度执行函数区
function deleteDim() {
    // 右键菜单事件 删除与编辑功能
    document.oncontextmenu=function (e) {return false;};
    document.onclick=function (e) {
        $("#menu").hide();
    };

    // 右侧树右键弹出菜单
    $("#trees").on("contextmenu","a",function (e) {
        var html='<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="delete">删除</li>'+
                    '<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="edit">'+
                        '<span class="editText">编辑</span>'+
                        '<input class="editInput" type="text" placeholder="请输入描述。。" data-dimid='+ $(this).attr("data-dimid")+' data-type='+ $(this).attr("data-type")+' data-parentid='+$(this).attr("data-parentid")+' data-level='+$(this).attr("data-level")+' data-name='+$(this).attr("data-name")+'>'
                    '</li>';
        $("#menu").empty().append(html).show();
        $("#menu li.edit input").val($(this).attr("data-name"));

        var menu = document.getElementById("menu");
        var e = e ||window.event;//兼容
        e.cancelBubble = true;
        //判断鼠标坐标是否大于视口宽度-块本身宽度
        var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
        var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
        menu.style.left = cakLeft + "px";
        menu.style.top = cakTop + "px";
    });
    // 左侧维度右键弹出菜单
    $("#treesmain").on("contextmenu","a",function (e) {
        var html='<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="delete">删除</li>'+
                    '<li data-dimid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+' class="edit">'+
                        '<span class="editText">编辑</span>'+
                        '<input class="editInput" type="text" placeholder="请输入描述。。" data-dimid='+ $(this).attr("data-dimid")+' data-type='+ $(this).attr("data-type")+' data-parentid='+$(this).attr("data-parentid")+' data-level='+$(this).attr("data-level")+' data-name='+$(this).attr("data-name")+'>'
                    '</li>';
        $("#menu").empty().append(html).show();
        $("#menu li.edit input").val($(this).attr("data-name"));

        var menu = document.getElementById("menu");
        var e = e ||window.event;//兼容
        e.cancelBubble = true;
        //判断鼠标坐标是否大于视口宽度-块本身宽度
        var cakLeft = (e.clientX > document.documentElement.clientWidth - menu.offsetWidth)?(document.documentElement.clientWidth - menu.offsetWidth):e.clientX;
        var cakTop = (e.clientY > document.documentElement.clientHeight - menu.offsetHeight)?(document.documentElement.clientHeight - menu.offsetHeight):e.clientY;
        menu.style.left = cakLeft + "px";
        menu.style.top = cakTop + "px";
    });

    // 删除维度接口函数
    $("#menu").on("click",'li.delete',function () {
        var type=$(this).attr("data-type");
        if(type=="0"){
            alert("非自定义维度为不可删除数据")
        }else{
            var dimid=$(this).attr("data-dimid");
            var i;
            $.each(Arr,function (index,value) {
                if(value.id==dimid){
                    i=index;
                }
            });
            
            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimDelete,
                data:{params:JSON.stringify({dimid:dimid})},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        _self.parent().hide();
                        Arr.splice(i,1);
                        var num=$("#wacthtree li[data-dimid="+dimid+"]").parent(".tree-menu").find(".list").length;
                        if(num==1){
                            $("#wacthtree li[data-dimid="+dimid+"]").parent("ul.tree-menu").remove();
                            $("#treesmain >ul.tree-menu[data-parentid="+dimid+"]").remove();
                        }else{
                            $("#treesmain >ul.tree-menu[data-parentid="+dimid+"]").remove();
                            $("#wacthtree li[data-dimid="+dimid+"]").remove();
                        }
                    }
                    if(res.code==500){
                        _self.parent().hide();
                        alert("此维度有子项，为保护数据，请先将子项删除才能删除此数据")
                    }
                },
                error:function (res) {
                    console.log(res);
                }
              });
        }
         
    });

    $("#menu").on("click",'li.edit >span',function (e) {
        stopBubble(e);//阻止冒泡
        $(this).hide();
        $(this).next("input").show().focus();
    });
    // 编辑维度接口函数
    $("#menu").on("focusout",'li.edit >input',function (e) {
        stopBubble(e);//阻止冒泡
        var type=$(this).attr("data-type");
        var name=$(this).val();

        if(name!=$(this).attr("data-name")){
            if(type=="0"){
                alert("非自定义维度为不可编辑数据");
            }else{
                var dimid=$(this).attr("data-dimid");
                var i;
                $.each(Arr,function (index,value) {
                    if(value.id==dimid){
                        i=index;
                    }
                });
            
                var param={
                        id:$(this).attr("data-dimid"),
                        companyid:user.curCompany.id,
                        name:$(this).val(),
                        parentid:$(this).attr("data-parentid"),
                        level:$(this).attr("data-level"),
                        type:$(this).attr("data-type")
                }
                var _self=$(this);
                $.ajax({
                    type:"POST",
                    url:httpUrl.dimUpdate,
                    data:{params:JSON.stringify(param)},
                    dataType:"json",
                    success:function (res) {
                        if(res.code==200){
                            Arr[i].name=name;
                            $("#wacthtree a[data-dimid="+dimid+"]").text(name).attr("data-name",name);
                            $("#menu").hide();
                        }
                    },
                    error:function (res) {
                        console.log(res);
                    }
                });
            }
        }else{
            $("#menu").hide();
        }
         
    }).on('keyup','li.edit >input',function (e){
        if(e.keyCode==13){
            $(this).blur();
        }
    });;   
}

// 右侧维度执行函数区
function keepclick() {
    $("#treesmain").on('click','li.list >a',function () {
        var level=Number($(this).attr("data-level"))+1;
        var num=$("#treesmain >ul");
        for(var i=0;i<num.length;i++){
            var level01=Number(num.eq(i).attr("data-level"));
            if(level01>=level){
                num.eq(i).remove();
            }
        };//清楚前面的ul函数区

        // 点击后添加样式
        $(this).parents(".tree-menu").children(".list").removeClass("current");
        $(this).parent(".list").addClass("current");

        var dimId=$(this).attr("data-dimid");
        getDimLevelList_port(dimId);
        var newArr=[];
        $.each(Arr,function (i,value) {
            if(value.parentid==dimId){
                newArr.push(value)
            }
        });

        if(newArr.length>0){
            var html=template('treesmain_script',{newArr});
            $("#treesmain").append(html);
        }else{
            var html='<ul class="tree-menu" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+'>'+
                        '<li class="leftArrow"></li>'+
                        '<li class="level01input">'+
                            '<input type="text" placeholder="请输入描述。。" data-level='+(Number($(this).attr("data-level"))+1)+' data-parentid='+$(this).attr("data-dimid")+' data-type='+$(this).attr("data-type")+'>'+
                        '</li>'+
                        '<li class="addsmall"></li>'+
                        '<li class="rightArrow"></li>'+
                    '</ul>'
            $("#treesmain").append(html);
        }
    });

    $("#treesmain").on('click','li.addsmall',function () {
        $(this).prev("li.level01input").show().find("input").val('').focus();
    });
    $("#treesmain").on('blur','li.level01input input',function () {
        var value=$(this).val();
        if(value){
            var param={
                    companyid:user.curCompany.id,
                    level:$(this).attr("data-level"),
                    name:value,
                    parentid:$(this).attr("data-parentid"),
                    type:''//默认传空值
            };
            
            var _self=$(this);
            $.ajax({
                type:"POST",
                url:httpUrl.dimSave,
                data:{params:JSON.stringify(param)},
                dataType:"json",
                success:function (res) {
                    if(res.code==200){
                        var data=JSON.parse(res.data);
                        var html='<li class="list" data-dimid='+data.id+'>'+
                                    '<a href="javascript:;" data-dimid='+data.id+'  data-parentid='+data.parentid+' data-level='+data.level+' data-type='+data.type+' data-name='+data.name+'>'+data.name+
                                    '</a>'
                                '</li>';
                        _self.parent().before(html);
                        _self.parent().hide();
                        Arr.push(data);
                    }
                },
                error:function (res) {
                    console.log(res);
                }
            });   
        }else{
            $(this).parent().hide();
        }
    }).on('keyup','li.level01input input',function (e){
        if(e.keyCode==13){
            $(this).blur();
        }
    });
}

// 新增维度接口
function dimSave_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dimSave,param,dimSave_callback);
};
function dimSave_callback(res) {
    if(res.code==200){
        var data01=JSON.parse(res.data);
        // watchDimensions_port();
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 删除维度接口
function dimDelete_port(dimid) {
    var data={
            dimid:dimid
    }
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.dimDelete,param,dimDelete_callback);
};
function dimDelete_callback(res) {
    if(res.code==200){
        // watchDimensions_port();
        // console.log(res);
    }else{
        // console.log('请求错误，返回code非200');
    }
};

// 树结构转平行json格式函数
function tree2json(Array) {
    var Arr = [];
    var tree2json01 = function(data){
        var obj;
        if(data){
            for(var i=0;i<data.length;i++){
                obj=data[i];
                Arr.push(obj);
                if(obj.childDimList){
                    obj=obj.childDimList;
                    tree2json01(obj);
                }else{
                    return;
                }
            }
        }
    }
    tree2json01(Array);
    return Arr;
}






//===================================================================================================================================










// 表现水平功能函数区
function getDimLevelList_port(dimid) {
    var data={
            dimid:dimid
        };
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.getDimLevelList,param,getDimLevelList_callback,dimid);
};
function getDimLevelList_callback(res,dimid) {
    if(res.code==200){
        var data=JSON.parse(res.data);
        // console.log(data);
        if(data.length>0){
            if(data[0].dimLevelList.length>0){
                var html=template('descTrees_script',{data});
                $("#descTrees").empty().append(html);
                getDimLevelList_after(); 
            }
        }else{
                var html='<ul style="width:2000px;">'+
                            '<li class="descListlast" data-dimid='+dimid+'></li>'+
                        '</ul>';
                $("#descTrees").empty().append(html);
                getDimLevelList_after();
            }
        
        
    }else{
        // console.log('请求错误，返回code非200');
    }
};
function getDimLevelList_after() {
    getDimLevelList_hover();
    // 新增观察维度水平描述接口函数
    $("#descTrees .descListlast").click(function () {
        var index=$("#descTrees .descList").length+1;
        var dimid=$(this).attr("data-dimid");
        var html='<li class="descList">'+
                    '<div class="descTitle">'+
                        '<span>表现水平'+index+'</span>'+
                        '<span class="closeBtn" data-id=\'\' data-dimid=\'\'></span>'+
                    '</div>'+
                    '<ul>'+
                        '<li class="descContext">'+
                            '<span data-id=\'\' data-dimid=\'\'></span>'+
                            '<span>></span>'+
                            '<input type="text" data-id=\'\' data-dimid='+dimid+' data-level=\'\' data-type=\'\' placeholder="请输入描述。。">'+
                        '</li>'+
                    '</ul>'+
                '</li>'
        $(this).before(html);
        $(this).prev(".descList").find("input").show().focus();
        getDimLevelList_hover();
    });
}
function getDimLevelList_hover(argument) {
    $("#descTrees li.descList").mouseover(function () {
        $(this).find("span.closeBtn").show();
    }).mouseout(function () {
        $(this).find("span.closeBtn").hide();
    }).dblclick(function () {
        $(this).find("input").text('').show().focus();
    });
    // 水平描述删除接口函授
    $("#descTrees .descList .closeBtn").click(function () {
         var data={
                levelId:$(this).attr("data-id")
         };
         var right=confirm("确认删除吗？");
         if(right){
            deleteDimLevel_port(data);
            $(this).parents('.descList').remove();

            // 之后添加判断条件 为0时不能删除
            // if($(this).attr("data-type")!="0"){
            //     deleteDimLevel_port(data);
            //     $(this).parents('.descList').remove();
            // }else{
            //     alert("非自定义表现水平为不可删除数据");
            // }
         };
         
    });
    // 水平描述编辑接口函数
    $("#descTrees .descList .descContext input").on({
        blur:function () {
            var id=$(this).attr("data-id");
            var value=$(this).val();
            if(id){
                if(value){
                    var data={
                            id:$(this).attr('data-id'),
                            description:$(this).val(),
                            dimid:$(this).attr("data-dimid"),
                            level:$(this).attr("data-level"),
                            type:''
                    };              
                    updateDimLevel_port(data);
                    $(this).hide();
                    $(this).parent(".descContext").children("span:first").text(value+'>');
                }else{
                    $(this).hide();
                }
            }else{
                if(value){
                    var data={
                            description:value,
                            dimid:$(this).attr("data-dimid"),
                            level:'',
                            type:0
                    }
                    saveDimLevel_port(data);
                    $(this).hide();
                    $(this).parent(".descContext").children("span:first").text(value+'>');
                }else{
                    $(this).parents('.descList').remove();
                }
            }
        },
        keyup:function (e) {
            if(e.keyCode==13){
                $(this).blur();
            }
        }
    });
}
// 水平描述新增接口函授
function saveDimLevel_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.saveDimLevel,param,saveDimLevel_callback);
};
function saveDimLevel_callback(res) {
    if(res.code==200){
        var dimid=JSON.parse(res.data).dimid;
        getDimLevelList_port(dimid);
        // console.log(res);
    }
}
// 水平描述编辑接口函数
function updateDimLevel_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.updateDimLevel,param,updateDimLevel_callback);
};
function updateDimLevel_callback(res) {
    if(res.code==200){
        // console.log(res);
    }
}
// 水平描述删除接口函授
function deleteDimLevel_port(data) {
    var param={
            params:JSON.stringify(data)
    };
    initAjax(httpUrl.deleteDimLevel,param,deleteDimLevel_callback);
};
function deleteDimLevel_callback(res) {
    if(res.code==200){
        // console.log(res);
    }
}
   

function stopBubble(e) { 
//如果提供了事件对象，则这是一个非IE浏览器 
    if ( e && e.stopPropagation ) 
    //因此它支持W3C的stopPropagation()方法 
    e.stopPropagation(); 
     else 
    //否则，我们需要使用IE的方式来取消事件冒泡 
    window.event.cancelBubble = true; 
} 
  
