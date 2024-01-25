const express = require('express');
const user_route = express();
const path = require('path');
const session = require('express-session');

const userController = require('../controller/userController');
const config = require('../config/config')


// user_route.use('/user',express.static(path.join(__dirname,'public/user')));
// user_route.use(express.static(path.join(__dirname,'public/user/images')));

user_route.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}));



user_route.use(express.json());
user_route.use(express.urlencoded({extended:true}));







user_route.set('view engine', 'ejs');
user_route.set('views', './views/user');

user_route.get('/',userController.loadHome );
user_route.get('/home',userController.loadHome );

user_route.get('/signup',userController.loadRegister);
user_route.post('/signup',userController.insertUser);

user_route.get('/checkout',userController.checkout)

user_route.get('/singleproduct',userController.singleProduct);

user_route.get('/cart',userController.loadCart);

user_route.get('/login',userController.loadLogin);
user_route.post('/login',userController.verifyLogin);

// load otp
user_route.get('/otp',userController.loadOtp);
user_route.post('/otp',userController.verifyOtp);
user_route.post('/send-otp',userController.sendOtp);







module.exports=user_route;