(function(){
	var result = {
		
		// 初始化
		init: function(){
			this.initVm()
		},

		initVm: function(){
			this.vm = new Vue({
				el: '#main',
				data: {
					shopList: JSON.parse(localStorage.selectedRows),
					payInfo: JSON.parse(localStorage.payInfo)
				},
				mounted() {
				},
				computed: {
	
				},
				// 绑定事件
				methods: {
				
				}
			});
		}
		
	}
	// 执行初始化
	result.init();
})();
