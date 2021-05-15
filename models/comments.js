const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const UserData = require('./userdata')

const Comments= new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'UserData'
    },
    username:{
        type: String
    },
    comment: {
        type: String
    }
})

module.exports= mongoose.model('Comments', Comments);