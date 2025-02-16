// 生成所有可能的 4 位不重複數字組合computer
function generateAllCandidates() {
    let candidates = []; //array
    for (let a = 0; a < 10; a++)
        for (let b = 0; b < 10; b++)
            for (let c = 0; c < 10; c++)
                for (let d = 0; d < 10; d++)
                    if (new Set([a, b, c, d]).size === 4) //確保不重複
                        candidates.push(`${a}${b}${c}${d}`);
    return candidates;
}

// 計算 A 和 B 值
function getAB(guess, answer) {
    let A = 0, B = 0;
    for (let i = 0; i < 4; i++) {
        if (guess[i] === answer[i]) A++;
        else if (answer.includes(guess[i])) B++;
    }
    return [A, B];
}

// 根據回應過濾不符合的候選數字
function filterCandidates(candidates, guess, A, B) {
    return candidates.filter(num => {
        let [a, b] = getAB(guess, num); //只要AB數不符合guess,A,B組合的必不是正確答案
        return a === A && b === B;
    });
}

// 計算資訊熵
function calculateEntropy(responseCount, totalCount) {
    let entropy = 0;
    for (let count of Object.values(responseCount)) { //把resCnt的值全部抓出來變成arr
        let prob = count / totalCount;
        entropy -= prob * Math.log2(prob);
    }
    return entropy; //=sum( -P(x) * log_2(P(x)) )
}

// 選擇最佳猜測（Minimax + 資訊熵）
function chooseBestGuess(candidates) {
    let maxEntropy = -1; //entropy always >0
    let bestGuess = candidates[0];

    for (let guess of candidates) {
        let responseCount = {};
        
        //對於這個猜測，把所有候選答案按#A#B分組並統計各組數目
        for (let answer of candidates) {
            let key = getAB(guess, answer).join(","); //eg 2,1 = 2A1B
            responseCount[key] = (responseCount[key] || 0) + 1; //map?
        }
        
        //計算上述結果對應的熵
        let entropy = calculateEntropy(responseCount, candidates.length);
        if (entropy > maxEntropy) {
            maxEntropy = entropy;
            bestGuess = guess;
        }
    }
    return bestGuess;
}

/*用來吃AB輸入*/
function waitForUserInput_computer() {
    return new Promise(resolve => { //直到呼叫resolve(somthing)才會完成並回傳
        $("#computer_send").off("click").on("click", function () { //.off先解除之前的click事件，避免多次觸發
            let A = parseInt($("#computer_A").val(), 10) || 0;
            let B = parseInt($("#computer_B").val(), 10) || 0;
            if (A + B > 4 || A + B < 0 || A > 4 || A < 0 || B > 4 || B < 0) {
                alert("A, B輸入不合法，請重新輸入！");
                return;
            }
            resolve({ A, B });
        });
    });
}

// 遊戲執行函數
async function startGame_computer() {
    $("#start_button_computer").html("重新開始");
    $("#computer_record").html("");
    $(".player_computer").css("display", "flex");

    let candidates = generateAllCandidates();
    let guess = candidates[Math.floor(Math.random()*candidates.length)]; // 第一個隨便選一個猜
    let step = 0;
    
    while (true) {
        step++;
        var A, B;
        $("#computer_guess").html("電腦猜測：" + guess);
        ({ A, B } = await waitForUserInput_computer()); // 等待玩家輸入並取得 A, B
        
        // 過濾可能的數字
        candidates = filterCandidates(candidates, guess, A, B);
        
        $("#computer_record").html($("#computer_record").html() + `第${step}回 ${guess} 結果${A}A${B}B 剩餘${candidates.length}組可能<br>`)
        
        if (candidates.length == 0){
            alert("資訊有誤；不可能有解！");
            break;
        }
        
        if (A === 4) {
            alert(`用了 ${step} 次猜到正確答案 ${guess}！`);
            break;
        }
        
        // 選擇下一個最佳猜測
        guess = chooseBestGuess(candidates);
    }
    //結束後只留下record，其他再次隱藏
    $(".player_computer").hide();
    $("#start_button_computer").parent().css("display", "flex");
    $("#computer_record").parent().css("display", "flex");
}

