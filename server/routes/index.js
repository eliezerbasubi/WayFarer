import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';
import TripController from '../controllers/tripController';
import Permission from '../middlewares/permission';
import BookingController from '../controllers/bookingController';

const router = express.Router();

// #User routes
router.post('/auth/signup', Validator.signup, UserController.signUp);
router.post('/auth/signin', UserController.signIn);
router.post('/auth/reset/:user_id', Validator.validatePassword, UserController.resetPassword);

// #Trip routes
router.post('/trips', Validator.validateTrip, Permission.grantAccess, TripController.createTrip);
router.patch('/trips/:trip_id/cancel', Validator.validateId, Permission.grantAccess, TripController.cancelTrip);
router.get('/trips', Permission.authorize, TripController.getAllTrips);
router.get('/trips/:trip_id', Permission.authorize, TripController.viewSpecificTrip);

// #Booking routes
router.post('/bookings', Validator.validateBooking, BookingController.createBooking);
export default router;
