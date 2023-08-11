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
					couponList: []
				},
				// 绑定事件
				methods: {
					touchCoupon(id){
			
						this.saveCoupon(id)
					},
					saveCoupon(id) {
						const couponList = Array.from(new Set([...this.couponList.map(item => item.couponId), id]))
						const params = {
							couponList: couponList
						}
						const url = common.urlRoot + '/saveCoupon';
						common.ajax(url, params, res => {
							this.currentCoupon = couponList
						})
					}
				}
			});
		},

		
		// 绑定事件
		bindEvents: function(){
			const self = this;
			$('#btn_more a').on('click',function(){
				self.getMore();
			});
			$('#product_list').on('click','.product_car',function(){
				const id = $(this).closest('li').data('id');
				self.addCart(id);
			});
			// 点击推广商品进入详情
			$('#img').on('click',function(){
				self.getDetail(this);
			});
			// 点击列表图片进入详情
			$('#product_list').on('click','.product_box img',function(){
				self.getDetail(this);
			});
		},
		
		// 渲染页面
		render: function(data){
			// 渲染推广商品
			const firstPrd = data[0];
			$('#img').attr('src',firstPrd.imgUrl);
			$('#old-price').text(firstPrd.oldPrice.toFixed(2));
			$('#price').text(firstPrd.price.toFixed(2));
			// 渲染列表商品
			const list = data.slice(1);
			const tpl = $('#tpl').html();
			const htmlStr = _.template(tpl)({list: list});
			$('#product_list').html(htmlStr);
			if (data.shopNum>=1){
				$('#carNum').removeClass('dsn').text(data.shopNum)
			}
			
		},
		
		// 提取商品id和商品种类数量shopNum
		getDetail: function(ele){
			const id = $(ele).closest('li').data('id');
			const shopNum = $('.car_trolley').text();
			const data = {
				id: id,
				shopNum: shopNum
			};
			location.href = 'detail.html?'+$.param(data)
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
