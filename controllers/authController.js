const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });

}

exports.getuser = (req, res) => {
    res.status(201).json({
        status:"aa"
    })
}

exports.signup = async (req, res, next) => {
    try {

        // const newuser = await User.create(req.body);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);
        

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    } catch(err){
        res.status(400).json({
            status:'fail',
            message: err
        })
    } 
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    // 1) Check if email and password exist
    if(!email || !password) {
        return res.status(400).json({ message: '이메일과 비밀번호를 써라' });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    // const corret = await user.correctPassword(password, user.password);
    
    if(!user || !(await user.correctPassword(password, user.password))) {
       return res.status(401).json({message: '이메일이나 비밀호가 틀린 듯'})
    }
    
    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    
    res.status(200).json({
        status: '성공',
        token
    })
}