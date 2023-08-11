// chenhuaan
// 结果页面

// 立即执行
(function(){
	var result = {
		
		// 初始化
		init: function(){
			this.getList()
		},
		
		// 绑定事件
		bindEvents: function(){},
		
		// 渲染页面
		render: function(data){
			var orderNum = store.get('all').orderNum;
			$('#id_pay_order').text(orderNum);
			var list = data;
			var tpl = $('#tpl').html();
			var htmlStr = _.template(tpl)({list: list});
			$('#pay_order').html(htmlStr);
		},
		
		// 取出数据
		getList: function(){
			var self = this;
			var data = store.get('data');
			self.render(data)
		}
		
	}
	// 执行初始化
	result.init();
})();
