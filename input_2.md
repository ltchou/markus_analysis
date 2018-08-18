# 處理input資料\(2/2\)

* 利用標籤來讓各工具知道每個欄位的資料屬性， 目前本工具中能使用的標籤如下:
  * 數值型資料:  
    * target開頭\(使用者可對他想觀察的數值類型的欄位，e.g. target1, target2, target3....\)
    * sum \(總和\)
    * count \(計數\)
    * average \(平均\)
  *  非數值型的資料:
    * ID\(編號\)
    * place\(地點\)
    * lng\(經度\), lat\(緯度\)
    * year\(西元年份\), year\_start\(年份起點\), year\_end\(年份終點\), year\_chinese\(朝代\)
    * date\(時間\)
    * type\(種類\)
    * title\(標題\)
    * content\(內容\)
    * author\(作者\)
    * person\(人物\)
    * origin\(來源出處\)
    * keyword\(關鍵字\)
    * tag\(標籤\)

**若為空值的話，系統會依序將該欄當成item1, item2, item3 ……來處理。**

**另外，系統自動增加了一個sID欄位，來對每一列的資料進行編號。**

