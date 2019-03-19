const validator = require('validator');
const isEmpty = require('is-empty');


const validateRegisterInput = (data) => {
    let errors = {};

    data.fullname = !isEmpty(data.fullname) ? data.fullname : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (validator.isEmpty(data.fullname)) {
        errors.fullname = 'Fullname is required!';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email is required!';
    } else if (!validator.isEmail(data.email)) {
        errors.email = "email is invalid";
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password is required!';
    }
    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'confirm password field is required!';
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters"
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = "Password must match"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}

module.exports = { validateRegisterInput };