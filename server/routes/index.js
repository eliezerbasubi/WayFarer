import express from 'express';
import userRouter from './user.routes';
import tripRouter from './trip.routes';

const router = express.Router();

router.use(userRouter);

router.use(tripRouter);


export default router;
