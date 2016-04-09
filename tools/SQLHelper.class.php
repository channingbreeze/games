<?php

class SQLHelper {
	
	private $conn;
	private $username;
	private $password;
	private $dbname;
	private $host;
	
	// 构造函数，从database.ini中读取数据库的配置信息
	public function __construct() {
		$arr = parse_ini_file ( dirname ( __FILE__ ) . "/../config/database.ini" );
		$this->dbname = $arr ['dbname'];
		$this->username = $arr ['username'];
		$this->password = $arr ['password'];
		$this->host = $arr ['host'];
		$this->conn = mysql_connect ( $this->host, $this->username, $this->password );
		if (! $this->conn) {
			die ( 'Could not connect: ' . mysql_error () );
		}
		mysql_select_db ( $this->dbname, $this->conn ) or die ( 'can not use ' . $this->dbname . ': ' . mysql_error () );
		mysql_query ( 'set names utf8', $this->conn ) or die ( 'can not set utf8: ' . mysql_error () );
	}
	
	// 析构函数，关闭数据库连接
	public function __destruct() {
		if (! empty ( $this->conn )) {
			mysql_close ( $this->conn );
		}
	}
	
	// 查询函数，传入一个sql查询语句，返回一个数组，不必考虑释放资源了
	public function execute_dql_array($sql) {
		$arr = array ();
		$res = mysql_query ( $sql, $this->conn ) or die ( 'query fail: ' . mysql_error () );
		$i = 0;
		while ( $row = mysql_fetch_assoc ( $res ) ) {
			$arr [$i ++] = $row;
		}
		mysql_free_result ( $res );
		return $arr;
	}
	
	// 其他操作，传入一个sql查询语句，返回0表示失败，返回1表示成功，返回2表示没有行收到影响
	public function execute_dqm($sql) {
		$b = mysql_query ( $sql, $this->conn ) or die ( 'query fail: ' . mysql_error () );
		if (! $b) {
			return 0;
		} else if (mysql_affected_rows ( $this->conn ) > 0) {
			return 1;
		} else {
			return 2;
		}
	}
	
	// 得到上次插入的记录id
	public function getLastInsertedId() {
		return mysql_insert_id ( $this->conn );
	}
}

?>
