'use strict';

(function(){

    /**
     * Get the DOM offset values of any given element
     * @method Phaser.Canvas.getOffset
     * @param {HTMLElement} element - The targeted element that we want to retrieve the offset.
     * @param {Phaser.Point} [point] - The point we want to take the x/y values of the offset.
     * @return {Phaser.Point} - A point objet with the offsetX and Y as its properties.
     */
    Phaser.Canvas.getOffset = function (element, point) {

        point = point || new Phaser.Point();

        var box = element.getBoundingClientRect();
        var clientTop = element.clientTop || document.body.clientTop || 0;
        var clientLeft = element.clientLeft || document.body.clientLeft || 0;

        //  Without this check Chrome is now throwing console warnings about strict vs. quirks :(

        var scrollTop = 0;
        var scrollLeft = 0;

        if (document.compatMode === 'CSS1Compat')
        {
            scrollTop = window.pageYOffset || document.documentElement.scrollTop || element.scrollTop || 0;
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || element.scrollLeft || 0;
        }
        else
        {
            scrollTop = window.pageYOffset || document.body.scrollTop || element.scrollTop || 0;
            scrollLeft = window.pageXOffset || document.body.scrollLeft || element.scrollLeft || 0;
        }

        point.x = box.left + scrollLeft - clientLeft;
        point.y = box.top + scrollTop - clientTop;

        // IE fullscreen HACK
        if( Phaser.GAMES[0].device.ie )
        {
            point.x += Phaser.GAMES[0].scale.margin.x;
            // Adding to the y isn't necessary. Apparently the IE issue only happens on the x-axis. I HAVE NO IDEA WHY
        }

        return point;

    }

    /**
     * Called automatically when the browser enters of leaves full screen mode.
     * @method Phaser.ScaleManager#fullScreenChange
     * @param {Event} event - The fullscreenchange event
     * @protected
     */
    Phaser.ScaleManager.prototype.fullScreenChange = function (event) {

    }
})();