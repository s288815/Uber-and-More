<?php

class EnumFare
{
	const PENDING = 1;
	const ACCEPT = 2;
	const CANCEL = 3;
	const DRIVER_PENDING = 4;
	const DRIVER_ACCEPT = 5;
	const DRIVER_REJECT = 6;
	const BET_LOSE = 7;
	const BET_WIN = 8;

	const MAX_BET_AMOUNT = 10;

	const BETTING = 20;
	const BETTING_END = 21;

	const THRESHOLD = 15; #(seconds)
	const DISTANCE = 30000;

	const FARE_START = 1;
	const FARE_END = 2;
}