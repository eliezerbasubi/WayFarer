import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';

const router = express.Router();

router.post('/auth/signup', Validator.signup, UserController.signUp);

export default router;
