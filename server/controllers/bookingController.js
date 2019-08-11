import dotenv from 'dotenv';
import Booking, {
  dbBookings
} from '../models/booking';
import {
  dbTrip
} from '../models/trip';
import {
  NOT_FOUND_CODE, CREATED_CODE, SUCCESS_CODE
} from '../constants/responseCodes';
import {
  cache
} from '../models/user';
import Helper from '../helpers/helper';
import { NO_BOOKINGS, HAVE_NO_BOOKINGS, BOOKING_NOT_FOUND } from '../constants/feedback';

dotenv.config();

export default class BookingController {
  static async createBooking(req, res) {
    // let tripInfo = [];
    // let userDetails = [];
    // const bookingData = [];
    // const displayMyBookings = [];
    // const bookingTripId = req.body.trip_id;

    // tripInfo = dbTrip.find(trip => parseInt(trip.trip_id, 10) === parseInt(bookingTripId, 10));

    // if (tripInfo) {
    //   const {
    //     trip_name, trip_date, time, fare, bus_license_number
    //   } = tripInfo;

    //   cache.forEach((item) => { userDetails = item; });
    //   let id = 1;
    //   dbBookings.forEach((db) => { id = db.booking_id + 1; });
    //   bookingData.push(new Booking({
    //     booking_id: id,
    //     trip_id: bookingTripId,
    //     user_id: userDetails.id,
    //     trip_name,
    //     trip_date,
    //     trip_time: time,
    //     fare,
    //     bus_license_number,
    //     seat_number: req.body.seat_number,
    //     first_name: userDetails.first_name,
    //     last_name: userDetails.last_name,
    //     email: userDetails.email,
    //     createdOn: Helper.today(),
    //     status: 'valid'
    //   }));

    //   Object.assign(displayMyBookings, bookingData);

    //   dbBookings.push(...bookingData);
    //   return Helper.success(res, CREATED_CODE, ...displayMyBookings, 'Seat Booked Successfully');
    // }

    // return Helper.error(res, NOT_FOUND_CODE, 'We could not find a trip with the specified ID');
  }

  static viewBookings(req, res) {
    // let connectedUserStatus;
    // let connectedUserEmail;

    // cache.forEach((item) => {
    //   connectedUserStatus = item.is_admin;
    //   connectedUserEmail = item.email;
    // });

    // if (dbBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, NO_BOOKINGS); }

    // if (!connectedUserStatus) {
    //   const userBookings = dbBookings.filter(booking => booking.email === connectedUserEmail);
    //   if (userBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, HAVE_NO_BOOKINGS); }
    //   return Helper.success(res, SUCCESS_CODE, userBookings, 'We Have Found Your Bookings');
    // }

    // return Helper.success(res, SUCCESS_CODE, dbBookings, 'We Have Found Your Bookings');
  }

  static async deleteBooking(req, res) {
    // const bookingId = parseInt(req.params.booking_id, 10);
    // let connectedUserEmail = '';

    // cache.forEach((item) => { connectedUserEmail = item.email; });

    // const myBookings = dbBookings.filter(booking => booking.email === connectedUserEmail);
    // if (myBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, HAVE_NO_BOOKINGS); }

    // const toBeDeleted = myBookings.find(booking => parseInt(booking.booking_id, 10) === bookingId);

    // if (!toBeDeleted) { return Helper.error(res, NOT_FOUND_CODE, BOOKING_NOT_FOUND); }

    // const index = myBookings.indexOf(toBeDeleted);
    // myBookings.splice(index, 1);

    // const indexBookings = dbBookings.indexOf(toBeDeleted);
    // dbBookings.splice(indexBookings, 1);

    // return Helper.success(res, SUCCESS_CODE, toBeDeleted, 'Your Booking Was Deleted Successfully');
  }

  static getOneBooking(req, res) {
    //     const bookingId = parseInt(req.params.booking_id, 10);
    //     const booking = dbBookings.find(element => parseInt(element.booking_id, 10) === bookingId);
    //     if (booking) {
    //       return Helper.success(res, SUCCESS_CODE, booking, 'Success ! Booking Was Found');
    //     }
    //     return Helper.error(res, NOT_FOUND_CODE, 'We Could Not Find The Specified Booking');
  }
}
