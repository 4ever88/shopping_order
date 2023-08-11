// chenhuaan
// 购物车页面

// 立即执行
(function(){
	const shoppingCar = {
		
		// 初始化
		init: function(){
			this.liIndex;
			// this.queryList();
			this.initVm()
		},

		initVm: function(){
			this.vm = new Vue({
				el: '#shopping_main',
				data: {
					cartList: [],
					selectedProducts: [],
					isCheckAll: false,
					isEdit: false,
				},
				mounted() {
					this.queryList()
				},
				computed: {
					amount() {
						let total = 0
						if (!this.cartList.length || !this.selectedProducts.length) return 0
						this.selectedProducts.map(productId => {
							this.cartList.map(list => {
								if (list.productId === productId) {
									const { price, num } = list
									total += (price * num)
								}
							})
						})
						return total
					}
				},
				// 绑定事件
				methods: {
					// 请求数据
					queryList() {
						const url = common.urlRoot + '/shopCarList';
						common.ajax(url, {}, res => {
							this.cartList = res.data
							this.selectedProducts = []
							this.isCheckAll = false
						})
					},
					selectRow(productId) {
						const { selectedProducts, cartList } = this
						selectedProducts.includes(productId)
							? this.selectedProducts.splice(selectedProducts.indexOf(productId), 1)
							: this.selectedProducts.push(productId)
						this.isCheckAll = selectedProducts.length === cartList.length
					},
					selectAll() {
						this.isCheckAll = !this.isCheckAll
						if (this.isCheckAll) {
							const selectedProducts = []
							this.cartList.map(item => {
								selectedProducts.push(item.productId)
							})
							this.selectedProducts = selectedProducts
						} else {
							this.selectedProducts = []
						}
					},
					goToPay() {
						if (this.amount === 0) {
							alert('请选择产品后再结算')
						}
					},
					editCart() {
						this.isEdit = !this.isEdit
					},
					deleteCart() {
						if (!this.selectedProducts.length) {
							alert('请先勾选产品')
							return
						}
						const url = common.urlRoot + '/deleteShopCart';
						const params = {
							deleteList: this.selectedProducts
						}
						common.ajax(url, params, res => {
							alert('删除成功!')
							this.queryList()
						})
					}
				}
			});
		},
		
		// 绑定事件
		bindEvents: function(){
			const self = this;
			// 点击编辑事件
			$('#car_edit').on('click',function(ev){
				self.carEdit($(this))
			});
			$('#shopping_list').on('click', '.number_content div',function(ev) {
				self.changeNum(ev);
			});
			$('.select_all').on('click',function(ev){
				self.selectAll()
			});
			$('#shopping_list').on('click','.no_select',function(ev){
				self.select($(this))
			});
			// 点击删除事件
			$('#delete_btn').on('click',function(ev){
				self.deletePrd()
			});
			// 点击考虑一下
			$('#shoppingcar').on('click','#sure_Del_btn .pop_remove_btn',function(ev){
				$('#sure_Del').addClass('dsn')
			});
			$('#shoppingcar').on('click','#sure_Del_btn .pop_sure_btn',function(ev){
				self.deleteCar(this)
			});
			// 点击商品数量弹框
			$('#shoppingcar').on('click','.number_edit',function(ev){
				self.editPrdPop(this);
			});
			// 点击编辑商品数量
			$('#shoppingcar').on('click','.number_box div',function(ev){
				self.editPrd(ev)
			});
			// 点击编辑商品数量菜单中的取消和确定
			$('#shoppingcar').on('click','#number_Btn div',function(ev){
				self.editPrdMenu(this)
			});
			$('#account_btn').on('click',function(){
				self.getId()
			})
		},
		
		// 渲染页面
		render: function(data){
			const tpl = $('#tpl').html();
			const htmlStr = _.template(tpl)({list: data});
			$('#shopping_list').html(htmlStr);
			const num = data.shopNum;
			if ( num === 0){
				$('#empty_cart').removeClass('dsn');
				// 隐藏其他
                $('#shoppingcar').addClass('dsn');
                $('#car_edit').addClass('dsn');
               }
			this.countAmount();
			
		},
		
		// 编辑事件
		carEdit: function($ele){
			const self = this;
			if ($ele.text() === '编辑'){
				$ele.text('完成');
				$('li').addClass('select_del');
				$('#select_all').addClass('select_del');
				$('.number').addClass('dsn');
				$('.number_content').removeClass('dsn');
				$('.no_select').removeClass('select_ok');
				$('#delete_btn').removeClass('dsn');
				$('#account_btn').addClass('dsn');
				$('#total_box').addClass('dsn');
			} else{
				const url = common.urlRoot + '/editCar';
				const lis = $('#shopping_list').find('li');
				const lists = [];
				_.each(lis, function (item) {
					const ids = $(item).data('id');
					const prdNums = $(item).find('.number span').text();
	                const list = {id: ids,prdNum: prdNums}
	                lists.push(list);
	            });
				const data = {
					list: lists
				};
				common.ajax(url, data, function(res){
					$ele.text('编辑');
					$('.number').removeClass('dsn');
					$('li').removeClass('select_del');
					$('#select_all').removeClass('select_del');
					$('.number_content').addClass('dsn');
					$('.no_select').addClass('select_ok');
					$('#delete_btn').addClass('dsn');
					$('#account_btn').removeClass('dsn');
					$('#total_box').removeClass('dsn');
					common.showDialog('编辑完成');
					self.countAmount();
				})
			}
			
		},
		
		// 加减事件
		changeNum: function(ev){
			// 获取点击的对象
			const $target = $(ev.currentTarget);
			// 点击对象的下标
			const index = $target.index();
			// 获取中间的数字对应的元素
			const $num = $target.siblings('.number_edit');
			const num = $num.text();
			// idnex==0点击的是减号 index==2点击的是加号
			if (index === 0 && num > 1) {
				$num.text(--num);
				$(ev.currentTarget).closest('li').find('.number span').text(num);
				$('#number_input').val(num);
			} else if (index === 2) {
				$num.text(++num);
				$(ev.currentTarget).closest('li').find('.number span').text(num);
				$('#number_input').val(num);
			}
		},
		
		// 全选事件
		selectAll: function(){
			// 如果全选勾选，则全部单选勾选； 否则全部单选取消勾选
			if ($('.select_all').hasClass('select_ok')){
				$('.no_select').removeClass('select_ok')
			} else {
				$('.no_select').addClass('select_ok');
			};
			this.countAmount();
			
		},
		
		// 单选事件
		select: function($ele){
			// 单选有勾去勾，无勾打勾。
			if ($ele.hasClass('select_ok')){
				$ele.removeClass('select_ok');
			} else {
				$ele.addClass('select_ok')
			};
			// 单选全部选， 全选按钮自动打勾。
			if ($('#shopping_list .no_select').length === $('#shopping_list .select_ok').length){
				$('.select_all').addClass('select_ok')
			} ;
			//单选不全部选， 全选按钮自动去勾。
			if ($('#shopping_list .no_select').length > $('#shopping_list .select_ok').length){
				$('.select_all').removeClass('select_ok');
			};
			this.countAmount();
		},
		
		// 隐藏的弹框中+-编辑商品数量事件
		editPrd: function(ev){
			// 获取点击的对象
			const $target = $(ev.currentTarget);
			// 点击对象的下标
			const index = $target.index();
			// 获取中间的数字对应的元素
			const $num = $('#number_input');
			const num = $num.val();
			// index==0点击的是减号 index==2点击的是加号
			if (index === 0 && num > 1) {
				$num.val(--num);
			} else if (index === 2) {
				$num.val(++num);
			}
		},
		
		// 手动修改商品数量事件
		editPrdPop: function(ele){
			$('#number_input').val($(ele).text());
			this.liIndex = $(ele).closest('li').index();
			$('#add_minus_Pop').removeClass('dsn')
		},
		
		// 合计事件
		countAmount: function(){
			// 提取所有打勾数组
            const $selectOk = $('#shopping_list .select_ok');
            const sum = 0;
            // 提取数组中的li
            _.each($selectOk, function (item) {
                const lis = $(item).closest('li');
                // 提取li中的价格和数量相乘
                const totalPrice = lis.find('.unit_price span').text() * lis.find('.number span').text();
                // 把所有的和相加
                sum += totalPrice;
            });
            // 填充合计费用
            $('#pay_account').text(sum.toFixed(2));
        },
        
        // 商品编辑菜单中的确定和取消事件
        editPrdMenu: function(ele){
        	const index = $(ele).index();
        	const number = $('#number_input').val();
        	if (index === 0){
        		$('#add_minus_Pop').addClass('dsn')
        	} else if (index === 1 && number >0 && number <1000){
                // 把number填充到外部的加减号中间
                $('#shopping_list li').eq(this.liIndex).find('.number_edit').text(number);
                $('#shopping_list li').eq(this.liIndex).find('.number span').text(number)
                $('#add_minus_Pop').addClass('dsn');
                
        	} else if (index === 1 && number >=1000){
        		common.showDialog('商品数量超过库存数量',800)
        	};
        	if (index === 1 && number < 1){
        		common.showDialog('商品数量有误，请重新输入',800)
        	}
        },
		
		// 删除具体商品事件
		deletePrd: function(){
			// 如果商品种类为0 ，则弹出没有选择商品
			if ($('.select_ok').length === 0){
				$('#none_Select').removeClass('dsn');
				setTimeout(function(){
					$('#none_Select').addClass('dsn')
				},400)
			} else {
				// 如果商品种类不为0，则显示删除页面
				$('#sure_Del').removeClass('dsn');
				// 确定要删除以上几种商品吗？
				$('#sure_Del span').text($('#shopping_list .select_ok').length)
			}
		},
		
		// 删除购物车数据
		deleteCar: function(){
            // 点击了考虑一下按钮
            const lis = $('#shopping_list .select_ok').parents('li');
            // 提取被选中的li商品id列表
            let ids;
            const idlist = [];
            _.each(lis, function (item) {
                ids = $(item).data('id');
                idlist.push(ids);
            });
            const url = common.urlRoot + '/deleteFromShopCar';
            const data = {
                list: idlist
            };
            common.ajax(url, data, function (res) {
                // 删除点中的li
                lis.remove();
                common.showDialog('删除成功',800)
                if ($('#shopping_list li').length === 0) {
                    // 当列表的li元素没有的时候,显示购物车空空
                    $('#empty_cart').removeClass('dsn');
                    // 隐藏其他
                    $('#shoppingcar').addClass('dsn');
                    // 隐藏编辑按钮
                    $('#car_edit').addClass('dsn');
                }
            });
            // 隐藏删除确认按钮
            $('#sure_Del').addClass('dsn');
            
        },
        
        // 提取选中商品的id列表
		getId: function(){
			const lis = $('#shopping_list .select_ok').parents('li');
			const idList = [];
			const allLists = [];
				_.each(lis, function (item) {
					const ids = $(item).data('id');
					const imgs = $(item).find('img').attr('src');
					const shopName = $(item).find('h2').text();
					const price = $(item).find('.unit_price span').text();
					const prdNum = $(item).find('.number span').text();
					const allList = {id: ids, img: imgs, shopName: shopName, price: price, prdNum: prdNum};
	                idList.push(ids);
	                allLists.push(allList)
	            });
	        const amount = $('#pay_account').text();
			common.setData('idList',idList);
			common.setData('amount',amount);
			store.set('data',allLists)
			location.href = 'playOrder.html'
		},
		
		// 查询列表
		queryList: function(){
			const self = this;
			const url = common.urlRoot + '/shopCarList';
			const data = {};
			common.ajax(url, data, function(res){
				
				
			})
		}
	}
	shoppingCar.init()
})();
