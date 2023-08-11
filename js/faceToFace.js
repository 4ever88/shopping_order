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
			const self = this
			$('#face_pay a').on('click',function(){
				const { couponId = ''} = JSON.parse(localStorage.selectedCoupon || '{}')
				couponId.length && self.deleteCoupon(couponId)
				self.deleteProducts()
			})
		},
		
		// 渲染页面
		render: function(){
			var data = store.get('payInfo');
			$('#need_pay').text(data.totalMount)
		},
		
		// 请求数据
		queryList: function(){
			var self = this;
			self.render()
		},
		deleteCoupon: function(couponId) {
			const url = common.urlRoot + '/deleteCoupon';
			const params = {
				couponId
			}
			common.ajax(url, params, res => {
				
				// location.href = 'result.html'
			})
		},
		deleteProducts: function() {
			const url = common.urlRoot + '/deleteProducts';
			const productIds = JSON.parse(localStorage.selectedRows).map(item => item.productId)
			const params = {
				productIds: productIds
			}
			common.ajax(url, params, res => {
				location.href = 'result.html'
			})
		}

	}
	// 执行初始化
	faceToFace.init()
})();
