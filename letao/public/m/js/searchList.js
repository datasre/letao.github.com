$(function() {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false
	});
	//	1.页面初始化的时候：关键字在输入框内显示
	// 获取关键字
	var urlParams = CT.getParamsByUrl();
	var $input = $('input').val(urlParams.key || '');

	//  2.页面初始化的时候：根据关键字查询第一页数据4条
	// 下拉刷新配置自动执行 重复操作
	/*getSearchData({
		proName: urlParams.key,
		page: 1,
		pageSize: 4
	}, function(data) {
		console.log(data);
		//渲染数据
		$('.ct_product').html(template('list', data));
	});*/

	//  3.用户点击搜索的时候 根据新的关键字搜索商品 重置排序功能
	$('.tc_search a').on('tap', function() {
		var key = $.trim($('input').val());
		if (!key) {
			mui.toast('请输入关键字');
			return false;
		}
		getSearchData({
			proName: key,
			page: 1,
			pageSize: 4
		}, function(data) {
			$('.ct_product').html(template('list', data));
		});
	});

	//  4.用户点击排序的时候 根据排序的选项去进行排序(默认的时候是降序 再次点击的时候是升序)
	$('.ct_order a').on('tap', function() {
		// 如果已经选择了  改变箭头方向
		if ($(this).hasClass('now')) {
			if ($(this).find('span').hasClass('fa-angle-down')) {
				$(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
			} else {
				$(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		} else {
			// 改变当前样式
			$(this).addClass('now').siblings().removeClass('now');
			$('.ct_order a span').removeClass('fa-angle-up').addClass('fa-angle-down');
		}

		// 获取当前点击的功能参数 price 1 2 num 1 2
		var order = $(this).attr('data-order');
		var orderVal = $(this).find('span').hasClass('fa-angle-up') ? 1 : 2;

		// 获取数据
		var key = $.trim($('input').val());
		var params = {
			proName: key,
			page: 1,
			pageSize: 4,
			// 排序的方式
		};
		params[order] = orderVal;
		getSearchData(params, function(data) {
			$('.ct_product').html(template('list', data));
		});
	});

	//  5.用户下拉的时候 根据当前条件刷新 上拉加载重置 排序功能也重置
	mui.init({
		pullRefresh: {
			// 下拉容器
			container: "#refreshContainer",
			// 下拉
			down: {
				auto: true, //可选,默认false.自动上拉加载一次
				callback: function() {
					// 组件对象
					var that = this;
					var key = $.trim($('input').val());
					if (!key) {
						mui.toast('请输入关键字');
						return false;
					}

					// 排序功能也重置
					$('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

					getSearchData({
						proName: key,
						page: 1,
						pageSize: 4
					}, function(data) {
						setTimeout(function() {
							$('.ct_product').html(template('list', data));
							// 停止下拉刷新
							that.endPulldownToRefresh();
							// 上拉加载重置
							that.refresh(true);
						}, 1000);
					});
				}
			},
			//  6.当用户上拉的时候 加载下一页(没有数据不去加载了)
			// 上拉
			up: {
				contentnomore: '没有更多数据了',
				callback: function() {
					page++;
					var that = this;
					var key = $.trim($('input').val());
					if (!key) {
						mui.toast('请输入关键字');
						return false;
					}
					// 获取当前点击的功能参数 price 1 2 num 1 2
					var order = $('.ct_order a.now').attr('data-order');
					var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
					var params = {
						proName: key,
						page: page,
						pageSize: 4,
						// 排序的方式
					};
					params[order] = orderVal;
					getSearchData(params, function(data) {
						setTimeout(function() {
							$('.ct_product').append(template('list', data));
							// 停止上拉加载
							if(data.data.length){
								that.endPullupToRefresh();
							}else{
								that.endPullupToRefresh(true);
							}
						}, 1000);
					});
				}
			}
		}
	});


});

var getSearchData = function(params, callback) {
	$.ajax({
		url: '/product/queryProduct',
		type: 'get',
		data: params,
		dataType: 'json',
		success: function(data) {
			// 存一个当前页码
			window.page = data.page;
			callback && callback(data);
		}
	});
};
