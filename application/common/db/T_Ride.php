<?php 

class T_Ride extends Basic_db
{
	public static function accept_ride($user_id, $driver_id)
	{
		$sql = "INSERT INTO ride (driver_id, user_id, status) VALUES ($driver_id, $user_id, ".EnumFare::DRIVER_PENDING.")";

		return SELF::run($sql);
	}

	public static function get_rider_id_by_driver_id($driver_id, $status)
	{
		$sql = "SELECT * FROM ride WHERE driver_id = $driver_id AND status = $status";

		return SELF::getRow($sql);
	}

	public static function update_ride_status_by_driver($driver_id, $status, $exclude = '')
	{
		$sql = "UPDATE ride SET status = ".$status." WHERE driver_id = $driver_id AND status = '".EnumFare::DRIVER_PENDING."'";

		if (!empty($exclude))
		{
			$sql .= " AND user_id NOT IN ($exclude)";
		}

		return SELF::run($sql);
	}

	public static function update_ride_status_by_rider($user_id, $driver_id, $status)
	{
		$sql = "UPDATE ride SET status = ".$status." WHERE user_id = $user_id AND driver_id = $driver_id AND status = '".EnumFare::DRIVER_PENDING."'";

		return SELF::run($sql);
	}

	public static function get_ride_by_driver_id($driver_id, $status = '')
	{
		$sql = "SELECT * FROM ride WHERE driver_id = $driver_id";

		if (!empty($status))
		{
			$sql .= " AND status IN ($status)";
		}

		return SELF::getResult($sql);
	}

	public static function get_ride_by_user_id($user_id, $status='')
	{
		$sql = "SELECT * FROM ride WHERE user_id = $user_id";

		if (!empty($status))
		{
			$sql .= " AND status IN ($status)";
		}

		return SELF::getResult($sql);
	}


	public static function get_last_ride_by_user_id($user_id)
	{
		$sql ="SELECT * FROM ride WHERE user_id = $user_id ORDER BY id DESC LIMIT 1";

		return SELF::getRow($sql);
	}

	public static function update_ride_bet_lose_by_driver($driver_id, $status, $winner = '')
	{
		$sql = "UPDATE ride SET status = $status WHERE driver_id = $driver_id AND status = ".EnumFare::BETTING;

		if (!empty($winner))
		{
			$sql .= " AND user_id NOT IN ($winner)";
		}
		return SELF::run($sql);
	}

	public static function update_ride_bet_win_by_user_id($driver_id, $status, $winner)
	{
		$sql = "UPDATE ride SET status = $status WHERE driver_id = $driver_id AND status = ".EnumFare::BETTING." AND user_id = $winner";

		return SELF::run($sql);
	}
}