var AttemptTimer = function(){
    this.dateObj = new Date();
};
AttemptTimer.prototype = {
    setTime : function(){
        return this.dateObj.getTime();
    },
    updateTime : function(){
        if(localStorage.getItem('attemptTimer') != undefined){
            this.dateObj = null;
            this.dateObj = new Date();
            this.elapsedTime = this.secondsToTime((this.dateObj.getTime()/1000)- (localStorage.getItem('attemptTimer')/1000));
            if(this.elapsedTime.m >= configObj.attempTimeCounter){
                localStorage.removeItem("attemptTimer");
                configObj.localDataModelObj.setstartTime(this.setTime());
            }
            return this.elapsedTime;
        }
        else{
            return null;
        }
    },
    secondsToTime : function (secs)
    {
        var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        var obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }
};