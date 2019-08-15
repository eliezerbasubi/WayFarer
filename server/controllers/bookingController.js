import TripQueries from '../models/trip';
import Helper from '../helpers/helper';
import { currentUser } from '../models/user';
import BookingQueries, { dbBooking } from '../models/booking';
import { CREATED_CODE } from '../constants/responseCodes';

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
}
