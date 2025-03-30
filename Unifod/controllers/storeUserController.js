const User = require('../models/User')

module.exports = (req, res) => {
    User.create(req.body).then(() => {
        consol.log("User registered successfully!")
        res.redirect('/')
    }).catch((error) => {
        //console.log(error.errors)

        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
            req.flash('validationErrors', validationErrors)
            return res.redirect('/register')
        }
    })
}