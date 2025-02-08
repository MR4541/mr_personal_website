function updateInputFields(){
    const selectedFunction = document.getElementById("functionSelect").value;
    document.querySelectorAll(".input_group").forEach(group => {
        group.style.display = "none";
    }) //把每個有該class的成員都隱藏
    //顯示檔案輸入的按鈕
    document.getElementById("fileInput").parentElement.parentElement.style.display = "flex";
    document.getElementById("uploadButton").parentElement.style.display = "flex";
    //顯示對應輸入欄位
    if(selectedFunction == "extend"){
        document.querySelector(".function_extend").style.display = "flex";
    }else if(selectedFunction == "convert"){
        document.querySelector(".function_convert").style.display = "flex";
    }else if(selectedFunction == "grayscale"){
        document.querySelector(".function_grayscale").style.display = "flex";
    }else{
        alert("frontend js error!");
    }
} //updateInputFields()
document.addEventListener("DOMContentLoaded", updateInputFields);//載入頁面時預設觸發
window.addEventListener("pageshow", updateInputFields);//按返回鍵時預設觸發


//選擇fetchURL前面是localhost還是gcp
function makeFetchUrl(reqpath, isLocalhost){
    if(isLocalhost){
        return "http://localhost:8080" + reqpath;
    }else{
        return "http://34.83.158.232:8080" + reqpath;
    }
}

//把回傳URL從localhost改成GCP
function localhostToGCP(url){
    var filename = url.substring(url.lastIndexOf('/')+1);
    return "http://34.83.158.232:8080/processed/" + filename;
}

async function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("請選擇圖片");
        return;
    }
    
    //顯示「處理中」訊息
    let waiting_group = document.querySelector(".waiting_group");
    waiting_group.style.display = "flex";
    
    const selectedFunction = document.getElementById("functionSelect").value;
    if(selectedFunction == "extend"){
        let formData = new FormData();
        var outputFile = fileInput.files[0].name;
        formData.append("image", fileInput.files[0], fileInput.files[0].name);
        formData.append("outputFile", outputFile);
        let widthRatio = Number(document.getElementById("width").value);
        let heightRatio = Number(document.getElementById("height").value);
        if(!Number.isInteger(widthRatio) || !Number.isInteger(heightRatio) || widthRatio <= 0 || heightRatio <= 0){
            alert("寬、高請輸入大等於1的整數值!");
            return;
        }
        formData.append("widthRatio", widthRatio);
        formData.append("heightRatio", heightRatio);
        if(document.getElementById("alpha").value != ""){
            let alphaChannel = Number(document.getElementById("alpha").value);
            if(!Number.isInteger(alphaChannel) || alphaChannel < 0 || alphaChannel > 255){
                alert("透明度請輸入0-255的整數值或是留空!")
                return;
            }
            formData.append("alpha", alphaChannel);
        }else{
            formData.append("alpha", 255);
        }
        let colorCode = String(document.getElementById("color").value);
        formData.append("R", parseInt(colorCode.substring(1, 3), 16)); //擷取十六進位字串並轉成數字
        formData.append("G", parseInt(colorCode.substring(3, 5), 16)); //擷取十六進位字串並轉成數字
        formData.append("B", parseInt(colorCode.substring(5, 7), 16)); //擷取十六進位字串並轉成數字
        var response = await fetch(makeFetchUrl("/imgProcess/extend", false), { //GCP external ID + port = 8080
            method: "POST",
            body: formData
        });
    }else if(selectedFunction == "convert"){
        let formData = new FormData();
        formData.append("image", fileInput.files[0], fileInput.files[0].name); //把filename傳給後端不然會變成亂碼
        //處理outputFile
        let split = fileInput.files[0].name.split('.');
        split.pop();
        var outputFile = split + "." + document.getElementById("format").value; //ppm/pgm交給c++處理
        formData.append("outputFile", outputFile);
        var response = await fetch(makeFetchUrl("/imgProcess/convert",false), {
            method: "POST",
            body: formData
        });
    }else if(selectedFunction == "grayscale"){
        let formData = new FormData();
        var outputFile = fileInput.files[0].name;
        formData.append("image", fileInput.files[0], fileInput.files[0].name);
        formData.append("outputFile", outputFile);
        var response = await fetch(makeFetchUrl("/imgProcess/grayscale",false), {
            method: "POST",
            body: formData
        });
    }else{
        alert("frontend js error!");
        return;
    }

    if (response.ok) {
        waiting_group.style.display = "none";
        let result = await response.json();
        document.querySelectorAll(".output_group").forEach(group => {
            group.style.display = "flex";
        })
        let preveiw_img = document.getElementById("preview_img");
        preveiw_img.src = "";
        let timestamp = `?timestamp=${new Date().getTime()}`; //給圖片網址加上時間戳記，避免瀏覽器使用快取導致圖片不刷新
        preveiw_img.src = localhostToGCP(result.processedImageUrl) + timestamp;
        document.getElementById("outputFilename").innerText = outputFile;
    } else {
        waiting_group.style.display = "none";
        alert("圖片處理失敗！");
    }
}

//從按鈕跨域下載圖片
function downloadImg(){
    let img = document.createElement('img');
    img.src = document.getElementById("preview_img").src;
    img.crossOrigin = 'anonymous'; //允許CORS
    let filename = document.getElementById("outputFilename").innerText;
    //ppm pgm無法繪製到canvas上
    if(filename.endsWith(".ppm") || filename.endsWith(".PPM") || filename.endsWith(".pgm") || filename.endsWith(".PGM")){
        let a_ppm = document.createElement('a');
        a_ppm.href = img.src;
        a_ppm.target = "_blank";
        a_ppm.download = filename;
        a_ppm.click();
    }else{
        //產生虛擬canvas用來產出本地端圖片url
        let cvs = document.createElement('canvas'), ctx = cvs.getContext('2d');
        img.onload = () => { //當img產生好後執行
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.drawImage(img, 0, 0);
            var url = cvs.toDataURL(); //將 Canvas 內容轉換成 Base64 編碼的 Data URL（可以被直接下載）
            //模擬建立下載連結並點擊
            var a = document.createElement('a');
            a.href = url;
            a.download = document.getElementById("outputFilename").innerText; //設定要下載檔案名稱
            a.click(); //模擬點擊
        }
    }
}