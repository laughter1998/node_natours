const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

// name, email. photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, '이름을 쓰세요']
    },
    email : {
        type: String,
        unique: true,
        lowercase:true,
        validate: [validator.isEmail, '이메일을 제대로 쓰세요'],
        required: [true, '이메일을 쓰세요']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, '비밀번호를 쓰세요'],
        select: false
    },
    passwordConfirm: {
        type: String,
        minlength: 8,
        validate: {
            // This only works on CREATE and SAVE!!
            validator: function(el){
                return el === this.password;
            },
            message: '패스워드가 같지 않아'
        },
        required: [true, '비밀번호를 쓰세요']
    }
});

userSchema.pre('save', async function(next){
    // 비밀번호가 수정 되었을 때만 이 함수 실행
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}


const User = mongoose.model('User', userSchema);



module.exports = User;