function testEfficient(){
    let N = prompt("輸入測試回數：");
    let stepSum = 0;
    for(let i = 0; i < N; i++){
        let candidates = generateAllCandidates();
        let guess = "1234"; // 第一個猜測
        let step = 0;

        let answer = candidates[Math.floor(Math.random()*candidates.length)]; //隨機選答案
    
        while (true) {
            step++;
            let input = getAB(guess, answer).join(" ");
            if (!input) break; // 如果按取消則結束遊戲
            let [A, B] = input.split(" ").map(Number);
    
            if (A === 4) {
                console.log(`TEST ${i}: answer ${answer} found in ${step} steps\n`);
                stepSum += step;
                break;
            }
    
            // 過濾可能的數字
            candidates = filterCandidates(candidates, guess, A, B);
    
            // 選擇下一個最佳猜測
            guess = chooseBestGuess(candidates);
        }
    }
    console.log(`--------\nOUTCOME\nN : ${N}\navg step : ${Math.round(10000*stepSum/N)/10000}\n`);
}

/*
    END of 1a2b - computer
*/

function updateInputFields(){
    const selectedPlayer = $("#playerSelect").val();
    $(".div_group").hide();
    if(selectedPlayer == "human"){
        $(".player_human").hide();
        $("#start_button_human").parent().css("display", "flex");
        $("#start_button_human").html("開始");
    }else if(selectedPlayer == "computer"){
        $(".player_computer").hide();
        $("#start_button_computer").parent().css("display", "flex");
        $("#start_button_computer").html("開始");
    }else{
        alert("ERROR: invalid value of #playerSelect");
    }
}

document.addEventListener("DOMContentLoaded", updateInputFields);//載入頁面時預設觸發
window.addEventListener("pageshow", updateInputFields);//按返回鍵時預設觸發

/*
    END of updateInputFields
*/

function waitForUserInput_human() {
    return new Promise(resolve => { //直到呼叫resolve(somthing)才會完成並回傳
        $("#human_send").off("click").on("click", function () { //.off先解除之前的click事件，避免多次觸發
            let guess = $("#human_guess_input").val() || "0123";
            if(guess.length != 4 || new Set(guess.split("")).size !== 4 || parseInt(guess, 10) > 9876 || parseInt(guess, 10) < 123 || isNaN(parseInt(guess, 10))){ //把每一位都切開來看set size
                alert("輸入不符合規則！");
                return;
            }
            resolve(guess);
        });
    });
}

async function startGame_human(){
    $("#start_button_human").html("重新開始");
    $("#human_record").html("");
    $(".player_human").css("display", "flex");
    $("#human_respond").html("上次猜測結果：");

    let candidates = generateAllCandidates();
    let answer = candidates[Math.floor(Math.random()*candidates.length)]; // 隨便選一個當答案
    let step = 0;
    
    while (true) {
        step++;
        var guess;
        (guess = await waitForUserInput_human()); // 等待玩家輸入並取得 A, B
        
        let AB = getAB(guess, answer);

        $("#human_record").html($("#human_record").html() + `第${step}回 ${guess} 結果${AB[0]}A${AB[1]}B<br>`)
        $("#human_respond").html(`上次猜 ${guess} 結果 ${AB[0]}A${AB[1]}B`)

        if (AB[0] === 4) {
            alert(`恭喜！！！\n您用了 ${step} 次猜到正確答案 ${guess}！`);
            break;
        }
    }
    //結束後只留下record，其他再次隱藏
    $(".player_human").hide();
    $("#start_button_human").parent().css("display", "flex");
    $("#human_record").parent().css("display", "flex");
}

/*
    END of 1a2b - human
*/