const validUrl = require('valid-url')
const shortid = require('short-id')

const urlModel = require('../model/UrlModel')

const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const generateShortUrl = async (req, res) => {

    try {

        const { longUrl } = req.body

        if (!isValid(longUrl)) return res.status(400).send({status:false, message: "Please enter Url" })

        if (!validUrl.isUri(longUrl)) return res.status(400).send({ status: false, message: "Url is not valid" })

        const presentUrl = await urlModel.findOne({longUrl}).select({longUrl:1, shortUrl:1, urlCode:1})

        if(presentUrl) return res.status(200).send({ status: true, data: presentUrl })

        const baseUrl = 'http:localhost:3000'

        if (!validUrl.isUri(baseUrl)) return res.status(400).send({ status: false, message: "baseUrl is not valid" })

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

//-----------------------------------------------------------------------------------------------------


const getUrl = async (req, res) => {
    try {
        const { urlCode } = req.params;

        if (!isValid(urlCode)) return res.status(400).send({ status: false, message: "Invalid Url" })

        const result = await urlModel.findOne({urlCode })
        if (!result) {
            return res.status(404).send({ status: false, message: "Url doesn't exist" });
        }

        res.status(301).redirect(result.longUrl)


    } catch (error) {
        res.status(500).send({ status: true, msg: error.message })
    }
}

module.exports.generateShortUrl = generateShortUrl
module.exports.getUrl = getUrl
