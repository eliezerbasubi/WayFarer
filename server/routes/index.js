import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';
import TripController from '../controllers/tripController';
import Permission from '../middlewares/permission';

const router = express.Router();

// #User routes
router.post('/auth/signup', Validator.signup, UserController.signUp);
router.post('/auth/signin', UserController.signIn);
router.post('/auth/reset/:user_id', Validator.validatePassword, UserController.resetPassword);

// #Trip routes
router.post('/trips', Validator.validateTrip, Permission.grantAccess, TripController.createTrip);

export default router;
