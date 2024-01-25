const Users = require('../model/userSchema');
const bcrypt = require('bcrypt');
const otpSchema = require('../model/otp');
const nodemailer = require('nodemailer');
const userSchema = require('../model/userSchema');


// password secure
const securedPassword = async (password) => {

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error);
    }
}


// load home 
const loadHome = (req, res) => {

    try {
        res.render('home');
    } catch (error) {
        console.log(error);
    }
}


// load registration 
const loadRegister = (req, res) => {

    try {
        res.render('signup');
    } catch (error) {
        console.log(error);
    }

}


// load login 
const loadLogin = (req, res) => {

    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }

}


//verify login

const verifyLogin = async (req, res) => {
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        console.log(req.body.Password)   //--------------------------------------------------------

        const userData = await Users.findOne({ email: Email });

        if (userData) {

            const verifyPassword = await bcrypt.compare(Password, userData.password)
            console.log('userData.password' + userData.password)   //--------------------------------------------------------

            if (verifyPassword) {
                req.session.user = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email
                }

                console.log('req.session.user_id = ' + req.session.user_id)   //--------------------------------------------------------
                res.render("home")

            } else {
                req.flash('passwordError', 'Incorrect password !');
                res.redirect('/login')
            }

        } else {
            req.flash('emailError', 'Incorrect email !');
            res.redirect('/login');
        }

    } catch (error) {
        console.log(error);
    }

}



// insert user

const insertUser = async (req, res) => {

    try {
        console.log("req.body.Password = " + req.body.Password)   //--------------------------------------------------------
        const hashPassword = await securedPassword(req.body.Password)

        const Name = req.body.Name;
        const Email = req.body.Email;

        const username = await Users.findOne({ name: Name });
        const useremail = await Users.findOne({ email: Email });

        if (username) {
            req.flash('nameExist', 'User name already exist');
            res.redirect('/signup');
        } else if (useremail) {
            req.flash('emailExist', 'Email already exist');
            res.redirect('/signup');
        } else {

            const user = new Users({
                email: req.body.Email,
                name: req.body.Name,
                mobile: req.body.Mobile,
                password: hashPassword,
                isAdmin: false,
                isBlocked: false,
                verified: false,
            })
            // cosnole.log("= 1st console = "+user)   //--------------------------------------------------------

            const userData = await user.save();
           // console.log('2nd console = ' + user)   //--------------------------------------------------------
            console.log('userData1 = ' + userData)   //--------------------------------------------------------

            if (userData) {
            // res.render('login')

               sendOtp(user.email);
               res.redirect(`/otp?email=${user.email}`)
            }else{
                console.log('not saved userData....')//-----------------------------------------
            }
        }
    } catch (error) {
        console.log(error);
    }

}


// load otp

const loadOtp = (req, res) => {

    try {

        res.render("otp");
    } catch (error) {
        console.log(error);
    }

}


// send otp
const sendOtp = async (email) => {

    try {
        
        const transport = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'muhamedreswan9917@gmail.com',
                pass: 'rpwg jlhk dnoa qkcj'
            }
        })

        const createOtp = `${Math.floor(1000 + Math.random() * 9000)}`

        const mailOption = {
            from : 'muhamedreswan9917@gmail.com',
            to : email,
            subject : "otp verification",
            html:`your otp is ${createOtp}`
        }

        await transport.sendMail(mailOption);
        const hashOtp = await bcrypt.hash(createOtp, 10);
        console.log('hashOtp= ',hashOtp)//-----------------------------------------

        const userOtp = await new otpSchema({
            email:email,
            otp:hashOtp
        })
        console.log('userOtp = '+userOtp)//-----------------------------------------

       const otpSave = await userOtp.save();
       console.log('otp save = '+otpSave)//-----------------------------------------

    } catch (error) {
        console.log(error);
    }

}


// verify otp 

const verifyOtp = async (req, res) => {

    try {
        const email =req.query.email;
        console.log('otp email= ',email)//-----------------------------------------

        const otp = req.body.otp1+req.body.otp2+req.body.otp3+req.body.otp4;

        console.log('otp from user = '+otp)//-----------------------------------------

        const otpUser = await otpSchema.findOne({email:email});
        console.log('otpUser ='+otpUser )//-----------------------------------------


        if (otpUser){
            const otpVerification = await bcrypt.compare(otp,otpUser.otp);
            console.log('otpVerification ='+otpVerification)//-----------------------------------------
            
            if (otpVerification){
                console.log('otp verification success')//-----------------------------------------
                
                const userData = await Users.findOne({ email: email });
                console.log('userData2 = ',userData); //------------------------------------------
if(userData){

     const verifiedTrue = await Users.findByIdAndUpdate({_id:userData._id},{$set:{verified:true}});
console.log('verifiedTrue'+verifiedTrue);//-----------------------------------------

if (verifiedTrue){

req.session.user={
    name:userData.name,
    email:userData.email,
    _id:userData._id
}

await otpSchema.deleteOne({email:otpUser.email});

req.flash('sucess','Verification Success...')
res.redirect('/login');

}else{
    console.log(' verified verification failed'); //------------------------------------------
}

}else{
    console.log('userData not getting'); //------------------------------------------

}
        
            }else{
                console.log('otp verification failed !');//-----------------------------------------
                req.flash('incorrect','Please Enter Valid OTP !');
                res.redirect(`/otp?email=${email}`);
            }
        }else{
            console.log('user not found')//--------------------------------------------
               req.flash('expired','OTP Expired Resend');
               res.redirect(`/otp?email=${email}`);
        }
    } catch (error) {
        console.log(error);
    }
}

// // resend Otp
// const resendOtp =async (req, res) => {
//     try {
//         const email = req.query.email;
//         console.log('user not found')//--------------------------------------------
//         req.flash('resend', 'OTP Resended ');
//         res.redirect(`/otp?email=${email}`)
        
//     } catch (error) {
//         console.log(error);
//     }
    
// }






// resend otpp.....>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


















// single product

const singleProduct = (req, res) => {

    try {
        res.render('product-single')
    } catch (error) {
        console.log(error);
    }

}

// load wishlist

const loadCart = (req, res) => {

    try {
        res.render("cart")
    } catch (error) {
        console.log(error);
    }

}


// load wishlist

const loadWishlist = (req, res) => {

    try {
        res.render('wishlist')
    } catch (error) {
        console.log(error);
    }

}

// checkout

const checkout = (req, res) => {

    try {
        res.render('checkout')
    } catch (error) {
        console.log(error);
    }

}




module.exports = {
    loadHome,
    loadRegister,
    loadLogin,
    insertUser,
    loadCart,
    singleProduct,
    loadWishlist,
    checkout,
    verifyLogin,
    loadOtp,
    verifyOtp,
    sendOtp
}
