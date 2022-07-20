// const fs = require('fs');
// const { findById } = require('../models/tourModel');
const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,prcie,ratingsAverage,summary,difficulty';
    next();
};

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);

//     if(req.params.id * 1 > tours.length){
//         return res
//         .status(404)
//         .json({
//             status: 'fail',
//             message:"Invalid Id"
//         })
        
//     }
//     next();
// }
// exports.checkBody = (req, res, next)=>{
//     if(!req.body.name || !req.body.price){
//         return res
//         .status(400)
//         .json({
//             status: 'fail',
//             message:"Missing name or price"
//         })
//     }
//     next();
// }



exports.getAllTours = async (req, res)=>{
    
    try{
        // 1A) Filtering
       
        // const queryObj = {...req.query};
        // const excludeFields = ['page', 'sort', 'limit', 'fields'];
        // excludeFields.forEach(el => delete queryObj[el]);
        
        // 1B) Advanced filterging
        
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // let query = Tour.find(JSON.parse(queryStr));

        // 2) Sorting
        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy);
        // } else {
        //     query = query.sort('-createdAt');
        // }

        // 3) Field limiting
        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields);
        // } else {
        //     query = query.select('-__v');
        // }

        // 4) Pagination
        // page=2&limit=10
      
            // const page = req.query.page * 1 || 1;
            // const limit = req.query.limit * 1 || 100;
            // const skip =  (page - 1) * limit;
            // query = query.skip(skip).limit(limit);

            // if(req.query.page){
            //     const numTours = await Tour.countDocuments();
            //     console.log(numTours);
            //     if(skip > numTours) throw new Error('This page does not exist');
            // }
        // EXECUTE QUERY
        
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        console.log('features');
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status : 'success',
            // requestedAt: req.requestTime,
            results: tours.length,
            data : {
                tours
            }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res)=>{
    // console.log(req.params);

    const id = req.params.id ;
    try {
        const tour = await Tour.findById(id);
        // Tour.findOne({_id: id})
        res.status(200).json({
            status: 'success',
            data : {
                tours: tour
            }
        })
    } catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
    // const tourLen = tours.length;
    // const tour = tours.find( el=> el.id === id);
    
   
    // res.status(200).json({
    //     status : 'success',
    //     // results: tours.length,
    //     data : {
    //         tours: tour
    //     }
    // });
}

exports.createTour = async (req, res)=>{
    try {
        // const newTour = new Tour({});
        // newTour.save()
        const nowTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: nowTour
            }
        });
        //  console.log(req.body.id);
    } catch (err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
    
    
   
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id: newId}, req.body);

    // tours.push(newTour);

    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     })
    // })
    // res.send('Done');
}

exports.updateTour = async (req, res)=> {
    try{
        // const tour = await Tour.findById(req.params.id);
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        // const tour = await Tour.updateOne({req.params.id},{'name': 'jeju'})
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch(err){
        res.status(400).json({
            status:'fail',
            message: err
            })
    }
};

exports.deleteTour = async (req, res)=> {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    // _id: '$ratingsAverage',
                    _id: { $toUpper: '$difficulty'},
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRation: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice : {$min: '$price'},    
                    maxPrice : {$max: '$price'}    
                }
            },
            {
                $sort: {avgPrice: 1}
            }
            // {
            //     $match:{ _id: { $ne: 'EASY'}}
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });

    } catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates : {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group : {
                    _id: { $month: '$startDates'},
                    numToursStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project : {
                    _id: 0
                }
            },
            {
                $sort: {numToursStarts : -1}
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            results : plan.length,
            data: {
                plan
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}