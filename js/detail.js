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
					editNum: 0,
					num: 1,
					cartNum: 0,
					cartList: [],
					addCartSuccess: false,
					showEditNum: false
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
							this.addCartSuccess = true
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
					minusEditNum() {
						if (this.editNum === 1) return
						this.editNum--
					},
					addEditNum() {
						this.editNum++
					},
					openEditNumDialog() {
						this.editNum = this.num
						this.showEditNum = true
					},
					cancelEdit() {
						this.showEditNum = false
					},
					confirmEdit() {
						if (this.editNum <= 0) {
							alert('数量不能小于1!')
							return
						}
						this.num = this.editNum
						this.showEditNum = false
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
							this.num = this.cartList[0]?.num || 1
						})
					},
					goToPay() {
						this.detail.num = this.num
						localStorage.selectedRows = JSON.stringify([this.detail])
						location.href = "./payOrder.html"
					}
				}
			});
		}
	}
		// 执行初始化
	detail.init()
})();