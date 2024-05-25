$(document).ready(function(){
    var chinCount = 0;//漢字數
    var eng_numCount = 0;//英文字母數+數字
    var chin_puncCount = 0;//中文和全形標點等萬國碼編號非兩碼者
    var numCount = 0//數字數
    var wordCount = 0;//英文單詞數
    var boolword = false;//當前字元是否為英文單字，每次false->true，wordCnt++
    var words = "";//存輸入的字串

    //不加觸發條件：頁面一加載立刻執行
    $("#input").on('input', function(){ //on.input：一有輸入就執行；宣告一個函數，處理textarea的字數統計
        chinCount = 0;//漢字數
        eng_numCount = 0;//英文字母數
        chin_puncCount = 0;//中文和全形標點等萬國碼編號非兩碼者
        numCount = 0//數字數
        wordCount = 0;
        boolword = false;

        words = $("#input").val();
        for(i=0; i<words.length; i++){
            var tmp = words.charAt(i); //取出位置i的字符，類似陣列
            if(tmp.match(/[\u4e00-\u9fcb]/)){ //以正則表達式＋match判斷字符種類，此為漢字範圍
                chinCount++;
            }
            if(tmp.match(/[^\x00-\xff]/)){ //編號非雙字節：不是英文和數字，即漢字或全形標點
                chin_puncCount++;
            }else{
                eng_numCount++;
            }
            if(tmp.match(/[0-9]/)){ //數字
                numCount++;
            }
            if(tmp.match(/[\u0041-\u005a]|[\u0061-\u007a]/)){ //計算單字數
                if(!boolword) wordCount++;//進入一個新的單字
                boolword = true;
            }else if(tmp.match(/[0-9]/) && boolword){//如is567lam只看成一個單字
                boolword = true;
            }else{
                boolword = false;
            }
        }
        //更新統計數字
        $("#allCnt").text(chin_puncCount+eng_numCount);
        $("#chinCnt").text(chinCount);
        $("#puncCnt").text(chin_puncCount-chinCount);
        $("#engCnt").text(eng_numCount-numCount);
        $("#enWordCnt").text(wordCount);
        $("#numCnt").text(numCount);
    });

});//document.ready