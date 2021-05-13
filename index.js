const express=  require('express');
const app = express();
app.use(express.urlencoded( {extended: true}));  // now req.body will have all the data received from post request of forms
app.use(express.json())  //

const mongoose = require('mongoose');
const UserData= require('./models/UserData');
const { MongoServerSelectionError } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/db', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("CONNECTION OPEN")
    })
    .catch(()=>{
        console.log("CONNECTION FAILED")
        console.log(err)
    });


app.set('view engine', 'ejs');

app.listen(3000, ()=> {
    console.log("listening 3000");
})

app.get('/', (req, res)=>{
    res.render('index.ejs');
})

app.post('/login', (req, res)=>{
    const {username, email, password} = req.body;
    const data = new UserData({username, email, password});
    data.save()
    res.render('comments.ejs');
})