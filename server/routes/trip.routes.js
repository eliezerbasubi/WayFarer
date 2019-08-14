import express from 'express';
import TripController from '../controllers/tripController';
import Permission from '../middlewares/permission';
import Validator from '../middlewares/validation';

const tripRouter = express.Router();

tripRouter.post('/trips', Validator.validateTrip, Permission.grantAccess, TripController.createTrip);
tripRouter.patch('/trips/:trip_id/cancel', Validator.validateId, Permission.grantAccess, TripController.cancelTrip);
tripRouter.get('/trips', Permission.authorize, TripController.getAllTrips);

export default tripRouter;
