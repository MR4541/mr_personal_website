$(document).ready(function(){
    var from,to,count;
    var allow_repeat = false;

    function randomInteger(min, max) { //太扯了，js居然沒有隨機整數
        return Number(Math.floor(Math.random() * (Number(max) + 1 - min) )) + Number(min); //.floor=高斯符號
        //max不套number會變字串加法。。。
    };

    $("#start").click(function(){
        if(!Number.isInteger(Number($("#from").val())) || $("#from").val()=="") {alert("請輸入整數！");return;} //number.isIntergar不能測string，需先轉型別
        if(!Number.isInteger(Number($("#to").val())) || $("#to").val()=="") {alert("請輸入整數！");return;}
        if(!Number.isInteger(Number($("#count").val())) || $("#count").val()<1) {alert("請輸入整數/組數請輸入正整數！");return;}
        if(Number($("#from").val()) > Number($("#to").val())){ //防呆，一樣不套number會變成字串
            from=$("#to").val();
            to=$("#from").val();
            $("#to").val(to);
            $("#from").val(from);
        }else{
            from=$("#from").val();
            to=$("#to").val();
        }
        count=$("#count").val();
        allow_repeat = $("#repeat").prop("checked") ? true : false; //checkbox是否有被選取
        //清空當前html中結果
        $("#result").empty();
        //開始生結果
        if(allow_repeat){
            for(var i = 0; i < count; i++){
                $("#result").append("<div>"+randomInteger(from, to)+"</div>"); //在#result的內打上<div>num</div>，相當於新增子元素
            }
        }else if(!allow_repeat){
            var temp;
            var chosen=[];
            if(count > Number(to)-Number(from)+Number(1)){
                alert("沒有那麼多數可以不重複抽出！");
                return;
            }else{
                while(count>0){
                    temp = randomInteger(from, to);
                    if($.inArray(temp, chosen) != -1) continue;//已經抽過了，重抽！
                    chosen.push(temp);
                    $("#result").append("<div>"+temp+"</div>");
                    count--;
                }
            }
        }
    });
});//#document.ready