/**
 * Created with JetBrains WebStorm.
 * User: vivek.d
 * Date: 7/11/14
 * Time: 2:25 PM
 * To change this template use File | Settings | File Templates.
 */
var localDataModel = function(){
  var temp = JSON.parse(localStorage.getItem('powerUpCount'));
  this.availablePowerUp = JSON.parse(localStorage.getItem('powerUpCount')) || {
                                                                                    "addMoreMoves" : temp["addMoreMoves"],
                                                                                    "universal" : temp["universal"],
                                                                                    "powerUpRing" : temp["powerUpRing"]
                                                                                };

};
localDataModel.prototype = {
    setstartTime  : function(timeObj){
       this.localTime = JSON.parse(localStorage.getItem('attemptTimer')) || null;
       if(this.localTime == null){
           localStorage.setItem('attemptTimer', timeObj);
       }
     },
    incrementLife : function(factor){
        var lifeRem = parseInt(localStorage.getItem('livesCount'));
        lifeRem = lifeRem + factor;
        if(lifeRem >= 10){
            localStorage.removeItem('attemptTimer');
        }
        localStorage.removeItem('livesCount');
        localStorage.setItem('livesCount', lifeRem);
    },
    setCoins : function(earnedCoins){
        this.totalCoins =  localStorage.getItem('coins');
        if(this.totalCoins == null){
          localStorage.setItem('coins', earnedCoins);
        }
        else{
          this.totalCoins = parseInt(localStorage.getItem('coins')) + earnedCoins;
          localStorage.removeItem('coins');
          localStorage.setItem('coins', this.totalCoins);
        }
    },
    getCoins : function(){
      this.totalCoins =  localStorage.getItem('coins');
        if(this.totalCoins != null){
          return parseInt(this.totalCoins);
        }
        else 
          return 0;
    },
    setPowerUp : function(powerUp, count){
      var temp = JSON.parse(localStorage.getItem('powerUpCount'));
      var updated = temp[powerUp] + count;
      if(updated >= 0){
          this.availablePowerUp = JSON.parse(localStorage.getItem('powerUpCount'));
          this.availablePowerUp[""+powerUp] = updated;
          localStorage.removeItem('powerUpCount');
          localStorage.setItem('powerUpCount', JSON.stringify(this.availablePowerUp));
      }
    }
};