const express = require('express')
const app = express()
const fs = require('fs');
var cors = require('cors')
app.use(express.urlencoded())
const connection = require('./sql');
const { stringify } = require('querystring');



const fixZero = function (id) {
  id = id*1 + 1
  while((id+'').length < 5) {
    const arr = [id]
    arr.unshift('0')
    id = arr.join('')
  }
  return id
}

const stringData = function (data) {
  const keys = ['ownCoupons']
  keys.map(key => {
    data.map(item => {
      item[key] = JSON.parse(item[key])
    })
  })
  return data
}


app.post('/getUsers', cors(), (req,res)=>{
    const { username } = req.body
    const sql = `SELECT * FROM user where username='${username}'`
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg:'查询失败', code: 0})
      } else {
          res.json({msg:'查询成功', code: '200', data: stringData(data)})
      }
    })
})
app.post('/shopListQuery', cors(), (req, res) => {
  const sql = `SELECT * FROM product_details`
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg:'查询失败', code: 0})
      } else {
          res.json({msg:'查询成功', code: '200', data: data})
      }
    })
})
app.post('/productDetail', cors(), (req, res) => {
  const { productId } = req.body
  const sql = `SELECT * FROM product_details where productId='${productId}'`
  connection.query(sql,(err, data) => {
    if(err) {
        res.json({msg:'查询失败', code: 0})
    } else {
        res.json({msg:'查询成功', code: '200', data: data[0]})
    }
  })
})
app.post('/addToShopCar', cors(), (req, res) => {
  const { username, productId, prdNum } = req.body
  const sql = `SELECT * FROM user_cart where username='${username}' and productId='${productId}'`
  connection.query(sql,(err, data) => {
    if(err) {
        res.json({msg:'添加购物车失败', code: 0})
        return
    }
    if (!data.length) {
      // 如果没有购物车数据,则创建一条
      const sqlCart = `insert into user_cart(username, productId, num) 
        values('${username}', '${productId}', '${prdNum}')`
      connection.query(sqlCart, (err, data) => {
        if(err) {
          res.json({msg:'添加购物车失败', code: 0})
        } else {
          res.json({msg:'添加购物车成功', code: '200', data: []})
        }
      })
    } else {
      // 如果有购物车数据,则更新一条
      const sqlCart = `UPDATE user_cart set num='${prdNum}' 
        where username='${username}' and productId='${productId}'`
      connection.query(sqlCart, (err, data) => {
        if(err) {
          res.json({msg:'添加购物车失败', code: 0})
        } else {
          res.json({msg:'添加购物车成功', code: '200', data: []})
        }
      })
    }
  })
})
app.post('/coupon', cors(), (req, res) => {
  const sql = `SELECT * FROM coupon`
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg:'查询失败', code: 0})
      } else {
          res.json({msg:'查询成功', code: '200', data: data})
      }
    })
})

app.post('/saveCoupon', cors(), (req, res) => {
    const { couponList, username } = req.body
    const sql = `UPDATE user set ownCoupons='${JSON.stringify(couponList)}' where username='${username}'`
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg: err.sqlMessage, code: 0})
      } else {
          res.json({msg:'保存成功', code: '200'})
      }
    })
})
app.post('/placeOrder', cors(), (req, res) => {
  let data = fs.readFileSync('./tour-list.json', 'utf8');
  response.send(data)
})
app.post('/getVerifyCode', cors(), (req, res) => {
  let data = fs.readFileSync('./tour-list.json', 'utf8');
  response.send(data)
})
app.post('/editCar', cors(), (req, res) => {
  let data = fs.readFileSync('./tour-list.json', 'utf8');
  response.send(data)
})

app.post('/deleteShopCart', cors(), (req, res) => {
  const { deleteList, username } = req.body
    const sql = `delete from user_cart where productId in (${deleteList.join(',')}) and username='${username}'`
    console.log(`deleteList.join(','):`)
    console.log(deleteList.join(','))
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg: err.sqlMessage, code: 0})
      } else {
          res.json({msg:'删除成功', code: '200'})
      }
    })
})

app.post('/shopCarList', cors(), (req, res) => {
  const { username } = req.body
  const sql = `select t1.* , t2.imgUrl imgUrl,t2.price 
    from user_cart t1 inner join product_details t2 
    on t1.productId = t2.productId 
    where t1.username='${username}'`
  connection.query(sql,(err, data) => {
    if(err) {
        res.json({msg:'查询失败', code: 0})
    } else {
        res.json({msg:'查询成功', code: '200', data: data })
    }
  })
})

app.post('/register', cors(), (req, res) => {
  const { username } = req.body
  const user = `SELECT * FROM user`
  connection.query(user, (err, userDatas) => {
    const newId = userDatas[userDatas.length - 1].userId
    const sql = `insert into user(username, userId, ownCoupons) 
    values('${username}', '${fixZero(newId)}', '[]')`
    connection.query(sql,(err, data) => {
      if(err) {
          res.json({msg:'注册失败', code: 0})
      } else {
          res.json({msg:'注册成功', code: '200', data: data})
      }
    })

  })
})

app.post('/login', cors(), (req, res) => {
  const { username } = req.body
  const sql = `SELECT * FROM user where username='${username}'`
    connection.query(sql,(err, data) => {
      if(err || !data.length) {
          res.json({msg:'登录失败', code: 0})
      } else {
          res.json({msg:'登录成功', code: '200', data: stringData(data)})
      }
    })
})

app.post('/getDetail', cors(), (req, res) => {
  let data = fs.readFileSync('./details.json', 'utf8');
  const dd = {
    "resCode": "200",
    "resMsg": "获取度假明细成功",
    "data": eval(data).find(item => item.productId === req.body.productId)
  }
  response.send(dd)
})
  
app.listen(3000, function () {
  console.log('app listening on port 3000!')
})