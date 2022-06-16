const fs = require('fs');
const express = require('express');
;
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);


const router = express.Router();


const getAllTours = (req, res)=>{
    console.log(req.requestTime);
    res.status(200).json({
        status : 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data : {
            tours
        }
    });
};

const getTour = (req, res)=>{
    console.log(req.params);

    const id = req.params.id * 1;

    const tourLen = tours.length;
    const tour = tours.find( el=> el.id === id);
    // if(id > tourLen){
    if(!tour){
        return res
        .status(404)
        .json({
            status: 'fail',
            message:"Invalid Id"
        })
        
    }

    res.status(200).json({
        status : 'success',
        // results: tours.length,
        data : {
            tours: tour
        }
    });
}

const createTour = (req, res)=>{
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
    // res.send('Done');
}

const updateTour = (req, res)=> {
    if(req.params.id * 1 > tours.length){
          return res
          .status(404)
          .json({
              status: 'fail',
              message:"Invalid Id"
          })
          
      }

  res.status(200).json({
      status: 'success',
      data: {
          tour : '<Updated outr here...>'
      }
  })
};

const deleteTour = (req, res)=> {
    if(req.params.id * 1 > tours.length){
          return res
          .status(404)
          .json({
              status: 'fail',
              message:"Invalid Id"
          })
          
      }

  res.status(204).json({
      status: 'success',
      data: null
  })
}

router.route('/')
.get(getAllTours)
.post(createTour);

router.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

module.exports = router;