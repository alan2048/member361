var blue="#348fe2",blueLight="#5da5e8",blueDark="#1993E4",aqua="#49b6d6",aquaLight="#6dc5de",aquaDark="#3a92ab",green="#13b5dd",greenLight="#33bdbd",greenDark="#008a8a",orange="#f59c1a",orangeLight="#f7b048",orangeDark="#c47d15",dark="#2d353c",grey="#b6c2c9",purple="#727cb6",purpleLight="#8e96c5",purpleDark="#5b6392",red="#ff5b57";var handleVectorMap=function(){"use strict";if($("#world-map").length!==0){$("#world-map").vectorMap({map:"world_mill_en",scaleColors:["#e74c3c","#0071a4"],normalizeFunction:"polynomial",hoverOpacity:.5,hoverColor:false,markerStyle:{initial:{fill:"#4cabc7",stroke:"transparent",r:3}},regionStyle:{initial:{fill:"rgb(97,109,125)","fill-opacity":1,stroke:"none","stroke-width":.4,"stroke-opacity":1},hover:{"fill-opacity":.8},selected:{fill:"yellow"},selectedHover:{}},focusOn:{x:.5,y:.5,scale:0},backgroundColor:"#2d353c",markers:[{latLng:[41.9,12.45],name:"Vatican City"},{latLng:[43.73,7.41],name:"Monaco"},{latLng:[-.52,166.93],name:"Nauru"},{latLng:[-8.51,179.21],name:"Tuvalu"},{latLng:[43.93,12.46],name:"San Marino"},{latLng:[47.14,9.52],name:"Liechtenstein"},{latLng:[7.11,171.06],name:"Marshall Islands"},{latLng:[17.3,-62.73],name:"Saint Kitts and Nevis"},{latLng:[3.2,73.22],name:"Maldives"},{latLng:[35.88,14.5],name:"Malta"},{latLng:[12.05,-61.75],name:"Grenada"},{latLng:[13.16,-61.23],name:"Saint Vincent and the Grenadines"},{latLng:[13.16,-59.55],name:"Barbados"},{latLng:[17.11,-61.85],name:"Antigua and Barbuda"},{latLng:[-4.61,55.45],name:"Seychelles"},{latLng:[7.35,134.46],name:"Palau"},{latLng:[42.5,1.51],name:"Andorra"},{latLng:[14.01,-60.98],name:"Saint Lucia"},{latLng:[6.91,158.18],name:"Federated States of Micronesia"},{latLng:[1.3,103.8],name:"Singapore"},{latLng:[1.46,173.03],name:"Kiribati"},{latLng:[-21.13,-175.2],name:"Tonga"},{latLng:[15.3,-61.38],name:"Dominica"},{latLng:[-20.2,57.5],name:"Mauritius"},{latLng:[26.02,50.55],name:"Bahrain"},{latLng:[.33,6.73],name:"São Tomé and Príncipe"}]})}};var handleInteractiveChart=function(){"use strict";function e(e,t,n){$('<div id="tooltip" class="flot-tooltip">'+n+"</div>").css({top:t-45,left:e-55}).appendTo("body").fadeIn(200)}if($("#interactive-chart").length!==0){var t=[[11964728e5,30],[11971548e5,44],[11972412e5,55],[1197414e6,71],[1197846e6,65],[11979324e5,87],[11985372e5,67],[11986236e5,90],[11992284e5,110],[11993148e5,130],[11994876e5,100],[11999196e5,105],[12000924e5,110],[12001788e5,120],[12006108e5,130],[120087e7,135],[1201302e6,145],[12015612e5,132],[12019932e5,123],[12020796e5,135],[12022524e5,150],[12026844e5,145],[12029436e5,133],[12036212e5,145]];var n=[[11964728e5,5],[11972412e5,6],[1197414e6,10],[1197846e6,12],[11980188e5,18],[11985372e5,20],[11987964e5,25],[11992284e5,23],[11994876e5,24],[11999196e5,25],[12001788e5,18],[12006108e5,30],[120087e7,25],[1201302e6,25],[12015612e5,30],[12020796e5,27],[12022524e5,20],[12026844e5,18],[12029436e5,31],[1203462e6,23],[12036212e5,30]];$.plot($("#interactive-chart"),[{data:t,label:"Page Views",color:purple,lines:{show:true,fill:false,lineWidth:1.5},points:{show:false,radius:5,fillColor:"#fff"},shadowSize:0},{data:n,label:"Visitors",color:green,lines:{show:true,fill:false,lineWidth:1.5,fillColor:""},points:{show:false,radius:3,fillColor:"#fff"},shadowSize:0}],{xaxis:{mode:"time",ticks:15,tickDecimals:0,tickColor:"rgba(0,0,0,0.2)"},yaxis:{tickColor:"rgba(0,0,0,0.2)",ticks:5},grid:{hoverable:true,clickable:true,tickColor:"rgba(0,0,0,0.2)",borderWidth:1,backgroundColor:"#fafafa",borderColor:"#ddd"},legend:{labelBoxBorderColor:"#ddd",margin:10,noColumns:1,show:true}});var r=null;$("#interactive-chart").bind("plothover",function(t,n,i){$("#x").text(n.x.toFixed(2));$("#y").text(n.y.toFixed(2));if(i){if(r!==i.dataIndex){r=i.dataIndex;$("#tooltip").remove();var s=i.datapoint[1].toFixed(2);var o=i.series.label+" "+s;e(i.pageX,i.pageY,o)}}else{$("#tooltip").remove();r=null}t.preventDefault()})}};var handleDonutChart=function(){"use strict";if($("#donut-chart").length!==0){var e=[{label:"Chrome",data:35,color:purpleDark},{label:"Firefox",data:30,color:purple},{label:"Safari",data:15,color:purpleLight},{label:"Opera",data:10,color:blue},{label:"IE",data:5,color:blueDark}];$.plot("#donut-chart",e,{series:{pie:{innerRadius:.5,show:true,label:{show:true}}},legend:{show:true}})}};var handleDashboardSparkline=function(){"use strict";function t(){var t=[50,30,45,40,50,20,35,40,50,70,90,40];e.type="line";e.height="23px";e.lineColor=red;e.highlightLineColor=red;e.highlightSpotColor=red;var n=$("#sparkline-unique-visitor").width();if(n>=200){e.width="200px"}else{e.width="100%"}$("#sparkline-unique-visitor").sparkline(t,e);e.lineColor=orange;e.highlightLineColor=orange;e.highlightSpotColor=orange;$("#sparkline-bounce-rate").sparkline(t,e);e.lineColor=green;e.highlightLineColor=green;e.highlightSpotColor=green;$("#sparkline-total-page-views").sparkline(t,e);e.lineColor=blue;e.highlightLineColor=blue;e.highlightSpotColor=blue;$("#sparkline-avg-time-on-site").sparkline(t,e);e.lineColor=grey;e.highlightLineColor=grey;e.highlightSpotColor=grey;$("#sparkline-new-visits").sparkline(t,e);e.lineColor=dark;e.highlightLineColor=dark;e.highlightSpotColor=grey;$("#sparkline-return-visitors").sparkline(t,e)}var e={height:"50px",width:"100%",fillColor:"transparent",lineWidth:2,spotRadius:"4",highlightLineColor:blue,highlightSpotColor:blue,spotColor:false,minSpotColor:false,maxSpotColor:false};t();$(window).on("resize",function(){$("#sparkline-unique-visitor").empty();$("#sparkline-bounce-rate").empty();$("#sparkline-total-page-views").empty();$("#sparkline-avg-time-on-site").empty();$("#sparkline-new-visits").empty();$("#sparkline-return-visitors").empty();t()})};var handleDashboardDatepicker=function(){"use strict";$("#datepicker-inline").datepicker({todayHighlight:true})};var handleDashboardTodolist=function(){"use strict";$("[data-click=todolist]").click(function(){var e=$(this).closest("li");if($(e).hasClass("active")){$(e).removeClass("active")}else{$(e).addClass("active")}})};var handleDashboardGritterNotification=function(){$(window).load(function(){setTimeout(function(){$.gritter.add({title:"Welcome back, Admin!",text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus lacus ut lectus rutrum placerat.",image:"assets/img/user-2.jpg",sticky:true,time:"",class_name:"my-sticky-class"})},1e3)})};var Dashboard=function(){"use strict";return{init:function(){handleDashboardGritterNotification();handleInteractiveChart();handleDashboardSparkline();handleDonutChart();handleDashboardTodolist();handleVectorMap();handleDashboardDatepicker()}}}()