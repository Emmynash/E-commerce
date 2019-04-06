const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Passport = require('passport');

const app = express();
const port = 3000;

const db = require('./config/keys').mongoURI;
const { router } = require('./Routes/API/users');
const passport = require('./config/passport');

// bodyParser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// connect db
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('sucessfully connected to database'))
    .catch((err) => console.log(`unable to connect to database, ${err}`));


// passport middleware
app.use(Passport.initialize());

// Routes middleware
app.use('/api/users', router);

app.listen(port, (err) => {
    if (err) {
        return console.log(`server unable to start on port ${port}`)
    }
    console.log(`server running on port ${port}`);
})