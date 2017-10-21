<div class="app-container">
	<div class="app-map">
		<div class="app-map__container" id="mapContainer"></div>
		<!-- <div class="app-input" id="appInputBar">
			<input type="text" name="appInput" id="appInput">
		</div> -->
		<div class="app-menu" id="appMenu">
			<div class="app-menu__overlay js-appMenuToggle"></div>
			<div class="app-menu__container">
				<label>Mode / Theme : </label>
				<input type="checkbox" name="" id="nightMode" /><label for="nightMode">Night</label>
				<div>
					<a href="<?php echo $baseURI?>/auth/logout"><i class="fa fa-sign-out"></i>Logout</a>
				</div>
			</div>
		</div>
		<div class="short-msg hide" id="shortMsg">Requesting for a ride...</div>
	</div>

	<div class="app-bar">
		<div class="app-bar__container">
			<div class="app-bar__user">
				<div class="avatar">
					<div class="avatar__img"><i class="fa fa-lg fa-user" style="vertical-align: middle;"></i></div>
					<span class="online-indicator" id="onlineIndicator"></span>
				</div>
			</div>
			<div class="app-bar__action">
				<button class="c-btn c-btn--primary c-btn--large" id="onlineBtn" data-status="offline">Go online</button>
			</div>
			<div class="app-bar__menu js-appMenuToggle">
				<i class="fa fa-navicon"></i>
			</div>
		</div>
	</div>
</div>