/**
 *已知两点p1(x1,y1)  p2(x2,y2)，求距p1垂直距离为h的两点坐标
 *
 */

 function getVerticalLineByP1(p1,p2,h){
 	var x1 = p1.x;
 	var y1 = p1.y;
 	var x2 = p2.x;
 	var y2 = p2.y;

 	var x = x1-x2;
 	var y = y1-y2;
 	var z = Math.sqrt(x*x + y*y);

 	var sinA = x/z;
 	var cosA = y/z;
 	var x_left;
 	var y_left;
 	var x_right;
 	var y_right;
 	var l = 10;
 	if(x1 <= x2){
	 	x_left = x1 - Math.abs(cosA)*h;
	 	y_left = y1 - Math.abs(sinA)*h;
	 	x_right = x1 + Math.abs(cosA)*h;
	 	y_right = y1 + Math.abs(sinA)*h - l;
 	}else{
	 	x_left = x1 - Math.abs(cosA)*h - l;
	 	y_left = y1 + Math.abs(sinA)*h - l;
	 	x_right = x1 + Math.abs(cosA)*h;
	 	y_right = y1 - Math.abs(sinA)*h;
 	}
 	var result = {p1:{},p2:{}};
 	result.p1.x = x_left + l;
 	result.p1.y = y_left;
 	result.p2.x = x_right - l;
 	result.p2.y = y_right;
 	return result;
 }


 /**
 *求点p1(x1,y1)是否在圆心为o(x1,y1),半径为r的园内
 *
 */

 function isWithinCircle(o,r,p1){
 	var x = p1.x;
 	var y = p1.y;
 	var a = o.x;
 	var b = o.y;
 	//到圆心的矩形
 	var length = Math.sqrt((x-a)*(x-a) + (y-b)*(y-b));
 	//是否小于半径
 	return length <= r;
 	
 }



