const nodemailer = require('nodemailer');

const sendEmail = options =>{
    // 1) 트랜스포터를 만들어야 합니다.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
        // Gmail 계정이라면 보안 수준이 낮은 앱 옵션이라는 항목을 실제로 활성화해
    })
    // 2) 이메일 옵션을 정의

    // 3)  이메일을 보내
};