const urlModel=require('../models/urlModel')
const validUrl = require('valid-url')
const shortid = require('shortid')
const baseUrl='http://localhost:3000'

const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  10023,
  "redis-10023.c8.us-east-1-4.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("g6SVK8Vi3BEIrxxlasgMPfuaygE9kAji", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const shortUrl=async function(req,res){
   try{
    let longUrl=req.body.longUrl;
   if(!longUrl){
return res.status(400).send({status:false,msg:"longUrl is required"})
   }
if(Object.keys(req.body).length==0 || Object.keys(req.body).length>1)
{
    return res.status(400).send({ status: false, Message: "Invalid Request Params only one parameter required" });
}
if (!validUrl.isUri(longUrl)) {
    return res.status(400).json('Invalid base URL')
}
    let check=await urlModel.findOne({longUrl:longUrl})
    if(check){
        return res.status(409).send({status:false,message:"already exist"})
    }
    const urlCode = shortid.generate(longUrl)
    let url=await urlModel.findOne({urlCode:urlCode}).select({_id:0,_v:0})
    if(url){
        return res.status(409).send({status:false,message:"already exist"})
    }
    const shortUrl = baseUrl + '/' + urlCode
    const newUrl={longUrl,shortUrl,urlCode}
    const short=await urlModel.create(newUrl)
    const newData={
    urlCode:short.urlCode,
    longUrl:short.longUrl,
    shortUrl:short.shortUrl
    }  
return res.status(201).send({status:true,data:newData})
}catch(err){
return res.status(500).send({status:false,Message:err.message});    
}
}

const getShortUrl=async function(req,res){
try{
    let urlCode=req.params.urlCode;
       
    let url=await urlModel.findOne({urlCode:urlCode})
    if(url){
        return res.status(302).redirect(url.longUrl)
    }
    return res.status(404).send({status:false,message:"url not found"})
}catch(err){
return res.status(400).send(err.message)        
}
}

module.exports={shortUrl,getShortUrl}


//g6SVK8Vi3BEIrxxlasgMPfuaygE9kAji

//redis-10023.c8.us-east-1-4.ec2.cloud.redislabs.com












