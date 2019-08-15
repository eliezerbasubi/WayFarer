/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  UNPROCESSABLE_ENTITY
} from '../constants/responseCodes';
import { currentUser } from '../models/user';
import BookingQueries from '../models/booking';

export default class Helper {
  static error(res, statusCode, error) {
    const body = {
      status: statusCode,
      error
    };
    return res.status(statusCode).json(body);
  }

  static success(res, statusCode, data, message) {
    const body = {
      status: statusCode,
      message,
      data
    };
    return res.status(statusCode).json(body);
  }

  static joiError(res, error) {
    const body = {
      status: UNPROCESSABLE_ENTITY,
      error: error.message.replace(/[^a-zA-Z0-9_.: ]/g, '')
    };
    return res.status(UNPROCESSABLE_ENTITY).json(body);
  }

  static slice(token) {
    if (token.startsWith('Bearer ')) return token.slice(7, token.length);
    return token;
  }

  static today() {
    const todayTime = new Date();
    const month = todayTime.getMonth() + 1;
    const day = todayTime.getDate();
    const year = todayTime.getFullYear();

    const now = `${year}-${month}-${day}`;
    return now;
  }

  static currentUserStatus() {
    let isCurrentAdmin = true;
    currentUser.forEach((user) => { isCurrentAdmin = user.is_admin; });
    return isCurrentAdmin;
  }

  static async currentUserBookings(res) {
    const userBookings = await BookingQueries.userBookings();

    if (userBookings.error) {
      return Helper.error(res, userBookings.error.status, userBookings.error.message);
    }
    let indexer = ''; const myBookings = [];
    for (indexer of userBookings.rows) {
      const row = await BookingQueries.userBookingDetails([indexer.user_id, indexer.trip_id]);
      const { id, seat_number } = indexer;
      myBookings.push(Object.assign({ id, seat_number }, ...row.rows));
    }
    return Helper.success(res, 200, myBookings, 'Found your Bookings');
  }
}
