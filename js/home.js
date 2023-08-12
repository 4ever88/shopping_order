// chenhuaan
// 列表页面

//立即执行
(function(){
	const home = {
		// 初始化
		init: function(){
			this.initVm();
		},
		// 初始化数据模型
		initVm: function(){
			this.vm = new Vue({
				el: '#main',
				data: {
					homeList: [{

					}],
					couponList: [],
					currentCoupon: [],
					cartList: [],
					hasAdd: false,
				},
				mounted() {
					this.queryList();
					this.queryUser()
					this.queryCoupon();
					this.queryShopCartList()
				},
				// 绑定事件
				methods: {
					touchCoupon(id){
						if (this.currentCoupon.includes(id)) return
						this.saveCoupon(id)
					},
					saveCoupon(id) {
						const currentCoupon = Array.from(new Set([...this.currentCoupon, id]))
						const params = {
							couponList: currentCoupon
						}
						const url = common.urlRoot + '/saveCoupon';
						common.ajax(url, params, res => {
							alert('领取成功!')
							this.currentCoupon = currentCoupon
						})
					},
					addCart(list) {
						// 加入购物车，请求数据
						const url = common.urlRoot + '/addToShopCar';
						const inCartProduct = this.cartList.find(item => item.productId = list.productId) || {}
						const prdNum = inCartProduct.num + 1
						const data = {
							productId: list.productId,
							prdNum
						};
						common.ajax(url, data, res => {
							this.queryShopCartList()
							this.hasAdd = true
						})
					},
							// 请求数据
					queryList(){
						const data = {}
						const url = common.urlRoot + '/shopListQuery';
						common.ajax(url, data, res => {
							this.homeList = res.data
						})
					},

					queryUser() {
						const url = common.urlRoot + '/getUsers';
						common.ajax(url, {}, res => {
							this.currentCoupon = res.data[0].ownCoupons
						})
					},

					queryShopCartList() {
						const url = common.urlRoot + '/shopCarList';
						common.ajax(url, {}, res => {
							this.cartList = [...res.data]
						})
					},

					queryCoupon(){
						const data = {}
						const url = common.urlRoot + '/coupon';
						common.ajax(url, data, res => {
							this.couponList = res.data
						})
					},
				}
			});
		},
	}
	//执行初始化
	home.init()
})();
