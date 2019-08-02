import dotenv from 'dotenv';
import Booking, {
  dbBookings
} from '../models/booking';
import {
  dbTrip
} from '../models/trip';
import {
  NOT_FOUND_CODE, CREATED_CODE
} from '../constants/responseCodes';
import {
  cache
} from '../models/user';
import Helper from '../helpers/helper';

dotenv.config();

export default class BookingController {
  static async createBooking(req, res) {
    let tripInfo = [];
    let userDetails = [];
    const bookingData = [];
    const displayMyBookings = [];
    const bookingTripId = req.headers.trip_id;

    // eslint-disable-next-line radix
    tripInfo = dbTrip.find(trip => trip.tripId === parseInt(bookingTripId));

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
        seatNumber: req.headers.seat_number,
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
}
