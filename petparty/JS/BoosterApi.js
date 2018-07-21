var BoosterApi = function(){
    if(Booster.Analytics)
    {
        this.initializeAnalytics();
        this.adSense = new Booster.Ad({type: 'adsense', size: '300x250', channelID: 8265756825});
    }
};
BoosterApi.prototype = {
	moreGames : function(){
        if(Booster.Analytics)
        {
            var moregames = new Booster.Moregames();
            moregames.redirect();
        }
	},
	addSense : function(){
		// call when the advertisement needs to be shown
        if(Booster.Analytics)
        {
//            this.adSense.showAdvertising();
        }
	},
	initializeAnalytics : function(){
        this.analytics = new Booster.Analytics({
            gameName: 'Pet Pop Party',
            gameId: '0001-pet_pop_part',
            gameCategory: 'Puzzle',
            developer: '0001',
            gameAnalyticsId: 'UA-34318136-6'
        });
	},

    event: function(type, opt_arg)
    {
        if(this.analytics)
        {
            console.log('Analytics: ' + type + "(" + (opt_arg ? opt_arg : "") + ")");
            switch(type)
            {
                case 'menu':
                case 'level':
                    this.analytics[type](opt_arg);
                    break;
                default:
                    this.analytics.customEvent(type,opt_arg);
            }

        }
    }
};