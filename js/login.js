// chenhuaan
// 登录页面

// 立即执行

(function(){
	
	var login = {
		
		// 初始化
		init: function(){
			var phone = localStorage.getItem('userName');
			// 如果缓存有数据，则显示数据，默认打勾。否则无打勾，不显示用户名。
			if (!!phone){
				$('#user-name').val(phone);
				$('#checkbox').prop('checked',true)
			} else $('#user-name').val('')
			this.bindEvents()
			
		},
		
		// 绑定事件
		bindEvents: function(){
			var self = this;
			$('#submit').on('click',function(){
				self.login()
			})
		},
		
		login: function(){
			var userName = $('#user-name').val();
			var psw = $('#password').val();
			var pswReg = /^\w{6,18}$/;
			// 检查是否打勾，打勾则保存用户名，否则删除用户名
			if ($('#checkbox').prop('checked')){
				localStorage.setItem('userName',userName)
			} else localStorage.removeItem('userName');
			if (!userName){
				alert('用户名不能为空，请输入用户名');
				return false;
			}
			if (!psw){
				alert('密码不能为空，请输入密码');
				return false;
			}
			var url = common.urlRoot + '/login';
			var data = {
				username: userName,
				password: psw
			};
			common.ajax(url, data, function(res){
				localStorage.username = userName
				alert('登录成功!')
				location.href = 'home.html'
			})
		}
	}
	
	// 执行初始化
	login.init()
})();
