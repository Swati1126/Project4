const UrlModel = require("../model/UrlModel.js")
const shortid = require('shortid');
const config = require('config')
const redis= require('redis')
const { promisify } = require("util");


const redisClient = redis.createClient(
    13308,
    "redis-13308.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("hKjsottYqwYw75XTWYDvyQlm4iQkI4Ty", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});




//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

 const isValidUrl = function(longUrl){
     return /^((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(longUrl)
 }

const generateShortUrl = async (req, res) => {

    try {

        const { longUrl } = req.body
        

        if (!isValid(longUrl)) return res.status(400).send({ status: false, message: "Please enter Url" })

        if (!isValid.isUri(longUrl)) return res.status(400).send({ status: false, message: "Url is not valid" })

        //if (!isValidUrl(longUrl)) return res.status(400).send({ status: false, message: "Url is not valid" })

        const presentUrl = await UrlModel.findOne({ longUrl }).select({_id:0, longUrl: 1, shortUrl: 1, urlCode: 1 })

        if (presentUrl) return res.status(200).send({ status: true, data: presentUrl })

        const baseUrl = 'http:localhost:3000'

        if (!isValid.isUri(baseUrl)) return res.status(400).send({ status: false, message: "baseUrl is not valid" })

        const urlCode = shortid.generate()

        const shortUrl = baseUrl + '/' + urlCode

        const newUrl = {
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: urlCode
        }

        const generatedUrl = await urlModel.create(newUrl)
        return res.status(201).send({ status: true, data: newUrl })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

// const fetchlongUrl = async function (req, res) {
//     let cahcedUrlData = await GET_ASYNC(`${req.body.longUrl}`)
//     if(cahcedUrlData) {
//       res.send(cahcedUrlData)
//     } else {
//       let url = await urlModel.findOne({longUrl:req.body.longUrl})//.select({_id:0, longUrl: 1, shortUrl: 1, urlCode: 1 });
//       await SET_ASYNC(`${req.body.longUrl}`, JSON.stringify(url))
//       res.send({ data: url });
//     }
  
//   };

//-----------------------------------------------------------------------------------------------------


const getUrl = async (req, res) => {
    try {
        const { urlCode } = req.params;

        if (!isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid Url" })

        let cahcedUrlData = await GET_ASYNC(`${urlCode}`)  

        if(cahcedUrlData){
            let data = JSON.parse(cahcedUrlData)
            return res.redirect(data.longUrl)
        }

        const result = await urlModel.findOne({ urlCode })
        if (!result) {
            return res.status(404).send({ status: false, message: "Url doesn't exist" });
        }

        await SET_ASYNC(`${urlCode}`, JSON.stringify(result))

        return res.redirect(result.longUrl)


    } catch (error) {
        return res.status(500).send({ status: true, msg: error.message })
    }
}

module.exports.generateShortUrl = generateShortUrl
module.exports.getUrl = getUrl
//module.exports.fetchlongUrl = fetchlongUrl
