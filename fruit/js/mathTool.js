var mathTool = {
  // 计算延长线,p2往p1延长(private)
  calcParallel: function(p1, p2, L) {
    var p = {};
    if(p1.x == p2.x) {
      if(p1.y - p2.y > 0) {
        p.x = p1.x;
        p.y = p1.y + L;
      } else {
        p.x = p1.x;
        p.y = p1.y - L;
      }
    } else {
      var k = (p2.y - p1.y) / (p2.x - p1.x);
      if(p2.x - p1.x < 0) {
        p.x = p1.x + L / Math.sqrt(1+k*k);
        p.y = p1.y + L*k / Math.sqrt(1+k*k);
      } else {
        p.x = p1.x - L / Math.sqrt(1+k*k);
        p.y = p1.y - L*k / Math.sqrt(1+k*k);
      }
    }
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
    return new Phaser.Point(p.x, p.y);
  },
  // 计算垂直线,p2点开始垂直(private)
  calcVertical: function(p1, p2, L, isLeft) {
    var p = {};
    if(p1.y == p2.y) {
      p.x = p2.x;
      if(isLeft) {
        if(p2.x - p1.x > 0) {
          p.y = p2.y - L;
        } else {
          p.y = p2.y + L;
        }
      } else {
        if(p2.x - p1.x > 0) {
          p.y = p2.y + L;
        } else {
          p.y = p2.y - L;
        }
      }
    } else {
      var k = -(p2.x - p1.x) / (p2.y - p1.y);
      if(isLeft) {
        if(p2.y - p1.y > 0) {
          p.x = p2.x + L / Math.sqrt(1+k*k);
          p.y = p2.y + L*k / Math.sqrt(1+k*k);
        } else {
          p.x = p2.x - L / Math.sqrt(1+k*k);
          p.y = p2.y - L*k / Math.sqrt(1+k*k);
        }
      } else {
        if(p2.y - p1.y > 0) {
          p.x = p2.x - L / Math.sqrt(1+k*k);
          p.y = p2.y - L*k / Math.sqrt(1+k*k);
        } else {
          p.x = p2.x + L / Math.sqrt(1+k*k);
          p.y = p2.y + L*k / Math.sqrt(1+k*k);
        }
      }
    }
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
    return new Phaser.Point(p.x, p.y);
  },
  // 形成刀光点
  generateBlade: function(points) {
    var res = [];
    if(points.length <= 0) {
      return;
    } else if(points.length == 1) {
      var oneLength = 6;
      res.push(new Phaser.Point(points[0].x - oneLength, points[0].y));
      res.push(new Phaser.Point(points[0].x, points[0].y - oneLength));
      res.push(new Phaser.Point(points[0].x + oneLength, points[0].y));
      res.push(new Phaser.Point(points[0].x, points[0].y + oneLength));
    } else {
      var tailLength = 10;
      var headLength = 20;
      var tailWidth = 1;
      var headWidth = 6;
      res.push(this.calcParallel(points[0], points[1], tailLength));
      for(var i=0; i<points.length-1; i++) {
        res.push(this.calcVertical(points[i+1], points[i], Math.round((headWidth - tailWidth) * i / (points.length - 1) + tailWidth), true));
      }
      res.push(this.calcVertical(points[points.length-2], points[points.length-1], headWidth, false));
      res.push(this.calcParallel(points[points.length-1], points[points.length-2], headLength));
      res.push(this.calcVertical(points[points.length-2], points[points.length-1], headWidth, true));
      for(var i=points.length-1; i>0; i--) {
        res.push(this.calcVertical(points[i], points[i-1], Math.round((headWidth - tailWidth) * (i - 1) / (points.length - 1) + tailWidth), false));
      }
    }
    return res;
  },
  randomMinMax: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  randomPosX: function() {
    return this.randomMinMax(-100, game.width + 100);
  },
  randomPosY: function() {
    return this.randomMinMax(100, 200) + game.height;
  },
  randomVelocityX: function(posX) {
    if(posX < 0) {
      return this.randomMinMax(100, 500);
    } else if(posX >= 0 && posX < game.width / 2) {
      return this.randomMinMax(0, 500);
    } else if(posX >= game.width / 2 && posX < game.width) {
      return this.randomMinMax(-500, 0);
    } else {
      return this.randomMinMax(-500, -100);
    }
  },
  randomVelocityY: function() {
    return this.randomMinMax(-1000, -950);
  },
  degCos: function(deg) {
    return Math.cos(deg * Math.PI / 180);
  },
  degSin: function(deg) {
    return Math.sin(deg * Math.PI / 180);
  },
  shuffle: function(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
}
