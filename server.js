const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('login', { title: 'Login' });
});

app.get('/home', function (req, res) {
    const user = req.session.user || "Guest";
    const user_best = 10;
    //TODO: if user got best retrieve best
    const minutes = Math.floor(user_best / 60);
    const seconds = user_best - minutes * 60;
    const best_record = minutes + " mins " + seconds + " secs";
    res.render('home', { title: 'Welcome to Cerebrum', user, best_record });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});

