const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const moment = require("moment")
const mongoose = require("mongoose")

let validateRating = function (rating) {
    return /^[12345]$/.test(rating);
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createReview = async (req, res) => {
    try {
        const data = req.body
        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "please fill all required feilds" })
        }
        const { bookId } = req.params
        if (!isValidObjectId(bookId)){
            return res.status(400).send({ status: false, message: "please give valid book id" })
        }
        const book = await bookModel.findById(bookId)
        if (!book) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }
        if (book.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Book is deleted" })
        }
        data.rating = Number(data.rating)
        if (!validateRating(data.rating)) {
            return res.status(400).send({ status: false, message: "Please enter a rating, between 1 t0 5" })
        }
        data.reviewedAt = moment().format()
        data.bookId = bookId
        const review = await reviewModel.create(data)
        await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } })
        return res.status(201).send({ status: true, message: "success", data: review })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateReview = async (req, res) => {
    try {
        let data = req.body
        let bkId = req.params.bookId
        let rvId = req.params.reviewId

        if (!isValidObjectId(bkId)){
            return res.status(400).send({ status: false, message: "please give valid book id" })
        }
        if (!isValidObjectId(rvId)){
            return res.status(400).send({ status: false, message: "please give valid book id" })
        }
        if (!Object.keys(data).length > 0) return res.status(400).send({ status: false, message: "Please enter data for updation" })

        const bookPresent = await bookModel.findById({ _id: bkId })

        if (!bookPresent) return res.status(404).send({ status: false, message: "Book not found" })

        if (bookPresent.isDeleted == true) return res.status(400).send({ status: false, message: "Book is Deleted" })

        if (data.rating) {
            data.rating = Number(data.rating)
            if (!validateRating(data.rating)) {
                return res.status(400).send({ status: false, message: "Please enter a rating, between 1 t0 5" })
            }
        }

        const review = await reviewModel.findById({ _id: rvId })

        if (!review) return res.status(404).send({ status: false, message: "review not found" })

        if (review.isDeleted == true) return res.status(400).send({ status: false, message: "review is deleted" })

        const update = await reviewModel.findOneAndUpdate({ _id: rvId }, { $set: data }, { new: true })

        const totalBookReview = await reviewModel.find({bookId: bkId, isDeleted: false}).select({bookId: 1, reviewedBy: 1,reviewedAt: 1,rating: 1,review: 1})

        const newBook = JSON.parse(JSON.stringify(bookPresent))
        newBook.reviewsData = [...totalBookReview]


        return res.status(200).send({ status: true, message: "Book list", data: newBook })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { reviewId, bookId } = req.params
        if (!isValidObjectId(bookId)){
            return res.status(400).send({ status: false, message: "please give valid book id" })
        }
        if (!isValidObjectId(reviewId)){
            return res.status(400).send({ status: false, message: "please give valid review id" })
        }
        const book = await bookModel.findById(bookId)
        if (!book) {
            return res.status(404).send({ status: false, message: 'book not found' })
        }
        if (book.isDeleted == true) {
            return res.status(400).send({ status: false, message: 'book already deleted' })
        }
        const review = await reviewModel.findById(reviewId)
        if (!review) {
            return res.status(404).send({ status: false, message: 'review not found' })
        }
        if (review.isDeleted == true) {
            return res.status(400).send({ status: false, message: 'review already deleted' })
        }
        if (bookId != review.bookId){
            return res.status(404).send({ status: false, message: 'review not found for this book' })
        }
        const delReview = await reviewModel.findByIdAndUpdate(reviewId, { isDeleted: true }, { new: true })
        await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        return res.status(200).send({ status: true, data: delReview })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview





