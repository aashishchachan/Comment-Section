const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const UserData= new Schema({
    username: {
        type: String,
        required: true
    },  
    comments: [String]
})

module.exports= mongoose.model('UserData', UserData);