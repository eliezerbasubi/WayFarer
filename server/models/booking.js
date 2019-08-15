import { pool } from '.';
import { RESOURCE_CONFLICT, NOT_FOUND_CODE } from '../constants/responseCodes';
import {
  MAXIMUM_BOOKINGS, HAVE_NO_BOOKINGS, NO_BOOKINGS
} from '../constants/feedback';
import { currentUser } from './user';

export const dbBooking = [];
export default class BookingQueries {
  static async insert(data, updateSeating) {
    try {
      const alreadyBooked = await pool.query('SELECT * FROM bookings WHERE trip_id = $1 AND user_id = $2', [data[0], data[1]]);
      if (alreadyBooked.rowCount > 0) {
        return { error: { status: RESOURCE_CONFLICT, message: MAXIMUM_BOOKINGS } };
      }
      const result = await pool.query(`INSERT INTO bookings (
        trip_id, user_id, seat_number) VALUES ($1, $2, $3) returning *`, data);
      const values = [updateSeating[0], updateSeating[1]];
      await pool.query('UPDATE trips SET seating_capacity=$1 WHERE id=$2', values);
      return result;
    } catch (error) {
      return { error: { status: 500, message: 'Unable To Insert in Booking' } };
    }
  }

  static async isBooked(data) {
    const result = await pool.query('SELECT * FROM bookings WHERE trip_id = $1 AND seat_number =$2', data);
    return result;
  }

  static async userInfo(ids) {
    const info = await pool.query(`SELECT 
    users.firstname, users.lastname, users.email, trips.trip_name, trips.bus_license_number, trips.trip_date, trips.fare 
    FROM users INNER JOIN trips ON users.id = $1 AND trips.id = $2 LIMIT 1`, ids);
    return info;
  }

  static async userBookings() {
    let user_id = 0;
    currentUser.forEach((user) => { user_id = user.id; });
    const myBookings = await pool.query('SELECT * FROM bookings WHERE user_id = $1', [user_id]);
    if (myBookings.rowCount < 1) {
      return { error: { status: NOT_FOUND_CODE, message: HAVE_NO_BOOKINGS } };
    }
    return myBookings;
  }

  static async findAll() {
    const bookings = await pool.query('SELECT * FROM bookings ');
    if (bookings.rowCount < 1) {
      return { error: { status: NOT_FOUND_CODE, message: NO_BOOKINGS } };
    }
    return bookings;
  }

  static async userBookingDetails(ids) {
    const info = await pool.query(`SELECT 
    users.firstname, users.lastname, users.email, trips.trip_name, trips.bus_license_number, trips.trip_date, trips.fare 
    FROM users INNER JOIN trips ON users.id = $1 AND trips.id = $2`, ids);
    return info;
  }

  static async findOne(ids) {
    let user_id = 0;
    currentUser.forEach((user) => { user_id = user.id; });

    const bookings = await pool.query('SELECT * FROM bookings WHERE id = $1 AND user_id =$2', [ids, user_id]);
    if (bookings.rowCount < 1) {
      return { error: { status: NOT_FOUND_CODE, message: HAVE_NO_BOOKINGS } };
    }
    return bookings;
  }
}
