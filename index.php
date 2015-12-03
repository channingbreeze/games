<?php 

if(isset($_GET['game'])) {
	$game = $_GET['game'];
	if($game != "flappybird" &&
		$game != "getogether") {
		exit(0);
	}
} else {
	exit(0);
}

?>
<!DOCTYPE html> 
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />
    <meta name="renderer" content="webkit">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
	<title><?php echo $game;?></title>
    <script src="phaser.min.js?rand=<?php echo rand(1000,50000);?>"></script>
    <script type="text/javascript">
		var GAME = "<?php echo $game;?>";
    </script>
    <?php 
		include_once 'partials/' . $game . '.php';
	?>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }
        canvas {
            margin: 0 auto;
        }
    </style>
</head>
<body>

</body>