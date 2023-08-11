// chenhuaan
// 详情页面

// 立即执行
(function() {
	var detail = {

			// 初始化
			init: function() {
				// this.bindEvents();
				this.initVm()
			},

			// 初始化数据模型
		initVm: function(){
			this.vm = new Vue({
				el: '#detail_main',
				data: {
					detail: {},
					num: 1,
					cartNum: 0,
					cartList: []
				},
				mounted() {
					this.queryDetail()
					this.queryList()
				},
				// 绑定事件
				methods: {
					// 加入购物车，请求数据
					addCart () {
						var url = common.urlRoot + '/addToShopCar';
						var productId = common.getParam('productId');
						var data = {
							productId: productId,
							prdNum: this.num
						};
						common.ajax(url, data, res => {
							alert('添加购物车成功!')
							this.queryList()
						})
					},
					minusNum() {
						if (this.num === 1) return
						this.num--
					},
					addNum() {
						this.num++
					},
					// 请求数据
					queryDetail() {
						var productId = common.getParam('productId')
						var url = common.urlRoot + '/productDetail';
						var data = {
							productId: productId
						};
						common.ajax(url, data, res => {
							this.detail = res.data
						})
					},
					queryList() {
						const url = common.urlRoot + '/shopCarList';
						common.ajax(url, {}, res => {
							this.cartList = res.data
						})
					},
					
				}
			});
		}
	}
		// 执行初始化
	detail.init()
})();