const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(()=> console.log('mongoDB connect 😎'));


// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into db
const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('DAta successfully loaded!');
    } catch(err){
        console.log(err);
    } 
    process.exit();
};

// delete all data from collection
const deleteDate = async () => {
    try{
        await Tour.deleteMany()
        console.log('DAta successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

if(process.argv[2] === '--import'){
    importData();
} else if (process.argv[2] === '--delete'){
    deleteDate();
}

