$(document).ready(function(){
    var operation = ""; //鍵盤輸入等待計算的字串
    var history = ""; //計算歷史紀錄

    //把被按的按鍵添加到字串中
    $("#zero").click(function(){
        operation = operation + "0";
        $("#calculating").html(operation);
    });
    $("#one").click(function(){
        operation = operation + "1";
        $("#calculating").html(operation); //把改變更新到畫面
    });
    $("#two").click(function(){
        operation = operation + "2";
        $("#calculating").html(operation);
    });
    $("#three").click(function(){
        operation = operation + "3";
        $("#calculating").html(operation);
    });
    $("#four").click(function(){
        operation = operation + "4";
        $("#calculating").html(operation);
    });
    $("#five").click(function(){
        operation = operation + "5";
        $("#calculating").html(operation);
    });
    $("#six").click(function(){
        operation = operation + "6";
        $("#calculating").html(operation);
    });
    $("#seven").click(function(){
        operation = operation + "7";
        $("#calculating").html(operation);
    });
    $("#eight").click(function(){
        operation = operation + "8";
        $("#calculating").html(operation);
    });
    $("#nine").click(function(){
        operation = operation + "9";
        $("#calculating").html(operation);
    });
    $("#plus").click(function(){
        operation = operation + "+";
        $("#calculating").html(operation);
    });
    $("#minus").click(function(){
        operation = operation + "-";
        $("#calculating").html(operation);
    });
    $("#time").click(function(){
        operation = operation + "*";
        $("#calculating").html(operation);
    });
    $("#divide").click(function(){
        operation = operation + "/";
        $("#calculating").html(operation);
    });
    $("#dot").click(function(){
        operation = operation + ".";
        $("#calculating").html(operation);
    });
    $("#left_par").click(function(){
        operation = operation + "(";
        $("#calculating").html(operation);
    });
    $("#right_par").click(function(){
        operation = operation + ")";
        $("#calculating").html(operation);
    });
    //退格鍵
    $("#backspace").click(function(){
        operation = operation.substring(0, operation.length-1); //因為原字串的索引值是0~len-1,取[0, len-1) <-不含[len-1] 正好符合所需
        $("#calculating").html(operation);
        if(operation.length == 0) $("#calculating").html("0"); //為了避免空字串時無顯示   
    });
    //兩種清除鍵
    $("#clear_present").click(function(){
        operation = "";
        $("#calculating").html("0");
    });
    $("#clear_all").click(function(){
        operation = "";
        history = "";
        $("#history").html("尚無計算紀錄");
        $("#calculating").html("0");
    });
    //等號鍵
    $("#equal").click(function(){
        try{
            var ans = eval(operation);
            if(ans=Infinity) throw "Expression could not be evaluated";
            if(isNaN(ans)) throw "Expression could not be evaluated"; //是否「不是」一個有效的數字; throw完try部分就結束運行了
            ans = Math.round(ans*1e8)/1e8; //四捨五入到小數點後八位
            history = history + "<br>" + operation + " = " + ans;
            $("#history").html(history);
            operation = "";
            $("#calculating").html("0");
        } catch (error){ //表示捕獲到try區域中的執行異常
            alert("無效算式！請再檢查算式！\n以下是常見錯誤：\n1.括號前未加運算符號，如5(1+2)\n2.未輸入即送出\n3.除數為0\n4.你只是不會小學數學");
        }
        
        
    });
    
});//#document.ready