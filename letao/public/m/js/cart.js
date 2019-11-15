$(function() {
	// 区域滚动
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		indicators: false
	});

	// 下拉刷新
	mui.init({
		pullRefresh: {
			container: "#refreshContainer",
			down: {
				// 1.初始化页面 自动下拉刷新
				auto: true,
				callback: function() {
					var that = this;
					window.down = this;
					setTimeout(function() {
						getCartData(function(data) {
							// 渲染页面
							$('.mui-table-view').html(template('cart', data));
							// 加载状态隐藏
							that.endPulldownToRefresh();
						});
					}, 1000);
				}
			}
		}
	});
	// 1.初始化页面 自动下拉刷新
	// 2.侧滑的时候 点击编辑 弹出对话框(尺码、数量)
	$('.fa-refresh').on('tap', function() {
		// 4.点击刷新按钮 刷新
		// 刷新 触发下拉操作
		down.pulldownLoading();
	});
	// 3.侧滑的时候 点击删除 弹出对话框 确认对话框
	$('.mui-table-view').on('tap', '.mui-icon-compose', function() {
		// 获取当前按钮对应商品的数据
		var id = $(this).parent().attr('data-id');
		var item = CT.getItemById(cartData.data, id);
		console.log(item);
		var html = template('edit', item);
		html = html.replace(/\n/g, '');

		mui.confirm(html, '商品编辑', ['确认', '取消'], function(e) {
			if (e.index == 0) {
				// 发送请求
				var size = $('.btn_size.now').html();
				var num = $('.p_number input').val();
				CT.loginAjax({
					url: '/cart/updateCart',
					type: 'post',
					data: {
						id: id,
						size: size,
						num: num
					},
					dataType: 'json',
					success: function(data) {
						if (data.success == true) {
							// 窗口关闭
							// 列表更新
							item.num = num;
							item.size = size;
							// 缓存的数据 window.cartData.data 也修改了
							$('.mui-table-view').html(template('cart', window.cartData));
						}
					}
				});
			} else {
				//TODO
			}
		});
	});
	// 事件委托来绑定事件
	$('body').on('tap', '.btn_size', function() {
		$(this).addClass('now').siblings().removeClass('now');
	});
	$('body').on('tap', '.p_number span', function() {
		var $input = $(this).siblings('input');
		var currNum = $input.val();
		var maxNum = parseInt($input.attr('data-max'));
		if ($(this).hasClass('jian')) {
			if (currNum <= 1) {
				return false;
			}
			currNum--;
		} else {
			if (currNum >= maxNum) {
				setTimeout(function() {
					mui.toast('库存不足');
				}, 100);
				return false;
			}
			currNum++;
		}
		$input.val(currNum);
	});
	// 删除按钮
	$('.mui-table-view').on('tap', '.mui-icon-trash', function() {
		var $this=$(this);
		var id = $this.parent().attr('data-id');
		mui.confirm('是否删除该商品', '商品删除', ['确认', '取消'], function(e) {
			if (e.index == 0) {
				CT.loginAjax({
					url: '/cart/deleteCart',
					type: 'get',
					data: {
						id: id
					},
					dataType: 'json',
					success: function(data) {
						if (data.success == true) {
							// 删除
							$this.parent().parent().remove();
							setAmount();
						}
					}
				});
			} else {
				//TODO
			}
		});


	});
	// 5.点击复选框 计算总金额
	$('.mui-table-view').on('change','[type=checkbox]',function  () {
		setAmount();
	});

});

var setAmount=function  () {
	// 所有选中的复选框
	var $checkedBox=$('[type=checkbox]:checked');
	// 获取选中商品的id
	var amountSum=0;
	$checkedBox.each(function  (i,item) {
		var id=$(this).attr('data-id');
		var item=CT.getItemById(window.cartData.data,id);
		var num=item.num;
		var price=item.price;
		var amount=num*price;
		amountSum+=amount;
	});
	amountSum=Math.floor(amountSum*100)/100;
	$('#cartAmount').html(amountSum);
};

var getCartData = function(callback) {
	CT.loginAjax({
		url: '/cart/queryCartPaging',
		type: 'get',
		dataType: 'json',
		data: {
			page: 1,
			pageSize: 100
		},
		success: function(data) {
			window.cartData = data;
			callback && callback(data);
			// console.log(data);
		}
	});
};
