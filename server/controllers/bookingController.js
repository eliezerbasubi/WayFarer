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
    let tripInfo = [];
    let userDetails = [];
    const bookingData = [];
    const displayMyBookings = [];
    const bookingTripId = req.body.tripId;

    tripInfo = dbTrip.find(trip => parseInt(trip.tripId, 10) === parseInt(bookingTripId, 10));

    if (tripInfo) {
      const {
        tripName, tripDate, time, fare, busLicenseNumber
      } = tripInfo;

      cache.forEach((item) => { userDetails = item; });

      bookingData.push(new Booking({
        bookingId: dbBookings.length + 1,
        tripId: bookingTripId,
        userId: userDetails.id,
        tripName,
        tripDate,
        tripTime: time,
        fare,
        busLicenseNumber,
        seatNumber: req.body.seatNumber,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        createdOn: Helper.today(),
        status: 'valid'
      }));

      Object.assign(displayMyBookings, bookingData);

      dbBookings.push(...bookingData);
      return Helper.success(res, CREATED_CODE, ...displayMyBookings, 'Seat Booked Successfully');
    }

    return Helper.error(res, NOT_FOUND_CODE, 'We could not find a trip with the specified ID');
  }

  static viewBookings(req, res) {
    let connectedUserStatus;
    let connectedUserEmail;

    cache.forEach((item) => {
      connectedUserStatus = item.isAdmin;
      connectedUserEmail = item.email;
    });

    if (dbBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, NO_BOOKINGS); }

    if (!connectedUserStatus) {
      const userBookings = dbBookings.filter(booking => booking.email === connectedUserEmail);
      if (userBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, HAVE_NO_BOOKINGS); }
      return Helper.success(res, SUCCESS_CODE, userBookings, 'We Have Found Your Bookings');
    }

    return Helper.success(res, SUCCESS_CODE, dbBookings, 'We Have Found Your Bookings');
  }

  static async deleteBooking(req, res) {
    const bookingId = parseInt(req.params.booking_id, 10);
    let connectedUserEmail = '';

    cache.forEach((item) => { connectedUserEmail = item.email; });

    const myBookings = dbBookings.filter(booking => booking.email === connectedUserEmail);
    if (myBookings.length < 1) { return Helper.error(res, NOT_FOUND_CODE, HAVE_NO_BOOKINGS); }

    const toBeDeleted = myBookings.find(booking => parseInt(booking.bookingID, 10) === bookingId);

    if (!toBeDeleted) { return Helper.error(res, NOT_FOUND_CODE, BOOKING_NOT_FOUND); }

    const index = myBookings.indexOf(toBeDeleted);
    myBookings.splice(index, 1);

    const indexBookings = dbBookings.indexOf(toBeDeleted);
    dbBookings.splice(indexBookings, 1);

    return Helper.success(res, SUCCESS_CODE, toBeDeleted, 'Your Booking Was Deleted Successfully');
  }

  static getOneBooking(req, res) {
    const bookingId = parseInt(req.params.booking_id, 10);
    const booking = dbBookings.find(element => parseInt(element.bookingID, 10) === bookingId);
    if (booking) {
      return Helper.success(res, SUCCESS_CODE, booking, 'Success ! Booking Was Found');
    }
    return Helper.error(res, NOT_FOUND_CODE, 'We Could Not Find The Specified Booking');
  }
}
