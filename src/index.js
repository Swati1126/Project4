const express = require('express');
var bodyParser = require('body-parser');


const route = require('./route/route');


const app = express();

const multer = require("multer")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://rohan7599:MipvNOjb97usB2oZ@cluster0.lviwx.mongodb.net/group6Database?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});