const redis = require("redis");

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
module.exports = {redisClient}




