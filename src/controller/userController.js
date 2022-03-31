const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")


const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && (value).trim().length > 0) { return true }
}

const isValidTitle = (title) => {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1

}

const register = async (req, res) => {

    try {

        let data = req.body
        if (!Object.keys(data).length > 0) {
            return res.status(400).send({ status: false, message: "Please enter some data" })
        }

        const { title, name, phone, email, password } = data

        if (!isValid(title)) {
            return res.status(400).send({status: false, message: "Title is required" })
        }

        if (!isValidTitle(title)) {
            return res.status(400).send({status: false, message: "Title should be either from ['Mr', 'Mrs', 'Miss']" })
        }

        if (!isValid(name)) {
            return res.status(400).send({status: false, message: "Name is required" })
        }

        if (!isValid(phone)) {
            return res.status(400).send({status: false, message: "Contact number is required" })
        }

        if (!isValid(email)) {
            return res.status(400).send({status: false, message: "emailId is required" })
        }

        if (!isValid(password)) {
            return res.status(400).send({status: false, message: "Password is required" })
        }

        let Email = email
        let validateEmail = function (Email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email);
        }
        if (!validateEmail(Email)) {
            return res.status(400).send({status: false, message: "Please enter a valid email" })
        }

        const Mobile = phone
        const validateMobile = function (Mobile) {
            return /^([+]\d{2})?\d{10}$/.test(Mobile)
        }
        if (!validateMobile(Mobile)) {
            return res.status(400).send({status: false, message: "Please enter valid mobile" })
        }

        const Password = password
        const validatePassword = function (Password) {
            return /^.{8,15}$/.test(Password)
        }
        if (!validatePassword(Password)) {
            return res.status(400).send({ status: false, message: "Password length must be between 8 to 15 characters" })
        }

        const emailAlreadyUsed = await userModel.findOne({ email })

        if (emailAlreadyUsed) return res.status(400).send({status: false, message: "email already registered" })


        const mobileAlreadyUsed = await userModel.findOne({ phone })

        if (mobileAlreadyUsed) return res.status(400).send({status: false, message: "mobile already registered" })

        const createdUser = await userModel.create(data)

        res.status(201).send({ status: true, data: createdUser })

    }
    catch (error) {
        res.status(500).send({status: false, message: error.message })
    }
}

const login = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!Object.keys(req.body).length > 0) {
            return res.status(400).send({ status: false, message: "Please enter some data" })
        }

        if (!isValid(email)) {
            return res.status(400).send({status: false, message: "emailId is required" })
        }

        let Email = email
        let validateEmail = function (Email) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email);
        }
        if (!validateEmail(Email)) {
            return res.status(400).send({status: false, message: "Please enter a valid email" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Password is required" })
        }

        const user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(401).send({ status: false, message: "incorrect credentials" })
        }

        // const token = jwt.sign({ id: user._id }, "projectthreebook")
        const token = jwt.sign({
            id: user._id,
            group: "06",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60
        
        }, "projectthreebook")
        // res.setheaders("x-auth-token", token)
        return res.status(200).send({ status: true, message: "success", data: token })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports.login = login
module.exports.register = register

