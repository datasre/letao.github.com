$(function  () {
	CT.loginAjax({
		url:'/user/queryUserMessage',
		type:'get',
		data:{},
		dataType:'json',
		success:function  (data) {
			// console.log(data);
			setTimeout(function  () {
				$('.mui-media-body').html(data.username);
				$('.mui-media-body').append('<p class="mui-ellipsis">绑定手机:'+data.mobile+'</p>');
			},1000);
		}
	});
	$('.p20 a').on('tap',function  () {
		$.ajax({
			url:'/user/logout',
			type:'get',
			data:{},
			dataType:'json',
			success:function(data){
				if(data.success==true){
					location.href='login.html';
				}
			}
		});
	});
});