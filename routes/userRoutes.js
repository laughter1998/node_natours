const express = require('express');


function getAllUsers(req, res){
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet definde!'
    });
};

const router = express.Router();

router.route('/')
.get(getAllUsers)
.post(createUser);

router.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);


module.exports = router;