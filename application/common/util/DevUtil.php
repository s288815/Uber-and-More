<?php

function _USER($attr)
{
	return isset($_SESSION['user']->$attr) ? $_SESSION['user']->$attr : '';
}

function _USER_S($obj, $val)
{
	$_SESSION['user']->$obj = $val;
}

function _Respond($errCode=0, $data=NULL)
{
	$respond = new stdClass();

	$respond->errCode = $errCode;
	$respond->data = $data;

	return json_encode($respond);
}

function get_user_object()
{
	if (_USER('type') == EnumUser::DRIVER)
	{
		return new Driver();
	}
	else
	{
		return new Rider();
	}
}

function hashPassword($password)
{
	return hash("sha256", $password);
}

function _POST($var)
{
	$var = isset($_POST[$var]) ? $_POST[$var] : '';
	return get_instance()->db->escape($var);
}