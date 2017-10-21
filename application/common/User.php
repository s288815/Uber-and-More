<?php

class User 
{
	public function __construct()
	{
		// 
	}

	public function get_last_location($user_id)
	{
		$user = T_User::get_user_by_id($user_id);

		$respond = new stdClass();
		$respond->longitute = $user->last_longitute;
		$respond->latitude = $user->last_latitude;
		$respond->lastUpdate = $user->last_update;

		return $respond;
	}

	public function set_last_location($longitute, $latitude, $user_id)
	{
		if (empty($user_id) || empty($longitute) || empty($latitude)) {
			return EnumError::MISSING_PARAM;
		}
		
		_USER_S($longitute, 'last_longitute');
		_USER_S($latitude, 'last_latitude');

		return T_User::update_user_last_location($longitute, $latitude, $user_id);
	}

	public static function login($username, $password)
	{
		$user = T_User::check_user($username, $password);
		$_SESSION['user'] = $user;

		if (!empty($user))
		{
			return EnumError::SUCCESS;
		}
		else 
		{
			return EnumError::AUTH_FAILED;
		}
	}

	public static function logout()
	{
		if (_USER('type') == EnumUser::DRIVER )
		{
			T_User::update_online_status(_USER('id'), EnumUser::DRIVER_OFFLINE);
		}
		unset($_SESSION['user']);
	}
}