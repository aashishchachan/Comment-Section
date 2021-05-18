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
        res.redirect( 307, `${data._id}/mycomments`);
})

app.post('/:_id/allcomments', async (req, res)=>{
    id=req.params._id;
    await Comments.find({}).then((data)=>{comments=data});
    await UserData.findById(id).then((data)=>{user=data});
    res.render('allcomments.ejs', {user, comments})
})

app.post('/:_id/mycomments', async (req, res)=>{
    id=req.params._id;
    await UserData.findById(id).then((data)=>{user=data});
    res.render('mycomments.ejs', {user})
})

app.post('/:_id/newcomment', async (req, res)=>{
    const {comment} =req.body;
    const id = req.params._id;
    await UserData.findById(id).then((data)=>{user=data});
    if(comment==="") {res.render('mycomments.ejs', {user});}
    else {user.comments.push(comment);
    await UserData.findByIdAndUpdate(id, {comments:user.comments}, {new:true}).then((data)=>{user=data});
    const cmnt = new Comments ({username: user.username, comment})
    cmnt.save();
    res.render('mycomments.ejs', {user});}
})

app.post('/:_id/:ind/delete', async(req, res)=>{
    const {id:_id, ind} = req.params;
    await UserData.findById(id).then((data)=>{user=data});
    comment=user.comments[ind];
    user.comments.splice(ind, 1);
    await UserData.findByIdAndUpdate(id, {comments:user.comments}, {new:true}).then((data)=>{user=data});
    await Comments.deleteOne({username: user.username, comment});
    res.render('mycomments.ejs', {user});
})