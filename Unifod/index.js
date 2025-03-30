const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')

//connection MongoDb
mongoose.connect('mongodb+srv://admin1234:1234@cluster0.6vxnm.mongodb.net/', {
    useNewUrlParser: true
})

global.loggetIn = null

//controller
const indexController = require('./controllers/indexController')
const homeController = require('./controllers/homeController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')

//Middleware
const redirectifAuth = require('./middleware/redirectifAuth')
const authMiddleware = require('./middleware/authMiddleware')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))
app.use("*", (req, res, next) => {
    loggetIn = req.session.useraId
    next()
})
app.set('view engine', 'ejs')

app.get('/', indexController)
app.get('/home', authMiddleware, homeController)
app.get('/login', redirectifAuth, loginController)
app.get('/register', redirectifAuth, registerController)
app.post('/user/register', redirectifAuth, storeUserController)
app.post('/user/login', redirectifAuth, loginUserController)
app.post('/logout', logoutController)

app.listen(4000, () => {
    console.log("App listening on port 4000")
})