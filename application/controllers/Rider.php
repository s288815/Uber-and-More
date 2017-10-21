<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Rider extends CI_Controller {

	public function index()
	{
		$user_type = _USER('type');

		if (empty($user_type))
		{
			header('Location: auth');
			return;
		}

		if (_USER('type') == EnumUser::DRIVER)
		{
			header('Location: driver');
			return;
		}

		$fields = [
			'id', 
			'phone',
			'name',
		];

		$user = T_User::get_rider_detail(_USER('id'), implode(',', $fields));

		$data['baseURI'] = base_url();
		$data['username'] = _USER('name');
		$data['contactNum'] = $user->phone;

		$data['userRole'] = 'rider';
		$data['profilePic'] = 'path/to/profile/pic.extension';

		$this->load->view('template/html_head', $data);
		$this->load->view('rider/rider', $data);
		$this->load->view('template/shared_dialog', $data);
		$this->load->view('template/html_foot', $data);
	}
}
