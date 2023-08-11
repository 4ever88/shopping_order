
(function(){
	var payIndex = {
		
		// 初始化
		init: function(){
			this.initVm()
		},

		initVm: function(){
			this.vm = new Vue({
				el: '#pay_main',
				data: {
					payInfo: JSON.parse(localStorage.payInfo),
				},
				mounted() {
				},
				computed: {
				
				},
				// 绑定事件
				methods: {
				
				}
			})
		}
		
	}
	// 执行初始化
	payIndex.init()
})();
