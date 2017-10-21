<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Driver extends CI_Controller {

	public function index()
	{
		$user_type = _USER('type');

		if (empty($user_type))
		{
			header('Location: auth');
			return;
		}

		if (_USER('type') == EnumUser::USER)
		{
			header('Location: rider');
			return;
		}

		// Get from config & DB
		$data['baseURI'] = base_url();

		$user = T_User::get_driver_detail(_USER('id'));

		$data['username'] = _USER('name');
		$data['contactNum'] = $user->phone;
		$data['userRole'] = 'driver';
		$data['profilePic'] = 'path/to/profile/pic.extension';

		$this->load->view('template/html_head', $data);
		$this->load->view('driver/driver', $data);
		$this->load->view('template/shared_dialog', $data);
		$this->load->view('template/html_foot', $data);
	}
}
