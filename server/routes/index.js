import express from 'express';
import userRouter from './user.routes';
import tripRouter from './trip.routes';
import bookingRouter from './booking.routes';

const router = express.Router();

router.use(userRouter);

router.use(tripRouter);

router.use(bookingRouter);


export default router;
