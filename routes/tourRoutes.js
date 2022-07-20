
const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours, createTour, getTour, updateTour, deleteTour} = require('./controllers/tourController');
const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// If notify, send back 400 (bad request)

router.route('/top-5-cheap')
.get(tourController.aliasTopTours, tourController.getAllTours)
// limit=5&sort=-ratingsAverage,price

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/')
.get(tourController.getAllTours)
.post( tourController.createTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);

module.exports = router;