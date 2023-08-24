// chenhuaan
// 注册页面


// 立即运行
(function() {
	var register = {
		
		// 初始化
		init: function(){
			this.bindEvents()
		},
		
		// 绑定事件
		bindEvents: function(){
			var self = this;
			$('#getCode').on('click',function(){
				self.getCode()
			});
			$('#submit').on('click',function(){
				self.submit()
			})
		},
		
		// 提取验证码
		
		getCode: function(){
			var phone = $('#phone').val();
			var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/ ;
			if (!phone){ 
				alert('手机号不能为空，请填入手机号');
				return
			}
			
			if(!phoneReg.test(phone)){
				alert('手机号码不正确，请重新输入密码');
				return
			}
			
			// 倒计时
			var count = 60;
			var $getCode = $('#getCode');
			$getCode.prop('disabled', true);
			var countDown = window.setInterval(function() {
				$getCode.val('   '+--count +'秒后失效');
				if (count === 0) {
					window.clearInterval(countDown);
					$getCode.val('重新获取验证码');
					// 	启用点击
					$getCode.prop('disabled', false);
				}
			}, 1000);
			// 发送请求
			var url = common.urlRoot + '/getVerifyCode';
			var data = {
				phone: phone
			};
			common.ajax(url, data, function(res) {
				alert('验证码已经发送到尾号为'+phone.slice(7)+'的手机,请注意查收');
			});
		},
		// 立即注册
			submit: function(){
				var username = $('#username').val();
				var phone = $('#phone').val();
				var psw = $('#psw').val();
				var code = $('#code').val();
				var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/ ;
				var pswReg = /^\w{6,18}$/;
				
				if(!username){
					alert('用户名不能为空，请输入用户名');
					return
				}
				// if(!phone){
				// 	alert('手机号码不能为空，请输入手机号');
				// 	return
				// }
				// if(!phoneReg.test(phone)){
				// 	alert('手机号码不正确，请重新输入密码');
				// 	return
				// }
				// if(!psw){
				// 	alert('密码不能为空，请输入密码');
				// 	return
				// }
				// if(!pswReg.test(psw)){
				// 	alert('请输入6到18位字母、数字或下划线的组合');
				// 	return
				// }
				// if(!code){
				// 	alert('验证码不能为空，请输入验证码');
				// 	return
				// }
				// if(!$('#chk').prop('checked')){
				// 	alert('请勾选协议');
				// 	return
				// }
				var url = common.urlRoot + '/register';
				var data = {
					// phone: phone,
					password: psw,
					// verifyCode: code,
					username: username
				};
				common.ajax(url,data,function(res){
					alert('注册成功');
					location.href = 'login.html'
				})
			}
	}
	// 执行初始化
	register.init()
})()
