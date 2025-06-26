document.addEventListener("DOMContentLoaded", async function(){
    try{
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../style/header.css"; // 確保路徑正確
        document.head.appendChild(link);
        
        const response = await fetch("../html/header.html"); //讀檔
        const html = await response.text(); //轉換為純文字
        document.getElementById("header-container").innerHTML = html;

        const link2 = document.createElement("link");
        link2.rel = "stylesheet";
        link2.href = "../style/header.css"; // 確保路徑正確
        document.head.appendChild(link);
        
        const response2 = await fetch("../html/menu.html"); //讀檔
        const html2 = await response2.text(); //轉換為純文字
        const menu_container = document.getElementById("menu-container");
        menu_container.innerHTML = html2;
        menu_container.style.position = "sticky";
        menu_container.style.top = 0;
        menu_container.style.zIndex = 999;

        const link3 = document.createElement("link");
        link3.rel = "stylesheet";
        link3.href = "../style/footer.css"; // 確保路徑正確
        document.head.appendChild(link3);
        
        const response3 = await fetch("../html/footer.html"); //讀檔
        const html3 = await response3.text(); //轉換為純文字
        document.getElementById("footer-container").innerHTML = html3;
    }catch (error){
        console.error("載入時發生錯誤：", error);
    }
});