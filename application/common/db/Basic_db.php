<?php

class Basic_db
{

	public static function getRow($sql)
	{
		return get_instance()->db->query($sql)->row();
	}

	public static function getResult($sql)
	{
		return get_instance()->db->query($sql)->result();
	}

	public static function run($sql)
	{
		return get_instance()->db->query($sql);
	}

	public static function last_insert_id()
	{
		return get_instance()->db->insert_id();
	}
}