// chenhuaan
// 面对面支付页面

// 立即执行
(function(){
	var faceToFace = {
		
		// 初始化
		init: function(){
			this.queryList();
			this.bindEvents()
		},
		
		// 绑定事件
		bindEvents: function(){
			$('#face_pay a').on('click',function(){
				location.href = 'result.html'
			})
		},
		
		// 渲染页面
		render: function(){
			var data = store.get('all');
			$('#need_pay').text(data.needToPay)
		},
		
		// 请求数据
		queryList: function(){
			var self = this;
			self.render()
		}
	}
	// 执行初始化
	faceToFace.init()
})();
