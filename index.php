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
	<title>flappy bird</title>
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