$(function() {
	//1. 一级分类默认渲染 第一个一级分类对应的二级分类
	getFirstCategoryData(function(data) {
		// 一级分类的默认渲染
		// console.log(data);
		$('.cate_left ul').html(template('firstTemplate', data));
		var categoryId = $('.cate_left ul li:first-child').find('a').attr('data-id');
		render(categoryId);
	});

	//2. 点击一级分类加载对应的二级分类
	$('.cate_left').on('tap','a', function(e) {
		if($(this).parent().hasClass('now')) return false;
		render($(this).attr('data-id'));
		$('.cate_left ul li').removeClass('now');
		$(this).parent().addClass('now');
	});

});
// 获取一级分类的数据
var getFirstCategoryData = function(callback) {
	$.ajax({
		url: '/category/queryTopCategory',
		type: 'get',
		data: '',
		dataType: 'json',
		success: function(data) {
			callback && callback(data);
		}
	});
}

// 获取二级分类的数据
var getSecondeCategoryData = function(params, callback) {
	$.ajax({
		url: '/category/querySecondCategory',
		type: 'get',
		data: params,
		dataType: 'json',
		success: function(data) {
			window.data = data;
			callback && callback(data);
		}
	});
};

// 渲染
var render=function  (categoryId) {
	getSecondeCategoryData({
		id: categoryId
	}, function(data) {
		// 二级分类渲染
		// console.log(data);
		$('.cate_right ul').html(template('secondTemplate', data));
	});
};