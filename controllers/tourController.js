const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);

    if(req.params.id * 1 > tours.length){
        return res
        .status(404)
        .json({
            status: 'fail',
            message:"Invalid Id"
        })
        
    }
    next();
}

exports.getAllTours = (req, res)=>{
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

exports.getTour = (req, res)=>{
    console.log(req.params);

    const id = req.params.id * 1;

    const tourLen = tours.length;
    const tour = tours.find( el=> el.id === id);
    
   
    res.status(200).json({
        status : 'success',
        // results: tours.length,
        data : {
            tours: tour
        }
    });
}

exports.createTour = (req, res)=>{
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

exports.updateTour = (req, res)=> {
  res.status(200).json({
      status: 'success',
      data: {
          tour : '<Updated outr here...>'
      }
  })
};

exports.deleteTour = (req, res)=> {
  res.status(204).json({
      status: 'success',
      data: null
  })
};