const express = require('express');
const app = express();
app.use(express.static('public'))
let urlencodedParser = express.urlencoded({ extended: true });

const nunjucks = require('nunjucks');
nunjucks.configure('templates', { autoescape: true, express: app });

const events = require('./events.json');
const serverID = require("./severID.json");

const bcrypt = require('bcryptjs');
let nRounds = 13;

let host = 'localhost';
let port = 3002;

let serverStart = new Date(); // Server start Date time
let memberApplications = [];

app.get('/', function(req, res) {
    res.render('index.njk', { scriptFile: "index.js" });
});

app.get('/index', function(req, res) {
    res.render('index.njk', { scriptFile: "index.js" });
});

app.get('/login', function(req, res) {
    res.render('login.njk', { scriptFile: "login.js" });
});

app.get('/membership', function(req, res) {
    res.render('membership.njk', { scriptFile: "signup.js" });
});

app.post('/membershipSignup', urlencodedParser, function(req, res) {
    let salt = bcrypt.genSaltSync(nRounds);
    let newuser = {
        "name": req.body.name,
        "email": req.body.email,
        "password": bcrypt.hashSync(req.body.password, salt),
        "how": req.body.how,
        "comments": req.body.comments
    };

    console.log(`\n New Membership: \n`);
    console.log(newuser);
    memberApplications.push(newuser);

    res.render('thanks.njk', { info: newuser });
});

app.get('/activities', function(req, res) {
    var info = { scriptFile: "activities.js", events: events };
    res.render('activities.njk', info);
});

app.get('/uptime', function(req, res) {
    let curDate = new Date();
    let data = { startDate: serverStart, currentDate: curDate };
    res.render('uptime.njk', data);
});

app.get('/serverId', function(req, res) {
    console.log(serverID);
    res.send(`studentName: "${serverID.studentName}" <br/> netId: "${serverID.netId}" <br/> message: "${serverID.message}"`);
});

app.listen(port, host, function() {
    console.log(`deployTest.js app listening on IPv4: ${host}:${port}`);
});