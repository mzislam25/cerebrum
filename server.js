const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./shared/config');
const User = require('./models/UserSchema');
const Log = require('./models/LogSchema');

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

app.get('/', function (req, res) {
    res.render('login');
});
app.post('/', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    try {
        const user = await User.findOneAndUpdate({ username: username, email: email }, {}, { new: true, upsert: true });
        if (user) {
            req.session.loggedin = true;
            req.session.user = user._id;
        }
    } catch (err) { console.error(err); }
    res.redirect('/home');
});

app.get('/home', async (req, res) => {
    let username = "Guest"; let userId = null;
    if (req.session.loggedin) {
        try {
            const user = await User.findById(req.session.user);
            if (user) { username = user.username; userId = user._id }
        } catch (err) { console.error(err) }
    }
    res.render('home', { username, userId });
});

app.post('/record', async (req, res) => {
    try {
        const log = new Log(req.body);
        await log.save();
        res.send(true);
    } catch (err) {
        console.error(err);
        res.send(false);
    }
});

app.get('/record', async (req, res) => {
    let record = 0;
    if (req.session.loggedin) {
        try {
            const user = await User.findById(req.session.user);
            if (user) {
                const userLog = await Log.find({ size: req.query.size, userId: user._id }).sort({ time: 1 }).limit(1);
                if (userLog[0]) record = userLog[0].time;
            }
        } catch (err) { console.error(err) }
    } else {
        try {
            const log = await Log.find({ size: req.query.size }).sort({ time: 1 }).limit(1);
            if (log[0]) record = log[0].time;
        } catch (err) { console.error(err) }
    }
    const minutes = Math.floor(record / 60);
    const seconds = record - minutes * 60;
    res.send(minutes + " mins " + seconds + " secs");
})

app.listen(config.PORT, async () => {
    console.log(`Server started at port ${config.PORT}`);
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    } catch (err) {
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