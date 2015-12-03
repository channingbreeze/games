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
	<meta charset="UTF-8" />
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />
	<meta name ="viewport" content ="width=device-width, initial-scale=1, user-scalable=no">
	<title><?php echo $game;?></title>
    <script src="phaser.min.js"></script>
    <script>
		var GAME = "<?php echo $game;?>";
    </script>
    <?php 
		include_once 'partials/' . $game . '.php';
	?>
    <style>
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