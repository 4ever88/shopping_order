// 1. 加载msyql
var mysql = require('mysql');
 
// 2. 创建连接
var connection = mysql.createConnection({
  host     : 'localhost',   // 你要连接的数据库服务器的地址
  port     : 3306,// 端口号
  user     : 'root',        // 连接数据库服务器需要的用户名
  password : 'abc123',        // 连接数据库服务器需要的密码
  database : 'shopping_order'      //你要连接的数据库的名字
  // database : 'shopping_cart'      //你要连接的数据库的名字
});
 
// 3. 连接数据库
connection.connect((err) => {
  // 如果有错误对象，表示连接失败
  if (err) return console.log('数据库连接失败')
  // 没有错误对象提示连接成功
  console.log('mysql数据库连接成功')
});
 
module.exports = connection