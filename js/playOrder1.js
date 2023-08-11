// chenhuaan
// 提交订单页面

// 立即执行
(function(){
	var playOrder = {
		
		// 初始化
		init: function(){
			this.queryList();
			this.bindEvents()
		},
		
		// 绑定事件
		bindEvents: function(){
			var self = this;
			$('#good_coupons').on('click',function(){
				self.getCoupons()
			});
			$('#sureorder').on('click','.icon_no_ok',function(ev){
				self.selectCoupons($(this))
			});
			$('#sureorder').on('click','#coupons_Btn div',function(ev){
				self.couponsConfirm(ev)
			});
			$('#good_delivery').on('click',function(){
				$('#good_delivery').addClass('select');
				$('#store_invite').removeClass('select');
				$('#user_inf').removeClass('dsn');
			});
			$('#store_invite').on('click',function(){
				$('#good_delivery').removeClass('select');
				$('#store_invite').addClass('select');
				$('#user_inf').addClass('dsn');
			})
		},
		
		// 渲染页面
		render: function(){
			var self = this;
			var list = store.get('data');
			var tpl = $('#tpl').html();
			var htmlStr = _.template(tpl)({list: list});
			$('#good_list').html(htmlStr);
			$('#pay_account').text(common.getData('amount').toFixed(2));
			
			// 渲染优惠券
			var url = common.urlRoot + '/coupon';
			var data = {};
			common.ajax(url, data, function(res){
				self.rendCoupons(res);
				store.set('coupons',res)
			})
			this.getNeedPay()
		},
		
		// 渲染优惠券
		rendCoupons: function(data){
			var list = data.list;
			var tpl = $('#tpl2').html();
			var htmlStr = _.template(tpl)({list: list});
			$('.coupons_list').append(htmlStr);
			
		},
		
		// 计算需支付金额
		getNeedPay: function(){
			var totalPrice = $('#pay_account').text();
			var disPrice = $('#order_discount').text();
			$('#need_pay').text(totalPrice - disPrice)
			
		},
		
		// 跳出优惠券列表事件
		getCoupons: function(){
			$('#coupons_Pop').removeClass('dsn');
			
		},
		
		// 选择优惠券事件
		selectCoupons: function($ele){
			this.liIndex = $ele.parent('li').index();
			$ele.parent('li').addClass('select');
			$ele.parent('li').siblings().removeClass('select');
		},
		
		// 确认选择优惠券事件
		couponsConfirm: function(ev){
			var $target = $(ev.currentTarget);
			var index = $target.index();
			var lis = $('.coupons_list .select');
			var amount = $('.coupons_list li').eq(this.liIndex).find('#amount').text();
			var minBuyAmount = parseInt($('.coupons_list li').eq(this.liIndex).find('#minBuyAmount').text());
			var payAccount = parseInt($('#pay_account').text());
			var expDate = lis.data('expdate');
			var htmlCp = $('.coupons_list li').eq(this.liIndex).find('#amount').text();
			// 点击取消，弹框消失，移除优惠券。
			if (index === 0){
				$('#coupons_Pop').addClass('dsn');
			};
			if (index ===1 && this.liIndex === 0){
				$('#coupons_Pop').addClass('dsn');
				$('#good_coupons .container_right').text('不使用优惠券');
				$('#order_discount').text(0);
			// 点击确认，判断是否符合条件。若符合，优惠券一栏显示优惠券信息
			// 若金额符合，则添加
			// 判断优惠券过期，
			} else if (index === 1 && new Date()>new Date(expDate)){
				common.showDialog('优惠券已过期');
			// 购买金额是否符合使用优惠券条件金额
			} else if (index === 1 && payAccount<minBuyAmount){
				common.showDialog('您的金额未符合优惠券条件',1000)
			// 若都符合，则重新渲染
			} else if (index === 1 && payAccount>minBuyAmount){
				$('#order_discount').text(amount);
				$('#good_coupons .container_right').html(htmlCp+'元');
				$('#coupons_Pop').addClass('dsn');
			} ;
			this.getNeedPay()
		},
		
		// 查询列表
		queryList: function(){
			var self = this;
			var list = common.getData('idList')
			var url = common.urlRoot + '/placeOrder';
			var data = {
				list: list
			};
			common.ajax(url, data, function(res){
				self.render(res)
			})
		}
	}
	// 执行初始化
	playOrder.init()
})();
