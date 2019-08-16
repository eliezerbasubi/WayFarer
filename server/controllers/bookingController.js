/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import TripQueries from '../models/trip';
import Helper from '../helpers/helper';
import { currentUser } from '../models/user';
import BookingQueries, { dbBooking } from '../models/booking';
import { CREATED_CODE, SUCCESS_CODE } from '../constants/responseCodes';

export default class BookingController {
  static async createBooking(req, res) {
    const { trip_id, seat_number } = req.body;
    const trip = await TripQueries.getOneById(parseInt(trip_id, 10));

    let user_id = 0;
    currentUser.forEach((user) => { user_id = user.id; });
    const values = [trip_id, user_id, seat_number];

    const updatedCapacity = parseInt(trip.rows[0].seating_capacity, 10) - 1;

    const updateSeatingCapacity = [updatedCapacity, trip_id];

    const data = await BookingQueries.insert(values, updateSeatingCapacity);
    if (data.error) { return Helper.error(res, data.error.status, data.error.message); }

    const { rows } = await BookingQueries.userInfo([user_id, trip_id]);
    const { id } = data.rows[0];
    const display = Object.assign({ id, seat_number }, ...rows);
    dbBooking.push(display);
    return Helper.success(res, CREATED_CODE, display, 'Seat Booked Successfully');
  }

  static async viewBooking(req, res) {
    const isAdmin = Helper.currentUserStatus();

    const bookings = await BookingQueries.findAll();
    if (bookings.error) { return Helper.error(res, bookings.error.status, bookings.error.message); }
    let booked = ''; const displayerBooking = [];
    for (booked of bookings.rows) {
      const { id, seat_number } = booked;
      const { rows } = await BookingQueries.userBookingDetails([booked.user_id, booked.trip_id]);
      displayerBooking.push(Object.assign({ id, seat_number }, ...rows));
    }
    if (isAdmin === true) {
      if (bookings.error) {
        return Helper.error(res, bookings.error.status, bookings.error.message);
      }
      return Helper.success(res, SUCCESS_CODE, displayerBooking, 'We Have Found User Bookings');
    }
    return Helper.currentUserBookings(res);
  }

  static async getOneBooking(req, res) {
    const { booking_id } = req.params;
    const booking = await BookingQueries.findOne(booking_id);
    if (booking.error) {
      return Helper.error(res, booking.error.status, booking.error.message);
    }
    const ids = [booking.rows[0].user_id, booking.rows[0].trip_id];
    const { rows } = await BookingQueries.userInfo(ids);
    const { id, seat_number } = booking.rows[0];
    const display = Object.assign({ id, seat_number }, ...rows);
    return Helper.success(res, SUCCESS_CODE, Object.assign(display), 'Found your Bookings');
  }

  static async deleteBooking(req, res) {
    const booking_id = parseInt(req.params.booking_id, 10);
    const toBeDeleted = await BookingQueries.removeOne(booking_id);
    if (toBeDeleted.error) {
      return Helper.error(res, toBeDeleted.error.status, toBeDeleted.error.message);
    }
    return res.status(200).json({
      status: 200,
      message: 'Booking Deleted Successfully'
    });
  }
}
