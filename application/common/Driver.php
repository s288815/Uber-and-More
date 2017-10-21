<?php

class Driver extends User
{
	public function go_online($driver_id)
	{
		T_User::update_occupied_status($driver_id, EnumUser::NOT_OCCUPIED);
		return T_User::update_online_status($driver_id, EnumUser::DRIVER_ONLINE);
	}

	public function go_offline($driver_id)
	{
		return T_User::update_online_status($driver_id, EnumUser::DRIVER_OFFLINE);
	}

	public function accept_jobs($driver_id)
	{
		$status = EnumFare::DRIVER_ACCEPT;

		T_User::update_occupied_status($driver_id);

		return T_Ride::update_ride_status_by_driver($driver_id, $status);
	}

	public function reject_jobs($driver_id)
	{
		$status = EnumFare::DRIVER_REJECT;

		return T_Ride::update_ride_status_by_driver($driver_id, $status);
	}

	public function check_is_betting($driver_id)
	{
		$status = EnumFare::DRIVER_PENDING;

		$logs = T_Ride::get_ride_by_driver_id($driver_id, $status);

		if (count($logs) > 1)
		{
			return true;
		}

		return false;
	}

	public function get_rider_detail($user_id, $cls)
	{
		$field = [
			'id',
			'name',
			'last_longitute AS longitute ',
			'last_latitude AS latitude',
			'phone',
		];

		$log = T_User::get_rider_detail($user_id, implode(',', $field));

		if (!empty($log))
		{
			$cls->rider = $log;
			return EnumError::SUCCESS;
		}

		return EnumError::USER_NOT_FOUND;
	}

	public function check_job($driver_id)
	{
		$rides = T_Ride::get_ride_by_driver_id($driver_id, EnumFare::DRIVER_PENDING);

		if (!empty($rides))
		{
			return true;
		}

		return false;
	}

	public function start_betting($driver_id)
	{
		$bet_id = T_Bet::start_betting($driver_id);
		
		$status = EnumFare::BETTING;
		T_Ride::update_ride_status_by_driver($driver_id, $status);

		return $bet_id;
	}

	public function get_bet_result($bet_id, $cls)
	{
		$bet = T_Bet::get_bet_by_bet_id($bet_id);
		if (empty($bet))
		{
			return EnumError::RECORD_NOT_FOUND;
		}

		if ($bet->winner_user_id > 0)
		{
			$cls->winner = $bet->winner_user_id;
			return EnumError::SUCCESS;
		}

		$db_time = T_Bet::get_time()->time;
		if (strtotime($db_time) - strtotime($bet->created_at) < EnumFare::THRESHOLD)
		{
			$cls->winner = -1;
			return EnumError::SUCCESS;
		}

		$bet_logs = T_Bet::get_bet_log_by_bet_id($bet_id);
		if(count($bet_logs) < 0)
		{
			return EnumError::RECORD_NOT_FOUND;
		}

		$highest = $bet_logs[0];
		foreach ($bet_logs as $log)
		{
			if ($log->bet_amount > $highest->bet_amount)
			{
				$highest = $log;
			}
		}

		$cls->winner = $highest->user_id;
		T_Ride::update_ride_bet_lose_by_driver($bet->driver_id, EnumFare::BET_LOSE, $cls->winner);

		//update winner
		T_Bet::update_winner_by_bet_id($bet_id, $cls->winner);
		return T_Ride::update_ride_bet_win_by_user_id($bet->driver_id, EnumFare::BET_WIN, $cls->winner);
	}

	public function set_destination($rider_id, $des_longitute, $des_latitude, $bet_id='', $data)
	{
		$user = T_User::get_user_by_id($rider_id);

		if (empty($user))
		{
			return EnumError::USER_NOT_FOUND;
		}

		$s_longitute = _USER('last_longitute');
		$s_latitude = _USER('last_latitude');
		$driver_id = _USER('id');
		$bet_amount = 0;

		if (!empty($bet_id))
		{
			$bet = T_Bet::get_bet_winner_by_bet_id($bet_id);

			if (empty($bet))
			{
				return EnumError::RECORD_NOT_FOUND;
			}

			$bet_amount += $bet->bet_amount;
		}

		$data->distance = $this->count_distance($s_longitute, $s_latitude, $des_longitute, $des_latitude);
		$data->fare_rate = 1;
		$data->price = number_format($data->distance * $data->fare_rate + $bet_amount, 2);
		$data->bet_amount = number_format($bet_amount, 2);

		return T_Fare::add_fare($rider_id, $driver_id, $s_longitute, $s_latitude, $des_longitute, $des_latitude, $data->distance, $data->fare_rate, $data->price, $bet_id);

	}

	private function count_distance($s_lng, $s_lat, $d_lng, $d_lat)
	{
		return ( 6371 * acos( cos( deg2rad((float)$d_lat) ) * cos( deg2rad((float) $s_lat ) ) * cos( deg2rad((float) $s_lng ) - deg2rad((float)$d_lng) ) + sin( deg2rad((float)$d_lat) ) * sin( deg2rad((float) $s_lat ) ) ) );
	}
}