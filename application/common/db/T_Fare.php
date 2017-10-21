<?php

class T_Fare extends Basic_db
{

	// $id
	// $user_id
	// $driver_id
	// $start_longitute
	// $start_latitude
	// $end_longitute
	// $end_latitude
	// $distance
	// $fare_rate
	// $price
	// $user_rating
	// $status

	public static function add_fare($user_id, $driver_id, $start_longitute, $start_latitude, $end_longitute, $end_latitude, $distance, $fare_rate, $price, $bet_id)
	{
		$sql = "INSERT INTO fare (user_id, driver_id, start_longitute, start_latitude, end_longitute, end_latitude, distance, fare_rate, price, status, bet_id) VALUES ($user_id, $driver_id, $start_longitute, $start_latitude, $end_longitute, $end_latitude, $distance, $fare_rate, $price, ".EnumFare::FARE_START.", $bet_id)";

		return SELF::run($sql);
	}

	public static function get_last_fare_by_user_id($user_id)
	{
		$sql = "SELECT * FROM fare WHERE user_id = $user_id ORDER BY id DESC LIMIT 1";

		return SELF::getRow($sql);
	}

	public static function get_fare_by_id($fare_id)
	{
		$sql = "SELECT * FROM fare WHERE id = $fare_id";

		return SELF::getRow($sql);
	}

	public static function update_fare_status($fare_id, $status)
	{
		$sql = "UPDATE fare SET status = $status WHERE id = $fare_id";

		return SELF::run($sql);
	}

	public static function accept_ride($driver_id, $user_id, $start_longitute, $start_latitude, $status)
	{
		$sql = "INSERT INTO fare (driver_id, user_id, start_longitute, start_latitude, status) VALUES ($driver_id, $user_id, $start_longitute, $start_latitude, $status)";

		return SELF::run($sql);
	}

	public static function cancel_fare($driver_id)
	{
		$sql = "UPDATE fare SET status = $status WHERE driver_id = $driver_id";
		
		return SELF::run($sql);
	}

	public static function update_destination($fare_id, $longitute, $latitude, $distance, $fare_rate, $price)
	{
		$sql = "UPDATE fare SET 
			end_longitute = $longitute,
			end_longitute = $latitude,
			distance = $distance,
			fare_rate = $fare_rate,
			price = $price
			WHERE fare_id = $fare_id
		";

		return SELF::run($sql);
	}

	public static function update_bet_id($fare_id, $bet_id)
	{
		$sql = "UPDATE fare SET bet_id = $bet_id WHERE id = $fare_id";

		return SELF::run($sql);
	}

	public static function get_fare_by_driver_id($driver_id)
	{
		$sql = "SELECT * FROM fare WHERE driver_id = $driver_id";

		return SELF::getResult($sql);
	}

	public static function check_jobs($driver_id)
	{
		$sql = "SELECT count(*) FROM fare WHERE driver_id = $driver_id";

		return SELF::getRow($sql);
	}

	
}