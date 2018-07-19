<?php 

require_once dirname ( __FILE__ ) . '/../tools/SQLHelper.class.php';

class GsStatisticsService {
	
	public function add($game, $ip, $count) {
		
		$sql = "insert into gs_statistics (gmt_create, gmt_modify, game, ip, count) values (now(), now(), '" . $game . "', '" . $ip . "', " . $count . ")";
		$sqlHelper = new SQLHelper();
		$res = $sqlHelper->execute_dqm($sql);
		if($res == 1) {
			return true;
		} else {
			return false;
		}
		
	}
	
	public function selectByGameAndIp($game, $ip) {
		
		$sql = "select * from gs_statistics where game='" . $game . "' and ip='" . $ip . "'";
		$sqlHelper = new SQLHelper();
		$res = $sqlHelper->execute_dql_array($sql);
		return $res;
		
	}
	
	public function updateCount($count, $id) {
		
		$sql = "update gs_statistics set gmt_modify=now(), count=" . $count . " where id=" . $id;
		$sqlHelper = new SQLHelper();
		$res = $sqlHelper->execute_dqm($sql);
		if($res == 1) {
			return true;
		} else {
			return false;
		}
		
	}
	
}

?>
