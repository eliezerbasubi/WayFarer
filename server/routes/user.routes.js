import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';

const userRouter = express.Router();

userRouter.post('/auth/signup', Validator.signup, UserController.signUp);
userRouter.post('/auth/signin', UserController.signIn);
userRouter.post('/auth/reset/:user_id', Validator.validatePassword, UserController.resetPassword);

export default userRouter;
