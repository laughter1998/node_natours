const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();


// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware😛');
    next();
})
    
app.use((req, res, next)=>{
    var today = new Date();
    var localeTime = new Date(today.setMinutes(today.getMinutes() - today.getTimezoneOffset()));
    // console.log(localeTime.toISOString().slice(0, 19));
    // req.requestTime = new Date().toISOString();
    req.requestTime = localeTime.toISOString().slice(0, 19);
    next();
})



// 2) ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3)ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVER
// server.js로 이동 했음


module.exports = app;

