<?php

class Rider extends User
{
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * get nearby driver, return driver details
	 *
	 * @param longitute	float
	 * @param latitute	float
	 *
	 * @return null/class
	 */
	public function get_nearby_driver($longitute, $latitude)
	{
		$driver_id = empty(_USER('reject_driver')) ? '' : implode(_USER('reject_driver'));
		// TODO get nearby driver with boon sent formula
		$drivers = T_User::get_nearby_drivers($longitute, $latitude, $driver_id);
		
		return $drivers;
	}

	public function accept_ride($driver_id)
	{
		$driver = T_User::get_user_by_id($driver_id);
		if (empty($driver))
		{
			return EnumError::USER_NOT_FOUND;
		}

		$status = EnumFare::DRIVER_PENDING;
		// $log = T_Ride::get_ride_by_user_id(_USER('id'), $status);
		// if (!empty($log))
		// {
		// 	return EnumError::ILLEGAL_ACTION;
		// }

		return T_Ride::accept_ride(_USER('id'), $driver_id);
	}

	public function get_ride_status()
	{
		return T_Ride::get_last_ride_by_user_id(_USER('id'));
	}

	public function get_bet_result($bet_id, $cls)
	{
		$bet = T_Bet::get_bet_by_bet_id($bet_id);
		$cls->winner = -1;
		$cls->driver = -1;

		if (!empty($bet))
		{
			$cls->winner = $bet->winner_user_id;
			$cls->driver = $bet->driver_id;
			$cls->isWin = $bet->winner_user_id == _USER('id') ? true : false;
			return EnumError::SUCCESS;
		}

		return EnumError::RECORD_NOT_FOUND;

	}

	public function place_bet($bet_id, $user_id, $amount)
	{
		$bet = T_Bet::get_bet_by_bet_id($bet_id);
		T_Bet::place_bet($bet_id, $user_id, $amount);

		if (isset($bet) && !empty($bet->winner_user_id))
		{
			return $bet->winner_user_id;
		}

		if ($amount >= EnumFare::MAX_BET_AMOUNT)
		{
			T_Bet::update_winner_by_bet_id($bet_id, _USER('id'));

			return _USER('id');
		}

	}

	public function reject_bet($bet_id, $user_id)
	{
		$bet = T_Bet::get_bet_by_bet_id($bet_id);
		return T_Bet::reject_bet($bet_id, $user_id);
	}

	public function get_driver_location($driver_id, $cls)
	{
		$fields = [
			'id',
			'last_longitute AS longitute',
			'last_latitude AS latitude',
		];

		$log = T_User::get_user_by_id($driver_id, implode(',', $fields));

		if (!empty($log))
		{
			$cls->driver = $log;
			return EnumError::SUCCESS;
		}

		return EnumError::USER_NOT_FOUND;
	}

	public function get_driver_detail($driver_id)
	{
		$log = T_User::get_driver_detail($driver_id);

		if (empty($log))
		{
			return EnumError::USER_NOT_FOUND;
		}

		return $log;
	}

	public function reject_driver($driver_id)
	{
		$_SESSION['reject_driver'][] = $driver_id;

		return EnumError::SUCCeSS;
	}

	public function get_fare_detail($user_id, $fare_id = '', $data)
	{
		$fare = '';

		if (empty($fare_id))
		{
			$fare = T_Fare::get_last_fare_by_user_id($user_id);
		}
		else 
		{
			$fare = T_Fare::get_fare_by_id($fare_id);
		}

		if (empty($fare))
		{
			return EnumError::RECORD_NOT_FOUND;
		}

		$data->id		 = $fare->id;
		$data->price	 = $fare->price;
		$data->fare_rate = $fare->fare_rate;
		$data->distance	 = $fare->distance;
		$data->bet_amount = 0;

		$bet = T_Bet::get_bet_winner_by_bet_id($fare->bet_id);
		if (!empty($bet))
		{
			$data->bet_amount = $bet->bet_amount;
		}

		return EnumError::SUCCESS;
	}

	public function drop_off($fare_id)
	{
		$fare = T_Fare::get_fare_by_id($fare_id);

		if (empty($fare))
		{
			return EnumError::RECORD_NOT_FOUND;
		}

		return T_Fare::update_fare_status($fare_id, EnumFare::FARE_END);
	}

}