
const express=require('express')
const route=express.Router();
const urlController=require('../controller/urlController')

route.post("/url/shorten",urlController.shortUrl)
route.get("/:urlCode",urlController.getShortUrl)
module.exports=route;







