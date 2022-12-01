const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { json } = require('express');


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
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt
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
};

exports.protect = async (req, res, next) => {
    // 1) 토큰 가져오고 체크하자
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1] ; 
    }
    // console.log(token);
    if (!token) {
        //return next(); // 에러 처리 어떻게 할끄나
        return res.status(401).json({
            "message": " 너는 로그인을 하지 않았어."
        })
    }
    
    // 2) 토큰 유효성 검사 -  누군가가 데이터를 조작했는지 또는 토큰이 이미 만료되었는지 확인
    let decoded;
    try {
        
         decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({
                "message": "기한만료",
                "error": error.name
            })
        }
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                "message": "토큰이 이상해",
                "error": error.name
            })
        }
    }
    // const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    // 3) 사용자가 여전히 존재하는지???
    let currentUser;
    try {
        
        currentUser = await User.findById(decoded.id);
       
        
    } catch (error) {
        return res.status(401).json({
            "message": "유저가 사라졌다",
            "error": error
        })
    }
   
    // 4) 토큰이 발급된 후 사용자가 비밀번호를 변경했는지?
    if(await currentUser.changedpasswordAfter(decoded.iat)){
        return res.status(401).json({
            "message": "비밀번호가 최근에 변경됐다. 다시 로그인 해주라"
           
        })
    };

    // grant access to protected route
    req.user = currentUser;
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide']. role='user'
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                "message": "너는 이걸 할 권한이 없어!!!🍳"
               
            })
        }
        next();
    }
};

exports.forgotPassword = async (req, res, next) => {
        // 1) 이메일의 사용자 정보를 가져오기
    let user;
    try {
        user = await User.findOne({email: req.body.email});
        
    } catch (error) {
        return res.status(404).json({
            "message": "없는 이메일임"
           
        })
    }   
    console.log(user);
    // 2) 임의의 토큰 생성
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});//스키마에서 지정한 모든 유효성 검사기가 비활성화
    // 3) 이메일 보내기
}

exports.resetPassword = (req, res, next) => {
    
}