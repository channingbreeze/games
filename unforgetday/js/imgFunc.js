//图片上传、移动、缩放、合成
var wid = 710;
var hei = 1070;
var pageWid = 710;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = wid;
canvas.height = hei;
$('body').append(canvas);
var bzFlag = true;
var images = [];
images[0] = new Image(); //背景图 
images[1] = new Image(); //主图
//合成图片
function hcFunc(per) {
	images[0].src = "images/paper_05.jpg"; //背景图 
	images[1].src = per; //主图
	var text1 = "六一儿童节又到啦！夕阳闪yào在工"
	var text2 = "地上，工人驾驶着挖掘机在挖土。我在挖"
	var text3 = "掘机下欣赏城市的落日，聚精会神地讨论"
	var text4 = "学习。鸟儿也在天边歌唱。"
	var text5 = "难忘的一天"
	var text6 = "真是心与心碰撞的一天啊！"
	var img = [];
	var cont = 0
	if(bzFlag) {
		for(var i = 0; i < 2; i++) {
			var img = images[i]
			img[i] = new Image()
			img[i].src = img.src
			img[i].onload = function() {
				cont++
				console.log(cont, images.length)
				if(cont == images.length) {
					bzFlag = false;
					//背景
					ctx.drawImage(images[0], 0, 0, wid, hei);
					ctx.drawImage(images[1], 22, 122, 666, 1041);

					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text1, 100, 670);
					ctx.save()
					
					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text2, 36, 720);
					ctx.save()

					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text3, 36, 767);
					ctx.save()
					
					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text4, 36, 815);
					ctx.save()
					
					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text5, 245, 107);
					ctx.save()
					
					ctx.font = "35px myfont";
					ctx.fillStyle = "rgb(57, 44, 134)";
					ctx.fillText(text6, 120, 864);
					ctx.save()

					//上传的图	    		    			        	         
					//合成图-输出img	
					
						var dataURL = canvas.toDataURL('image/png');
					//预览
						$(".saveImg").attr("src", dataURL)
					
					
				}
			}

		}

	}

}

//预览
function view(src, id, ss) {
	bzFlag = true;
	$('.hcImg').remove();
	$('.tk-scene-' + ss + ' .tkIn').prepend('<img class="hcImg" src="' + src + '" style="position:absolute; top:0;left:0; width:750px;opacity:0;" />')
}