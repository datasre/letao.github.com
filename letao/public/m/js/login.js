$(function  () {
	$('#submit').on('tap',function  () {
		// serialize 序列化成字符串  serializeArray  序列化成数组
		var data=$('form').serialize();
		// key=value&k=v
		var dataObject=CT.serialize2object(data);
		console.log(dataObject);
		
		// 校验
		if(!dataObject.username){
			mui.toast('请输入用户名');
			return false;
		}
		if(!dataObject.password){
			mui.toast('请输入密码');
			return false;
		}
		
		$.ajax({
			url:'/user/login',
			type:'post',
			data:dataObject,
			dataType:'json',
			success:function(data){
				// 如果成功根据地址跳转
				// 如果没有地址 默认跳转个人中心首页 
				if(data.success==true){
					var returnUrl=location.search.replace('?returnUrl=','');
					if(returnUrl){
						location.href=returnUrl;
					}else{
						location.href=CT.userUrl;
					}
				}else{
					// 业务失败
					mui.toast(data.message);
				}
			}
		});
	});
	
});