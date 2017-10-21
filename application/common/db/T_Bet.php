<?php 

class T_Bet extends Basic_db
{
	public static function start_betting($driver_id)
	{
		$sql = "INSERT INTO bet (driver_id) VALUES ($driver_id)";

		if (SELF::run($sql))
		{
			return SELF::last_insert_id();
		}

		return false;
	}

	public static function get_bet_by_bet_id($bet_id)
	{
		$sql = "SELECT * FROM bet WHERE id = $bet_id";

		return SELF::getRow($sql);
	}

	public static function get_last_bet_id($driver_id)
	{
		$sql = "SELECT id FROM bet WHERE driver_id = $driver_id ORDER BY id DESC LIMIT 1";

		return SELF::getRow($sql);
	}

	public static function update_winner_by_bet_id($bet_id, $rider_id)
	{
		$sql = "UPDATE bet SET winner_user_id = $rider_id WHERE id = $bet_id";

		return SELF::run($sql);
	}

	public static function place_bet($bet_id, $user_id, $amount)
	{
		$sql = "INSERT INTO bet_detail (bet_id, user_id, bet_amount) VALUES ($bet_id, $user_id, $amount)";

		return SELF::run($sql);
	}

	public static function get_bet_log_by_bet_id($bet_id)
	{
		$sql = "SELECT * FROM bet_detail WHERE bet_id = $bet_id";

		return SELF::getResult($sql);
	}

	public static function get_time()
	{
		$sql = "SELECT now() as time";

		return SELF::getRow($sql);
	}

	public static function get_bet_winner_by_bet_id($bet_id)
	{
		$sql = "SELECT * FROM bet AS b LEFT JOIN bet_detail AS bd ON b.id = bd.bet_id WHERE id = $bet_id AND b.winner_user_id = bd.user_id";

		return SELF::getRow($sql);
	}
}