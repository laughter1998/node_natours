const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    const users = await User.find();

        // SEND RESPONSE
        res.status(200).json({
            status : 'success',
            // requestedAt: req.requestTime,
            results: users.length,
            data : {
                users
            }
        });
    // res.status(500).json({
    //     status: 'error',
    //     message: 'This route is not yet definde!'
    // });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};