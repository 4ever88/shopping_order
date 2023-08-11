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
					showEditCount: false,
					showEditNum: false,
					showEmpty: false,
					confirmDelete: false
				},
				mounted() {
					this.queryList()
				},
				computed: {
					amount() {
						let total = 0
						if (!this.cartList.length || !this.selectedProducts.length) return 0
						this.selectedRows.map(list => {
							const { price, num } = list
							total += (price * num)
						})
						return total
					},
					selectedRows() {
						const rows = []
						this.selectedProducts.map(productId => {
							this.cartList.map(list => {
								if (list.productId === productId) {
									rows.push(list)
								}
							})
						})
						return rows
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
							this.showEmpty = true
							return
						}
						localStorage.selectedRows = JSON.stringify(this.selectedRows)
						location.href = "./payOrder.html"
					},
					editCart() {
						this.isEdit = !this.isEdit
						if (!this.isEdit) {
							this.addCart()
						}
					},
					// 加入购物车，请求数据
					addCart () {
						var url = common.urlRoot + '/addToShopCar';
						this.cartList.map(item => {
							const data = {
								productId: item.productId,
								prdNum: item.num
							};
							common.ajax(url, data, res => {
								console.log(res.msg)
							})
						})
					},
					confirmDeleteCart() {
						if (!this.selectedProducts.length) {
							this.showEmpty = true
							return
						}
						this.confirmDelete = true
					},
					deleteCart() {
						const url = common.urlRoot + '/deleteShopCart';
						const params = {
							deleteList: this.selectedProducts
						}
						common.ajax(url, params, res => {
							alert('删除成功!')
							this.confirmDelete = false
							this.queryList()
						})
					},
					minusNum(product, index) {
						const { num } = product
						if (num === 1) return
						const cartList = [...this.cartList]
						cartList[index].num--
						this.cartList = cartList
					},
					addNum(product, index) {
						const cartList = [...this.cartList]
						cartList[index].num++
						this.cartList = cartList
					}
				}
			});
		},
		
	}
	shoppingCar.init()
})();
