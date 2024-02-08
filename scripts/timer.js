$(document).ready(function(){
    var hh,mm,ss; //時分秒
    var working = false; //是否正在倒數計時

    function show_time(){ //把改變更新到頁面上
        $("#hour").val(hh);
        $("#minute").val(mm);
        $("#second").val(ss);
    };

    function reset(){
        hh=0;
        mm=0;
        ss=0;
        $("#hour").val("00");
        $("#minute").val("00");
        $("#second").val("00");
    };

    function timepass(){
        if(working==false) return; //只有working==true才執行此函式
        if(ss==0 &&(mm==0 && hh==0)){
            alert("時間到！");
            working=false;
            reset();
            $("#start_stop").html("開始");
            $("#reset_cancel").html("重置");
            $("#text").html("剩餘時間");
            $("#div_timer").css("background-color","#DBE2EF");
            $("#start_stop").css("background-color","#DBE2EF");
            $("#reset_cancel").css("background-color","#DBE2EF");
        }else if(ss==0 && mm==0){
            hh--;
            ss=59;
            mm=59;
            show_time();
        }else if(ss==0){
            mm--;
            ss=59;
            show_time();
        }else{
            ss--;
            show_time();
        }
    };

    var intervalID = setInterval(timepass,1000);//每過1000ms執行一次函式，function不可以加()

    //輸入
    $("#start_stop").click(function(){
        if(working == false){ //如果沒在倒數計時
            if(($("#hour").val()<0 || $("#minute").val()<0) || $("#second").val()<0) {alert("請輸入有效時間！"); reset();}
            else if(($("#hour").val()==0 && $("#minute").val()==0) && $("#second").val()==0) { alert("請輸入有效時間！"); reset();}
            else{ //輸入
                ($("#hour").val()>99)? hh = 99 : hh = Math.round($("#hour").val());
                ($("#minute").val()>59)? mm = 59 : mm = Math.round($("#minute").val());
                ($("#second").val()>59)? ss = 59 : ss = Math.round($("#second").val());
                show_time();
                working=true;//timepass開始可以跑
                $("#start_stop").html("暫停");
                $("#reset_cancel").html("取消");
                $("#text").html("剩餘時間");
                $("#div_timer").css("background-color","rgb(232, 191, 191)");
                $("#start_stop").css("background-color","rgb(232, 191, 191)");
                $("#reset_cancel").css("background-color","rgb(232, 191, 191)");
                
            }
        }else if(working == true){
            working=false;
            $("#start_stop").html("開始");
            $("#reset_cancel").html("重置");
            $("#text").html("輸入時間");
            $("#div_timer").css("background-color","#DBE2EF");
            $("#start_stop").css("background-color","#DBE2EF");
            $("#reset_cancel").css("background-color","#DBE2EF");
        }
    });
    //重置/取消
    $("#reset_cancel").click(function(){
        reset();
        if(working==true){
            working=false;
            $("#start_stop").html("開始");
            $("#reset_cancel").html("重置");
            $("#text").html("輸入時間");
            $("#div_timer").css("background-color","#DBE2EF");
            $("#start_stop").css("background-color","#DBE2EF");
            $("#reset_cancel").css("background-color","#DBE2EF");
        }
    });

});//document.ready