$(function() {
	var id=CT.getParamsByUrl().productId;
	getProductData(id, function(data) {
		// 清除加载状态
		$('.loading').remove();
		// 渲染商品详情页
		$('.mui-scroll').html(template('detail', data));
		// 滚动区域
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005,
			indicators: false
		});
		// 轮播图
		mui('.mui-slider').slider({
			interval: 2000
		});

		// 1.尺码的选择
		$('.btn_size').on('tap', function() {
			$(this).addClass('now').siblings().removeClass('now');
		});
		// 2.数量的选择
		$('.p_number span').on('tap', function() {
			var $input = $(this).siblings('input');
			var currNum = $input.val();
			var maxNum = parseInt($input.attr('data-max'));
			if ($(this).hasClass('jian')) {
				if (currNum == 0) {
					return false;
				}
				currNum--;
			} else {
				if (currNum >= maxNum) {
					// 消息框点击的时候会消失 正好和加号在一起 (击穿现象 tap特有的,可以利用延迟来解决)
					setTimeout(function() {
						mui.toast('库存不足');
					}, 100);
					return false;
				}
				currNum++;
			}
			$input.val(currNum);
		});
		// 3.加入购物车
		$('.btn_addCart').on('tap', function() {
			// 数据校验
			var $changeBtn = $('.btn_size.now');
			if (!$changeBtn.length) {
				mui.toast('请选择尺码');
				return false;
			}
			var num = $('.p_number input').val();
			if (num <= 0) {
				mui.toast('请选择数量');
				return false;
			}

			//提交数据
			CT.loginAjax({
				url: '/cart/addCart',
				type: 'post',
				data: {
					productId: id,
					num:num,
					size:$changeBtn.html()
				},
				dataType:'json',
				success:function(data){
					if(data.success==true){
						/*弹出提示框*/
						/*content*/
						/*title*/
						/*btn text []*/
						/*click btn callback */
						mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
						    if (e.index == 0) {
						        location.href = CT.cartUrl;
						    } else {
						        //TODO
						    }
						})
					}
				}
			});
		});

	});
});

var getProductData = function(productId, callback) {
	$.ajax({
		url: '/product/queryProductDetail',
		type: 'get',
		data: {
			id: productId
		},
		dataType: 'json',
		success: function(data) {
			setTimeout(function() {
				console.log(data);
				callback && callback(data);
			}, 1000)
		}
	});
};
