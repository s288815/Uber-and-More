<?php 

class Auth extends CI_Controller
{
	public function index()
	{
		$user_type = _USER('type');

		if(!empty($user_type))
		{
			if ($user_type == EnumUser::DRIVER)
			{
				header('Location: driver');
				return;
			}
			else if ($user_type == EnumUser::USER)
			{
				header('Location: rider');
				return;
			}
		}

		$this->login();
	}

	public function login()
	{
		// Get from config
		$data['baseURI'] = base_url();

		$this->load->view('template/html_head', $data);
		$this->load->view('login/body', $data);
		$this->load->view('login/html_foot', $data);
	}

	public function logout()
	{
		User::logout();
		header('Location: '.base_url());
	}
}