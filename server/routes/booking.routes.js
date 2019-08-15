import express from 'express';
import BookingController from '../controllers/bookingController';
import Permission from '../middlewares/permission';
import Validator from '../middlewares/validation';

const bookingRouter = express.Router();

bookingRouter.post('/bookings', Validator.validateBooking, Permission.authUsersOnly, BookingController.createBooking);
bookingRouter.get('/bookings', Permission.authorize, BookingController.viewBooking);
bookingRouter.get('/bookings/:booking_id', Validator.validateId, Permission.authUsersOnly, BookingController.getOneBooking);

export default bookingRouter;
