<?php 

class T_user extends Basic_db
{
	public static function get_user_by_id($user_id, $fields='*')
	{
		$sql = "SELECT $fields FROM user WHERE id=$user_id";
		return SELF::getRow($sql);
	}

	public static function update_user_last_location($longitute, $latitude, $user_id)
	{
		$sql = "UPDATE user SET last_longitute=$longitute, last_latitude=$latitude WHERE id = $user_id";
		return SELF::run($sql);
	}

	public static function check_user($username, $password) 
	{
		$password = hashPassword($password);

		$sql = "SELECT * FROM user WHERE username = $username AND password = '$password' ";
		return SELF::getRow($sql);
	}

	public static function get_nearby_drivers($longitute, $latitude, $exclude_driver = '')
	{
		$sql = "SELECT id, name, last_longitute AS longitute, last_latitude AS latitude, ( 6371 * acos( cos( radians({$latitude}) ) * cos( radians( `last_latitude` ) ) * cos( radians( `last_longitute` ) - radians({$longitute}) ) + sin( radians({$latitude}) ) * sin( radians( `last_latitude` ) ) ) ) AS distance
		FROM user
		WHERE type = ".Enumuser::DRIVER." AND online_status = ".Enumuser::DRIVER_ONLINE." AND occupied = ".Enumuser::NOT_OCCUPIED;

		if(!empty($exclude_driver))
		{
			$sql = " AND id NOT IN ($exclude_driver)";
		}

		$sql .= " HAVING distance <= ".EnumFare::DISTANCE;
		$sql .= " ORDER BY distance ASC";

		return SELF::getResult($sql);
	}

	public static function get_driver_detail($driver_id)
	{
		$sql = "SELECT u.id, u.name, u.last_longitute, u.last_latitude, dd.phone, dd.rating, dd.car_brand, dd.car_model, dd.car_plate, dd.car_color FROM user AS u LEFT JOIN driver_detail AS dd ON u.id = dd.driver_id WHERE u.id = $driver_id";
		return SELF::getRow($sql);
	}

	public static function update_online_status($driver_id, $status)
	{
		$sql = "UPDATE user SET online_status = $status WHERE id = $driver_id";

		return SELF::run($sql);
	}

	public static function get_rider_detail($user_id, $fields = '*')
	{
		$sql = "SELECT $fields FROM user u
				LEFT JOIN rider_detail rd ON u.id = rd.user_id
				WHERE u.id = $user_id AND u.type = ".Enumuser::USER;

		return SELF::getRow($sql);
	}

	public static function update_occupied_status($driver_id, $status = Enumuser::OCCUPIED)
	{
		$sql = "UPDATE user SET occupied = $status WHERE id = $driver_id";

		return SELF::run($sql);
	}

	
}