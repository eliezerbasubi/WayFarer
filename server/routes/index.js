import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';

const router = express.Router();

router.post('/auth/signup', Validator.signup, UserController.signUp);

router.post('/auth/signin', UserController.signIn);
router.post('/auth/reset/:user_id', Validator.validatePassword, UserController.resetPassword);

export default router;
