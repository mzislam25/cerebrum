const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./shared/config');
const User = require('./models/UserSchema');

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/home', async (req, res) => {
    let user = "Guest", user_record = 0;
    if(req.session.username){
        try{
            const userData = await User.findOne({username: req.session.username});
            user = userData.username;
            user_record = userData.user_record;
        }catch(err){console.error(err)}
    }
    const minutes = Math.floor(user_record / 60);
    const seconds = user_record - minutes * 60;
    const best_record = minutes + " mins " + seconds + " secs";
    res.render('home', { title: 'Welcome to Cerebrum', user, best_record });
});
app.get('/', function (req, res) {
    res.render('login', { title: 'Login' });
});
app.post('/', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const user = await User.findOneAndUpdate({ username: username }, { email: email, user_record: 0}, { new: true, upsert: true });
    req.session.loggedin = true;
    req.session.username = user.username;
    res.redirect('/home');
});

app.listen(config.PORT, async() => {
    console.log(`Server started at port ${config.PORT}`);
    try{
        await mongoose.connect(config.MONGODB_URI, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true 
        });
    }catch(err){
        console.error(err);
    }
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("Database connection established successfully");
});

db.on('disconnected', () => {
    console.log('Database disconnected');
});