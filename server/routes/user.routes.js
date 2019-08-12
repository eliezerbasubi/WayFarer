import express from 'express';
import UserController from '../controllers/userController';
import Validator from '../middlewares/validation';
import Permission from '../middlewares/permission';

const userRouter = express.Router();

userRouter.post('/auth/signup', Validator.signup, UserController.signUp);
userRouter.post('/auth/signin', UserController.signIn);
userRouter.patch('/auth/reset/:user_id', Validator.validatePassword, UserController.resetPassword);
// userRouter.get('/users', Permission.grantAccess, UserController.viewAllUsers);

export default userRouter;
