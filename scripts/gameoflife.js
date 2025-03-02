let WIDTH = 50, HEIGHT = 50;

let liveCells = new Set();  // 只存、檢查活細胞及其附近
function key(x, y) { return `${x},${y}`; }  // 轉成 Set 可存的 key
let dxy = [[1,1], [1,0], [1,-1], [0,1], [0,-1], [-1,1], [-1,0], [-1,-1]];

function outOfBound(x, y){
    return (x < 0) || (y < 0) || (x >= WIDTH) || (y >= HEIGHT);
}

function getNextState() {
    let newLiveCells = new Set();
    let checkCells = new Set();  // 可能復活的、需要檢查的細胞（活細胞+鄰居）

    for (let cell of liveCells) { //先看哪些活細胞還活著
        let [x, y] = cell.split(',').map(Number);
        if(outOfBound(x, y)) continue;
        let neighbors = 0;

        for (let [dx, dy] of dxy){ //count neighbors
            if (liveCells.has(key(x+dx, y+dy))) neighbors++;
            checkCells.add(key(x+dx, y+dy));
        }

        // 活細胞維持存活條件
        if (neighbors === 2 || neighbors === 3) {
            newLiveCells.add(cell);
        }
    }

    // 檢查「可能復活的細胞」（其實就是所有liveCells的周圍）
    for (let cell of checkCells) {
        if (liveCells.has(cell)) continue; // 已經是活細胞，略過
        let [x, y] = cell.split(',').map(Number);
        if(outOfBound(x, y)) continue;
        let neighbors = 0;

        for (let [dx, dy] of dxy){ //count neighbors
            if (liveCells.has(key(x+dx, y+dy))) neighbors++;
            checkCells.add(key(x+dx, y+dy));
        }

        if (neighbors === 3) {
            newLiveCells.add(cell);
        }
    }
    
    liveCells = newLiveCells;
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
console.log("aaa");
let CELL_SIZE = Math.min(window.innerWidth*0.8/WIDTH, window.innerHeight*0.8/HEIGHT); //細胞大小
canvas.width = HEIGHT*CELL_SIZE;
canvas.height = WIDTH*CELL_SIZE;

function drawCanvas(){ //print it on html element
    ctx.clearRect(0, 0, canvas.width, canvas.height); //清除畫布
    ctx.fillStyle = "black"; //活細胞顏色
    for(let cell of liveCells){
        let [x, y] = cell.split(",").map(Number);
        ctx.fillRect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE); //draw
    }
    //畫格線
    ctx.strokeStyle = "#ddd"; // 格線顏色（淺灰色）
    ctx.lineWidth = 1;  
    // 畫垂直線
    for (let x = 0; x <= WIDTH * CELL_SIZE; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT * CELL_SIZE);
        ctx.stroke();
    }

    // 畫水平線
    for (let y = 0; y <= HEIGHT * CELL_SIZE; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH * CELL_SIZE, y);
        ctx.stroke();
    }
}

canvas.addEventListener("click", (event) => { //讓用戶自訂格子狀態
    // 計算點擊對應的格子座標
    let x = Math.floor(event.offsetX / CELL_SIZE);
    let y = Math.floor(event.offsetY / CELL_SIZE);
    let cellKey = `${x},${y}`;

    // 切換細胞狀態（活 -> 死, 死 -> 活）
    if (liveCells.has(cellKey)) {
        liveCells.delete(cellKey); // 變成死亡
    } else {
        liveCells.add(cellKey); // 變成存活
    }

    drawCanvas(); // 重新繪製畫面
});

function updateCanvas() {
    let _WIDTH = parseInt(document.getElementById("width").value) || 50;
    let _HEIGHT = parseInt(document.getElementById("height").value) || 50;
    if(_WIDTH <= 0 || _HEIGHT <= 0 || isNaN(_WIDTH) || isNaN(_HEIGHT)){
        alert("寬高值請輸入正整數！");
        return;
    }
    let sleepS = parseFloat(document.getElementById("sleepS").value) || 0.1;
    if(sleepS <= 0 || isNaN(sleepS)){
        alert("更新時間請輸入正數！");
        return;
    }
    sleepMs = sleepS * 1000;
    let randomLightDensity = (parseInt(document.getElementById("randomLight").value) || 0)/100;
    if(randomLightDensity < 0 || randomLightDensity > 1){
        alert("密度請輸入0-100的整數！");
        return;
    }
    WIDTH = _WIDTH; HEIGHT = _HEIGHT;
    //screen.w/h 是使用者螢幕大小（window.inner- 是視窗大小）
    CELL_SIZE = Math.min(window.innerWidth*0.8/WIDTH, window.innerHeight*0.8/HEIGHT);
    canvas.width = WIDTH*CELL_SIZE;
    canvas.height = HEIGHT*CELL_SIZE;
    console.log("NEW CELL_SIZE:", CELL_SIZE);
    console.log(`current windows size: ${window.innerWidth} * ${window.innerHeight}`);

    //randomplace
    if(randomLightDensity > 0){ //light blocks randomly
        for(let x = 0; x < WIDTH; x++){
            for(let y = 0; y < HEIGHT; y++){
                let key = `${x},${y}`;
                if(!liveCells.has(key) && Math.random() < randomLightDensity)
                    liveCells.add(key);
            }
        }
    }

    drawCanvas();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", ()=>{
    console.log(toggleButton.dataset.running);
    if(toggleButton.dataset.running == "true"){
        toggleButton.textContent = "開始";
        toggleButton.dataset.running = "false";
    }else{
        toggleButton.textContent = "暫停";
        toggleButton.dataset.running = "true";
    }
});

let sleepMs = 100;

async function startGame(){
    console.log("loop");
    drawCanvas();
    if(toggleButton.dataset.running == "true") getNextState();
    await sleep(sleepMs);
    startGame();
}

//高斯帕機槍
liveCells.add(key(1, 5));
liveCells.add(key(1, 6));
liveCells.add(key(2, 5));
liveCells.add(key(2, 6));
liveCells.add(key(11, 5));
liveCells.add(key(11, 6));
liveCells.add(key(11, 7));
liveCells.add(key(12, 4));
liveCells.add(key(12, 8));
liveCells.add(key(13, 3));
liveCells.add(key(13, 9));
liveCells.add(key(14, 3));
liveCells.add(key(14, 9));
liveCells.add(key(15, 6));
liveCells.add(key(16, 4));
liveCells.add(key(16, 8));
liveCells.add(key(17, 5));
liveCells.add(key(17, 6));
liveCells.add(key(17, 7));
liveCells.add(key(18, 6));
liveCells.add(key(21, 3));
liveCells.add(key(21, 4));
liveCells.add(key(21, 5));
liveCells.add(key(22, 3));
liveCells.add(key(22, 4));
liveCells.add(key(22, 5));
liveCells.add(key(23, 2));
liveCells.add(key(23, 6));
liveCells.add(key(25, 1));
liveCells.add(key(25, 2));
liveCells.add(key(25, 6));
liveCells.add(key(25, 7));
liveCells.add(key(35, 3));
liveCells.add(key(35, 4));
liveCells.add(key(36, 3));
liveCells.add(key(36, 4));

startGame();