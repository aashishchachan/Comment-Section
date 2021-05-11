const express=  require('express');
const app = express();

app.listen(3000, ()=> {
    console.log("listening 3000");
})

app.get('/', (req, res)=>{
    res.render('index.ejs');
})

app.post('/login', (req, res)=>{
    const {username, email, password} = req.body;
    console.log(username);
})