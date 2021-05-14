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
const UserData= require('./models/UserData');
const Comments = require('./models/Comments')
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
app.use(passport.initialize());
app.use(passport.session())
app.use(cookieParser());

const user;
const comments;

mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, })
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

app.post('/login', (req, res)=>{
    comments = Comments.find({});   
    const {username, email, password} = req.body;
    if (username==="" || password==="") req.flash('error',"username or password can't be empty");res.redirect('/login')  
    user = await UserData.find({username: username})
                    .catch(()=>{const data = new UserData({username, email, password}); data.save();})
    res.render('comments.ejs', {user, comments});
})

app.post('allcomments')