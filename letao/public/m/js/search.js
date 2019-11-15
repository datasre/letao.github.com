$(function  () {
	$('.tc_search a').on('tap',function  () {
		console.log(111);
		// 跳转取搜索列表页,并且需要带上关键字
		var key=$.trim($('input').val());
		// 判断 又没关键字就提示客户"请输入关键字搜索"
		if(!key){
			mui.toast("请输入关键字");
		}
		// searchList.html?key=xxx
		location.href='searchList.html?key='+key;
	});
});