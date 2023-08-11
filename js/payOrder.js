
(function(){
	var payOrder = {
		// 初始化
		init: function(){
			this.initVm()
		},
		initVm: function(){
			this.vm = new Vue({
				el: '#pay_order_main',
				data: {
					couponList: [],
					cartList: JSON.parse(localStorage.selectedRows),
					showCoupon: false,
					deliveryTypeIndex: 0,
					selectedCoupon: ''
				},
				mounted() {
					this.queryCoupon()
				},
				computed: {
					allMount() {
						let total = 0
						this.cartList.map(list => {
							total += list.num * list.price
						})
						return total
					},
					totalMount() {
						let total = this.allMount
						if (this.selectedCoupon) {
							total -= this.selectedCoupon.money
						}
						return total
					}
				},
				// 绑定事件
				methods: {
					queryCoupon(){
						const url = common.urlRoot + '/queryUserCoupon';
						common.ajax(url, {}, res => {
							this.couponList = res.data
						})
					},
					parseTime(time, type) {
						let date = new Date(time*1);
						let Year = date.getFullYear();
						let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
						let Day  = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
						let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
						let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
						let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
						let GMT1 =  Year + '' + Moth + Day + Hour + Minute + Sechond;
						let GMT2 =  Year + '-' + Moth + '-' + Day 
						return type ? GMT1 : GMT2
					},
					onChooseCoupon(currentCoupon) {
						this.selectedCoupon = currentCoupon
					},
					onConfirmCoupon() {
						this.showCoupon = false
					},
					closeCouponDialog() {
						this.selectedCoupon = ''
						this.showCoupon = false
					},
					onSubmitOrder() {
						const payInfo = {
							orderNum: this.parseTime(new Date().getTime(), 1),
							allMount: this.allMount,
							totalMount: this.totalMount,
							discount: this.selectedCoupon
						}
						localStorage.payInfo = JSON.stringify(payInfo)
						location.href = 'payIndex.html';
					}
				}
			})
		}

	}
	// 执行初始化
	payOrder.init()
})();
