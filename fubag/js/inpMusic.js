// 设置mp3文件路径
    var musicSRC="assets/music.mp3";


//插入样式
    var inStyle=".musicIco{width:36px;height:36px;position:fixed;right:15px;top:15px;z-index:999;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAACRCAMAAABXAg6SAAAAPFBMVEUAAAD////////////////////////////////////////////////////////////////////////////YSWgTAAAAE3RSTlMAJrl+4lP5lwzT7mBAGDLHqodwpwD1wAAAAvtJREFUaN7smF1uI0EIhF0FnID733UTxdmS03TXzo4UKVJ4Gnngo8DTv4+fZaggs98sySj8H6WC/cUYdVlLZI+WgSsYPqMYBbxFAqjgk01cw2Rg0HkBVfLdZ6l/lEN4DyvHO4FWVLx7xJSAxm/lJMY3+UVUnkixLyt6Ki8OnE0O9pJgSypxJtAaw7njEGcE8TGSMP2a2IKyc8idQ+4QfQSNb7EWB3VuNL026bmIXPIoYoyTIwxIEXOgwA7UYSSJa6aWhpMUwm5AydwURynVn7u14MfoilFSSried6CnH0ZJpcriDGI8M+ZKeo8WExb0DIqpNi5VOtAjG/vhU910oPrbTo5NMi1S0lJ6TE0S8WyKXrqkitRrB1Jtc7fTgtAQM7efZLcH6Tl7APUnyFSG1DNXZwea11nmCYQLIG575JsdXD6pCcQrIDS2f7//IBlLlcsHeWUW0aibh4gftIoGDzObn0bU4KjDKuy7rXlRgtZeq0g/ZmtJqOj95I9gdicBgeb9RR2Xo+hPiz4vwnlaIMGWydMskOuSjWwLUuhhE8H2oDVylVTtQQqcwRIkoxG03/r1qymn33nWy09WkNLXcXvMF44SmO3xumEvw1E6mCNE6DD8OHHKHmrwMc7kOHLCHbO8QRxz8DOcFMcfRe/43T8c3z+u379AuH+lcf+S5buvffxF1P2rsV/70469pEAIA0EYJqjpJObh4/53nekgUweohoGZduFKpBbmF75/ulxGXUZdRl1GvyOj9wgWMqpXXCxkVOL7lruBjPaso85kIKPLHFUNZDQMfV6SgYxeOmqtpIwiNpIMZHQvOmozkNE2Rx2Nk1GMKruBjLZjfoLNQEa3FaM4GU2CPwopo1VHxYuUUYwawUBG6zzIYiCj6Yz6qs7LKOrCyijqwsuoFBxkUkafuvAy+qkLL6NPXTIto6gLLaOoCy+jbcUoUkZRF05GURdWRlEXWkZRF1JGUZeFlFHUJXdSRlEXIWUUdTGR0TBul1GXUZdRl9EfltEXx390jZ+LZA8AAAAASUVORK5CYII=') no-repeat;background-size:36px auto}.play{background-position:left top;-webkit-animation:musicMove 1s linear infinite}.paused{background-position:center bottom}@-webkit-keyframes musicMove{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(-360deg)}}";
    var newStyle=document.createElement("style");
    newStyle.innerHTML=inStyle;
    document.head.appendChild(newStyle);
// 插入图标
    var ele=document.createElement("p");
    ele.className="musicIco play";
    //document.body.appendChild(ele);
//生成音频
    var audio=document.createElement("audio");
    audio.src=musicSRC;
    document.body.appendChild(audio);
    // 是否预加载(true/false)
    audio.preload=true;
    // 是否自动播放(true/false)
    audio.autoplay=true;
    // 是否循环(true/false)
    audio.loop=true;
    // 音量0~1
    audio.volume=1;
    // 是否关闭声音(true/false)
    audio.muted=false;

    // 播放处理
    function playFun(){
        audio.play();
        ele.className="musicIco play";
    };
    //暂停处理
    function pauseFun(){
        audio.pause();
        ele.className="musicIco paused";
    };
    //监听点击事件
    function listenClick(){
        ele.addEventListener("touchend",function(){
            if(audio.paused==true){
                //未播放
                playFun();
            }else{
                //播放中
                pauseFun();
            }
        });
        /*document.addEventListener("touchend",function(){
            pauseFun();
        });*/
    };
    //监听点击事件
    listenClick();
    //加载完毕播放
    document.addEventListener("WeixinJSBridgeReady", function () {
        audio.play();
    }, false);