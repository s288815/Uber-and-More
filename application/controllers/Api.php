<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	private static $errCode;

	public function __construct()
	{
		// EnumError::SYSTEM_ERROR = -1
		SELF::$errCode = -1;
		parent::__construct();
	}

	/**
	 * user login
	 *
	 * @param username	string	POST
	 * @param password	string	POST
	 *
	 * @return errCode
	 */
	public function login()
	{
		$username = _POST('username');
		$password = _POST('password');

		$data = '';

		SELF::$errCode = User::login($username, $password);

		if (SELF::$errCode == EnumError::SUCCESS)
		{
			$data = new stdClass();
			$data->userType = _USER('type');
		}

		echo _Respond(SELF::$errCode, $data);
	}

	public function logout()
	{
		User::logout();
	}

	public function updateLastLocation($longitute, $latitude)
	{
		User::set_last_location($longitute, $latitude, get_bet_by_bet_id('id'));
	}
	
############################################ user ##############################################
	/**
	 * get user last location
	 *
	 * @param user_id	int	
	 *
	 * @return errCode, class
	 */
	public function getUserLastLocation($user_id = NULL)
	{
		if (empty($user_id))
		{
			$user_id = _USER('id');
		}

		$respond = get_user_object()->get_last_location($user_id);
		SELF::$errCode = EnumError::SUCCESS;

		echo _Respond(SELF::$errCode, $respond);
	}

	/**
	 * set user last location 
	 *
	 * @param longitute	float	
	 * @param latitude	float	
	 * @param user_id	float	nullable
	 *
	 * @return errCode
	 */
	public function setUserLastLocation($longitute, $latitude)
	{
		SELF::$errCode = get_user_object()->set_last_location($longitute, $latitude, _USER('id'));

		echo _Respond(SELF::$errCode);
	}

	/**
	 * GET nearby driver by User
	 *
	 * @return type
	 */
	public function getNearbyDriver()
	{
		if (_USER('type') == EnumUser::DRIVER)
		{
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		$drivers = get_user_object()->get_nearby_driver(_USER('last_longitute'), _USER('last_latitude'));
		// $drivers = '[{"id":"2","name":"driver","longitute":"1.23416","latitude":"2.13123","distance":"2.503962033049136"},{"id":"4","name":"ooi","longitute":"1.23466","latitude":"2.15434","distance":"3.647882321965126"}]';

		SELF::$errCode = EnumError::SUCCESS;
		
		echo _Respond(SELF::$errCode, $drivers);
	}

	public function getDriverLocation($driver_id)
	{
		if (_USER('type') == EnumUser::DRIVER)
		{
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		$data = new stdClass();

		SELF::$errCode = get_user_object()::get_driver_location($driver_id, $data);

		echo _Respond(SELF::$errCode, $data->driver);
	}

	public function placeBet($bet_id, $amount)
	{
		if (_USER('type') == EnumUser::DRIVER)
		{
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		if ($amount > EnumFare::MAX_BET_AMOUNT)
		{
			return EnumError::ILLEGAL_ACTION;
		}

		$data = new stdClass();
		$winner = get_user_object()->place_bet($bet_id, _USER('id'), $amount);

		$data->betStatus = $winner < 0 ? EnumFare::BETTING : EnumFare::BETTING_END;
		$data->isWin = $winner == _USER('id') ? true : false;
		$data->winner = $winner;

		SELF::$errCode = EnumError::SUCCESS;

		echo _Respond(SELF::$errCode, $data);
	}

	public function getBetResult($bet_id = '')
	{
		if (empty($bet_id))
		{
			echo _Respond(EnumError::MISSING_PARAM);
			return;
		}

		if (_USER('type') == EnumUser::DRIVER)
		{
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		$data = new stdClass();
		SELF::$errCode = get_user_object()->get_bet_result($bet_id, $data);

		echo _Respond(SELF::$errCode, $data);
	}

	/**
	 * request for a cab
	 *
	 * @return boolean
	 */
	public function rejectDriver($driver_id)
	{
		$result = get_user_object()->reject_driver();

		echo _Respond($result);
	}

	/**
	 * get Driver details
	 *
	 * @param driver_id	int
	 *
	 * @return class
	 */
	public function getDriverDetails($driver_id)
	{
		$driver = get_user_object()->get_driver_detail($driver_id);
		SELF::$errCode = EnumError::SUCCESS;

		echo _Respond(SELF::$errCode, $driver);
	}

	public function acceptRide($driver_id)
	{
		SELF::$errCode = get_user_object()->accept_ride($driver_id);

		echo _Respond(SELF::$errCode);
	}

	public function getRideStatus($driver_id)
	{
		SELF::$errCode = EnumError::SUCCESS;

		$ride = get_user_object()->get_ride_status($driver_id);
		$data = new stdClass();
		$data->getRideStatus = $ride->status;
		$data->betID = '';

		if ($data->getRideStatus == EnumFare::BETTING)
		{
			$data->betID = T_Bet::get_last_bet_id($driver_id)->id;
		}
		echo _Respond(SELF::$errCode, $data);
	}

	public function getFareInfo($fare_id = '')
	{
		$data = new stdClass();

		SELF::$errCode = get_user_object()->get_fare_detail(_USER('id'), $fare_id, $data);

		echo _Respond(SELF::$errCode, $data);
	}

	public function dropOff($fare_id)
	{
		SELF::$errCode = get_user_object()->drop_off($fare_id);

		echo _Respond(SELF::$errCode);
	}

############################################# driver ##############################################

	/**
	 * driver go online
	 *
	 * @return bool
	 */
	public function driverGoOnline()
	{
		SELF::$errCode = get_user_object()->go_online(_USER('id'), EnumUser::DRIVER_ONLINE);

		echo _Respond(SELF::$errCode);
	}

	/**
	 * driver go offline
	 *
	 * @return bool
	 */
	public function driverGoOffline()
	{
		SELF::$errCode = get_user_object()->go_offline(_USER('id'), EnumUser::DRIVER_OFFLINE);

		echo _Respond(SELF::$errCode);
	}

	/**
	 *  driver check for jobs
	 *
	 * @param $driver_id	int
	 *
	 * @return boolean
	 */
	public function driverCheckJobs()
	{
		SELF::$errCode = EnumError::SUCCESS;

		$jobs = get_user_object()->check_job(_USER('id'));

		$data = new stdClass();
		$data->jobs = $jobs;

		echo _Respond(SELF::$errCode, $data);
	}

	/**
	 * get rider details
	 *
	 * @param user_id	int
	 *
	 * @return class
	 */
	public function getRiderDetails($user_id)
	{
		if (_USER('type') == EnumUser::USER)
		{
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		$data = new stdClass();

		SELF::$errCode = get_user_object()->get_rider_detail($user_id, $data);

		echo _Respond(SELF::$errCode, $data);
	}

	public function acceptJobs()
	{
		if (_USER('type') == EnumUser::USER) {
			echo _Respond(EnumError::WRONG_USER_TYPE);
			return;
		}

		SELF::$errCode = EnumError::SUCCESS;
		$data = new stdClass();
		$data->is_betting = false;

		$data->is_betting = get_user_object()->check_is_betting(_USER('id'));

		if ($data->is_betting)
		{
			$data->bet_id = get_user_object()->start_betting(_USER('id'));
		}
		else
		{
			$data->rider_id = T_Ride::get_rider_id_by_driver_id(_USER('id'), EnumFare::DRIVER_PENDING)->user_id;
			$result = get_user_object()->accept_jobs(_USER('id'));
		}

		echo _Respond(SELF::$errCode, $data);
	}

	public function rejectJobs()
	{
		SELF::$errCode = get_user_object()->reject_jobs(_USER('id'));

		echo _Respond(SELF::$errCode);
	}

	public function driverGetBetResult($bet_id)
	{
		$data = new stdClass();

		SELF::$errCode = get_user_object()->get_bet_result($bet_id, $data);

		echo _Respond(SELF::$errCode, $data);
	}

	public function setDestination($rider_id, $longitute, $latitude, $bet_id)
	{
		$data = new stdClass();
		
		SELF::$errCode = get_user_object()->set_destination($rider_id, $longitute, $latitude, $bet_id, $data);

		echo _Respond(SELF::$errCode, $data);
	}
	
}
