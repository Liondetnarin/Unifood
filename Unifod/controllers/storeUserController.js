const User = require('../models/User')

module.exports = (req, res) => {
    User.create(req.body).then(() => {
        console.log("User registered successfully!")
        res.redirect('/')
    }).catch((error) => {
        console.error("Error occurred:", error);

        if (error.errors) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message);
            req.flash('validationErrors', validationErrors);
            req.flash('data', req.body)
            return res.redirect('/register')
        }
    })
}