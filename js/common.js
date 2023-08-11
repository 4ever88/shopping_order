/**
 * Created by huruqing on 2016/7/20 0020.
 * 公共方法
 */

(function () {
	// 需要打印请求参数的接口
	var common = {
		// 正则
		regObj: {
			// 密码正则
			pswReg: /^\w{6,18}$/,
			// 手机号码
			phoneReg: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/
		},

		init: function () {
			this.env = 'stg';
			this.urlRoot = 'http://172.16.239.145:3000';
			this.stringToFixed();
		},

		/**
		 * 使字符串也能使用保留小数点位数
		 */
		stringToFixed: function () {
			String.prototype.toFixed = function (n) {
				var num = Number(this.valueOf());
				return num.toFixed(n);
			}
		},

		/**
		 * 根据不同的环境调用不同的接口
		 * @param insName 接口名称
		 */
		getWebUrl: function (insName) {
			if (this.env === 'dev') {
				return '../json/' + insName + '.json';
			} else {
				return this.urlRoot + insName;
			}
		},

		/**
		 * 延迟执行
		 */
		delay: function (sec, callback) {
			sec = sec < 10 ? sec * 1000 : sec;
			setTimeout(function () {
				callback();
			}, sec);
		},


		/**
		 * 清空购物车
		 */
		// 清除购物车
		clearCar: function (callback) {
			var url = this.urlRoot + 'deleteAll';
			common.ajax(url, {}, function () {
				if (typeof callback === 'function') {
					callback();
				}
			});
		},

		// 获取url后面的参数
		getParam: function (variable) {
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
					return pair[1];
				}
			}
			return '';
		},

		/**
		 * 封装本地存储
		 * 存
		 * @param k string
		 */
		setData: function (k, v) {
			if (typeof v === 'object') {
				v = JSON.stringify(v);
			}
			localStorage.setItem(k, v);
		},

		/**
		 * 封装本地存储
		 * 取
		 * @param k string
		 */
		getData: function (k) {
			var v = localStorage.getItem(k);
			try {
				v = JSON.parse(v);
			} catch (e) {

			}
			return v;
		},

		ajaxSetting: function () {
			$.ajaxSettings.beforeSend = function () {
				$('#home a').text('正在加载中.....');
			}
			$.ajaxSettings.complete = function () {
				setTimeout(function () {
					$('#home a').text('好邻居');
				}, 2000);
			}

		},

		/**
		 *  公共ajax
		 */
		ajax: function (url, data, suc) {
			var type = this.env === 'dev' ? 'GET' : 'POST';
			data.username = data.username || localStorage.username
			$.ajax({
				url: url,
				type: type,
				data: data,
				dataType: 'json',
				success: function (res) {
					if (res.code === '200') {
						suc(res);
					} else {
						alert(res.msg);
					}

				},
				error: function () {
					alert('网络异常,请稍后再试')
				}
			});
		},

		// 清空购物车
		clearCar: function (callback) {
			var url = this.urlRoot + 'deleteAll';
			common.ajax(url, {}, function () {
				if (typeof callback === 'function') {
					callback();
				}
			});
		},

		// 添加到购物车
		addToCar: function (id) {
			var data = {id: id, prdNum: 1};
			var url = common.getWebUrl('addToShopCar');
			common.ajax(url, data, function (res) {});
		},

		n: 1000,
		// 间隔时间
		intTime: 1000,
		// 连续延迟执行
		delay: function(sec, callback) {
			// 只有一个参数
			if (arguments.length === 1) {
				callback = sec;
				sec = 1;
			}
			sec = sec*common.intTime || 500;
			common.n += sec;
			setTimeout(function() {
				callback();
			}, common.n);
		},

		// 测试
		test: function () {
			var count = 0;
			window.alert = function(msg) {
				console.log(++count + '.' + msg);
			}
			setTimeout(function () {
				var script = document.createElement('script');
				var href = location.href;
				var startIndex = href.lastIndexOf('/');
				var endIndex = href.indexOf('.html');
				var str = href.substring(startIndex+1,endIndex);
				script.src = '/a_huruqing/test/store/' + str + 'Test.js';
				// 只测试指定页面
				if (str.match('detail') | 1) {
					document.body.appendChild(script);
				}
			}, 1000);
		}
	};
	common.init();
	// common.ajaxSetting();
	window.common = common;
	/*var test = common.getData('test');
	if (test) {
		common.test();
	}*/
})();
