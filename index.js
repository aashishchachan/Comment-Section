const express=  require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash')

var cookieParser = require('cookie-parser');
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'))

app.use(express.urlencoded( {extended: true}));  // now req.body will have all the data received from post request of forms
app.use(express.json())  //

const mongoose = require('mongoose');
const UserData= require('./models/userdata');
const Comments = require('./models/comments')
const { MongoServerSelectionError } = require('mongodb');

const sessionconfig = {
    //store,
    //name : 'session',
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}
app.use(session(sessionconfig))
app.use(flash())
// app.use(passport.initialize());
// app.use(passport.session())
app.use(cookieParser());

//var user={};
//var comments={};

mongoose.connect('mongodb://localhost:27017/db1', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, })
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'))
db.once("open", function () {
    console.log('Database Connected');
})

app.set('view engine', 'ejs');

app.listen(3000, ()=> {
    console.log("listening 3000");
})

app.get('/', (req, res)=>{
    res.render('index.ejs');
})

app.get('/login', (req, res)=>{
    res.render('index.ejs');
})

app.post('/login', async (req, res)=>{   
    const {username, password} = req.body;
    if (username===""  || password==="") {req.flash('error',"username or password can't be empty");res.redirect('/login') } 
    await UserData.findOne({username: username})
                    .then((dat)=>{console.log(dat); user =dat})
                    .catch((err)=> console.log(err));
    if(user){
        data=user;
    }
    else{
        data = new UserData({username, comments: []}); 
        data.save()
            .then(console.log('created')) 
            .catch((err)=>console.log(err));
    }
        res.render('mycomments.ejs', {data});
})

app.post('/allcomments', async (req, res)=>{
    await Comments.find({}).then((dat)=>user=dat);
    res.render('/allcomments.ejs', {user})
})

app.post('./newcomment', async (req, res)=>{
    const {username, comment} =req.body;
    await UserData.findOne({username}).then((dat)=>{dataU=dat; user=dat.comments});
    user.push(comment);
    await UserData.findOneAndUpdate({username}, {comments:user}).then(()=>console.log('done'));
    await Comments.InsertOne({username, comment}).then((dat)=>console.log(dat));
    res.render('/mycomments', {data});
})

app.post('/delete', async(req, res)=>{
    const {ind, username} = req.body;
    await UserData.findOne({username}).then((dat)=>{data=dat; user=dat.comments});
    comment=user[ind];
    user.splice(ind, 1);
    await UserData.findOneAndUpdate({username}, {comments:user}).then(()=>console.log('done'));
    await Comments.deleteOne({username, comment}).then((dat)=>console.log(dat));
    res.render('/mycomments', {data});
})