const User = require('../models/UserModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
let bcrypt = require('bcrypt')
const sendEmail = require('../utils/emailSender')
const saltrounds = 10

const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')

exports.register = async(req,res)=>{
    let {username,email,password} = req.body
    // check if username is available
        let user = await User.findOne({username:username})
            if(user){
                return res.status(400).json({error:"Username is already token, choose another"})
            }
            // check if email is already registered
            user = await User.findOne({email})
            if(user){
                return res.status(400).json({error:"Email already register.Login to continue"})
            }
            // encrypt password
            let salt = await bcrypt.genSalt(saltrounds)
            let hashed_password = await bcrypt.hash(password,salt)

        // save user in db
        let new_user = await User.create({
            username,
            email,
            password: hashed_password 
        })
        if(!new_user){
            return res.status(400).json({error:"Something went wrong"})
        }

        // generate verification token
        let token = await Token.create({
            token: crypto.randomBytes(16).toString('hex'),
            user: new_user._id
        })
        if(!token){
            return res.status(400).json({error:"Something went wrong"})
        }

        // send token in email
        // const URL = `http://localhost:5000/verifyEmail/${token.token}`
    const URL = `${process.env.FRONTEND_URL}/verifyEmail/${token.token}`
         // send msg to user
         sendEmail({
            from: "noreply@something.com",
            to: email,
            subject: "verification email",
            text: `Copy paste the link in browser to verify. ${URL}`,
            html: `<a href = ${URL}><button>Verify Email</button></a>`
         })
         res.send({new_user,token})
}

exports.verifyEmail = async(req,res)=>{
    // check if token is valid or not
    let token = await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:"Invalid token or token may have expired"})
    }
    // find user
    let user = await User.findById(token.user)
    if(!user){
        return res.status(400).json({error:"User associated with token is found"})
    }
    // check if already verified
    if(user.isVerified){
      return res.status(400).json({error:"User already verified. Login to continue"})
    }
    //  veridy user
    user.isVerified = true
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong"}) 
    }
    // send msg to user
    res.send({message:"User verified successfully"})
}

exports.ForgetPassword = async(req,res)=>{
    // check id email is registered or not
    let user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).json({error:"Email not registered"}) 
    }
    // generate token
    let token =  await Token.create({
        user: user._id,
        token: crypto.randomBytes(16).toString('hex')
    })
    if(!token){
        return res.status(400).json({error:"Something went wrong"}) 
    }
    // send password reset link in email
    const URL = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`
    sendEmail({
        from:"noreply@something.com",
        to: req.body.email,
        subject: 'Password Reset Link',
        text: `Copy paste the link to reset your password. ${URL}`,
        html: `<a href = ${URL}><button>Reset Password</button></a>`
    })
    // send msg to user
    res.send({message:"Password reset link has been sent to your email"})
}

//userlist - get all users
// userdetails
// updateuser
// deleteuser

// reset password

exports.resetPassword = async (req,res)=>{
    // check if token is valid or not
        let token = await Token.findOne({token:req.params.token})
        if(!token){
            return res.status(400).json({error:"invalid token or token may have expired"})
        }
        // find user
        let user =  await User.findById(token.user)
        if(!user){
        return res.status(400).json({error:"User not found"})
        }
        
    // change password
    let salt = await bcrypt.genSalt(saltrounds)
    let hashed_password = await bcrypt.hash(req.body.password, salt)

    user.password = hashed_password
    user = await user.save()
    if(!user){
        return res.status(400).json({error:"Something went wrong. Try again later."})
    }
    // send msg to user
    res.send({message:"Password changed successfully"})
}

// sign in process
exports.signin = async(req,res)=>{
    let {email,password} = req.body
    // check if email is registered
    let user = await User.findOne({email})
    if(!user)
        return res.status(400).json({error:"Email not registered."})
    // check if email and password match
    if(!bcrypt.compareSync(password, user.password)){
        return res.status(400).json({error:"Email and password do not match"})
    }
    // check if user is verified or not
    if(!user.isVerified){
        return res.status(400).json({error:"user not verified.Verify First"})
    }
    // generate login token(jwt)
    let token = jwt.sign({
        //user:{
        username: user.username,
        email: user.email,
        role : user.role,
        _id: user._id
    }
    
    //}
    ,process.env.SECRET_KEY)
    // set token in cookies
    res.cookie('myCookie',{token, expires: 86400})
    // send login information to user
    res.send({
        token,user:{username:user.username,email,_id:user._id,role:user.role}
    })
}

// authorization
exports.requireAdmin = expressjwt({secret: process.env.SECRET_KEY, algorithms: ["HS256"] }),
function (req, res,error) {
    if(error){
        return res.status(401).json({error:"You must login to access this resources"})
        
    }
    else if (!req.auth.role != 1){
     return res.status(403).json({error:"You must be admin"});
 }else{
    next()
 }
}

 //requireAdmin
 exports.requireAdmin = (req, res, next) => {
    expressjwt({
        secret: process.env.SECRET_KEY,
        algorithms: ["HS256"]
    })(req, res, (error) => {
        if (error) {
            return res.status(401).json({ error: "User not logged in" })
        }
        else if (req.auth.role != 1) {
            return res.status(403).json({ error: "You must be admin to use this resource" })
        }
        else {
            next()
        }
    })
}
