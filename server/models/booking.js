import { pool } from '.';
import { RESOURCE_CONFLICT } from '../constants/responseCodes';
import { MAXIMUM_BOOKINGS } from '../constants/feedback';

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
}
