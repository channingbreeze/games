/**
 * Initialize Cordova plugins
 * For more Corova plugins, please go to [Cordova Plugin Registry](http://plugins.cordova.io/#/).
 * In Intel XDK, you can enable / disable / add Cordova Plugins on
 * Projects Tab
 *  -> Cordova 3.x Hybrid Mobile App Settings
 *     -> Plugins and Permissions
 */
/* jshint browser:true */
// Listen to deviceready event which is fired when Cordova plugins are ready
document.addEventListener('deviceready', function() {
    // Call splashscreen API to hide the splash.
    navigator.splashscreen.hide();
});