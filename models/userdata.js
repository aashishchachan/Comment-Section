const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const UserData= new Schema({
    username: String,
    comments: [String]
})

module.exports= mongoose.model('UserData', UserData);