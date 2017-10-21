<?php 

require_once(APPPATH.'/common/util/DevUtil.php');

class Autoload extends CI_Model
{
	public function __construct()
	{
		if (!isset($_SESSION))
		{
			session_start();
		}

		get_instance()->load->database();

		spl_autoload_register(
			function($class_name)
			{
				$dirs = array(
					APPPATH . 'common/',
					APPPATH . 'common/enum/',
					APPPATH . 'common/db/',
				);

				foreach($dirs as $dir)
				{
					$file = $dir . $class_name . '.php';
					if (file_exists($file))
					{
						require_once ($file);
						return;
					}
				}
			}
		);

	}
}