// chenhuaan
// 确认支付页面

//立即执行
(function(){
	var payIndex = {
		
		// 初始化
		init: function(){
			this.queryList();
			this.bindEvents()
		},
		
		// 绑定事件
		bindEvents: function(){},
		
		// 渲染页面
		render: function(data){
			$('#id_order').text(data.orderNum);
			$('#order_price').text(data.orderMoney);
			$('#order_coupons').text(data.discount);
			$('#order_needpay').text(data.needToPay)
		},
		
		// 请求数据
		queryList: function(){
			var self = this;
			var url = common.urlRoot + '/pay';
			var data = store.get('all');
			var data = {
				data: data
			};
			common.ajax(url, data, function(){
				self.render(data.data)
			})
		}
	}
	// 执行初始化
	payIndex.init()
})();
