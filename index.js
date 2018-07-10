const mongoose = require('mongoose')
const axios = require('axios')
const cheerio = require('cheerio')
var Koa = require('koa')
var bodyParser = require('koa-bodyparser')
var Router = require('koa-router')
const cors = require('@koa/cors')

var app = new Koa()
app.use(cors())
app.use(bodyParser())

var router = new Router()

router.get('/', ctx => {
  ctx.body = 'Hi'
})

router.get('/scrape', async (ctx, next) => {
  let { url } = ctx.request.query
  const product = {}
  const html = await axios.get(url)
  const $ = cheerio.load(html.data)
  product.title = $('#productTitle').text().replace(/\s/g, "")
  product.price = $('#priceblock_ourprice').text().replace(/\s/g, "")
  product.image = $('#landingImage').data('old-hires').replace(/\s/g, "")
  ctx.body = product
})

app
  .use(router.routes())
  .use(router.allowedMethods())

mongoose.connect('mongodb://localhost:27017/guverydb')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  app.listen(process.env.PORT, () => {
    console.log('La app está en el puerto 3000')
  })
})
