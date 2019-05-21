$('#menu-action').click(function() {
	$('.navbar-default.sidebar').toggleClass('active');
	$('#side-menu>li').toggleClass('active');
	$('#side-menu>li>a').toggleClass('active');
	$('#side-menu>li>ul').toggleClass('active');
	$(document).on('click','.btn-lv2',function () {
		$('.nav.nav-lv1').toggleClass('active');
		$('.nav.nav-lv2').toggleClass('active');
	})
});

var height =  $('.panel-body').height();
if(height > 170){
	$('.panel-body').css('overflow','scroll');}

