const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load validators
const { validateLoginInput } = require('../../Validator/login');
const { validateRegisterInput } = require('../../Validator/register');

// Load Keys
const Keys = require('../../config/keys');

// Load user model
const User = require('../../Models/users');

// Register route
// @access: public
router.post('/register', (req, res) => {
    // form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json({ success: false, errors });
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: "Email already exist" })
            }
        });

    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password
    });

    // Hash passowrd
    bcrypt.genSalt(5, (error, salt) => {
        bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) {
                return console.log(error);
            }
            newUser.password = hash;
            newUser.save()
                .then((user) => {
                    return res.json(user);
                })
                .catch((err) => console.log(err));
        })
    })
})

// Login route
// @desc Login user and return jwt token
// @access: public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json({ success: false, errors })
    }
    // find user by email

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                res.status(400).json({ success: false, email: "email does not exist" })
            }

            // check passowrd
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        // create jwt payload
                        const payload = ({
                            id: user.id,
                            fullname: user.fullname
                        })

                        // signin jwt
                        jwt.sign(
                            payload,
                            Keys.secretOrKey, {
                                expiresIn: 31556926 //1 year in secs
                            },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                            }
                        )
                    } else {
                        return res.status(400).json({ password: "Password is incorrect" });
                    }

                })
                .catch((err) => console.log(err));
        })
})

module.exports = { router };