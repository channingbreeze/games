/**
 * Created by 365 on 2017-07-19.
 */


var apiurl = {
    getKey : ''+host+'/project/wx/2017/07/api/index.php?s=/Index/refInfo',
    hascrm : ''+host+'/project/wx/2017/07/api/index.php?s=/Index/getUser',
    postcrm :''+host+'/project/wx/2017/07/api/index.php?s=/Index/saveUser',
    postscore : ''+host+'/project/wx/2017/07/api/index.php?s=/Index/saveGame',
    rank : ''+host+'/project/wx/2017/07/api/index.php?s=/Index/rank',
    help : ''+host+'/project/wx/2017/07/api/index.php?s=/Index/getHelp'
}


module.exports = {
    url : apiurl
}