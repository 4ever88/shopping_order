// chenhuaan
// 列表页面

//立即执行
(function(){
	const home = {
		// 初始化
		init: function(){
			this.queryList();
			this.queryUser()
			this.queryCoupon();
			this.initVm();
		},
		// 初始化数据模型
		initVm: function(){
			const self = this;
			self.vm = new Vue({
				el: '#main',
				data: {
					homeList: [{

					}],
					couponList: [],
					currentCoupon: []
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
					}
				}
			});
		},
		
		
		addCart: function(id){
			const self = this;
			const prdNum = 1;
			const url = common.urlRoot + '/addToShopCar';
			const data = {
				id: id,
				prdNum: prdNum
			};
			common.ajax(url, data, function(res){
				// 点击添加购物车后弹框
				$('#hasAdd').removeClass('dsn');
				// 弹框0.4秒后自动消失
				setTimeout(function(){
					$('#hasAdd').addClass('dsn')
				},400);
				// 如果小红点消失，则显示
				if ($('#carNum').hasClass('dsn')){
					$('#carNum').removeClass('dsn')
				}// 如果添加产品为新，购物车商品数量加1
				const num = $('#carNum').text();
				if (res.newly === 'Y'){
					$('#carNum').text(++num);
				}
			})
		},
		
		getMore: function(){
		},
		
		// 请求数据
		queryList: function(){
			const self = this;
			const data = {}
			const url = common.urlRoot + '/shopListQuery';
			common.ajax(url, data, function(res){
				self.vm.homeList = res.data
			})
		},

		queryUser() {
			const url = common.urlRoot + '/getUsers';
			common.ajax(url, {}, res => {
				this.vm.currentCoupon = res.data[0].ownCoupons
			})
		},

		queryCoupon: function(){
			const self = this;
			const data = {}
			const url = common.urlRoot + '/coupon';
			common.ajax(url, data, function(res){
				self.vm.couponList = res.data
			})
		},

		
		
	}
	//执行初始化
	home.init()
})();
