const express = require('express')
const app = express()
const fs = require('fs');
var cors = require('cors')
app.use(express.urlencoded())

app.post('/getTourList', cors(), (request, response) => {
  let data = fs.readFileSync('./tour-list.json', 'utf8');
  response.send(data)
})

app.post('/getDetail', cors(), (request, response) => {
  let data = fs.readFileSync('./details.json', 'utf8');
  const res = {
    "resCode": "200",
    "resMsg": "获取度假明细成功",
    "data": eval(data).find(item => item.productId === request.body.productId)
  }
  response.send(res)
})
  
app.listen(3030, function () {
  console.log('app listening on port 3030!')
})