const express = require('express');
var bodyParser = require('body-parser');


const route = require('./route/route');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Amit:THmzVZv3QBLW11Z1@cluster0.zkmhi.mongodb.net/group6Database", {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});