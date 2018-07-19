<?php 

if(isset($_GET['id']))  {
	$id = $_GET['id'];
	include_once dirname ( __FILE__ ) . '/duans/' . $id . '.php';
} else {
	include_once dirname ( __FILE__ ) . '/duans/1.php';
}

?>
<script src="weiduan/js/main.js"></script>