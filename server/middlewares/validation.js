import Joi from 'joi';
import Helper from '../helpers/helper';
import {
  BAD_REQUEST_CODE, RESOURCE_CONFLICT, GONE, UNPROCESSABLE_ENTITY, NOT_FOUND_CODE
} from '../constants/responseCodes';
import { BAD_REQUEST_MSG, GONE_MSG } from '../constants/responseMessages';
import { SEAT_ALREADY_TAKEN, ID_NOT_FOUND } from '../constants/feedback';
import TripQueries from '../models/trip';
import BookingQueries from '../models/booking';
import { creator } from '../models';

export default class Validator {
  static signup(request, response, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      first_name: Joi.string().regex(/^[aA-zZ]+$/i).min(3).max(25)
        .required(),
      last_name: Joi.string().regex(/^[aA-zZ]+$/i).min(3).max(25)
        .required(),
      password: Joi.string().min(6).max(50).required(),
      phone_number: Joi.string().regex(/^[0-9]{7,10}$/).required(),
      city: Joi.string().min(5).max(30).required(),
      country: Joi.string().min(5).max(30).optional(),
      is_admin: Joi.boolean().strict().valid(true, false).optional()
    });

    const { error } = Joi.validate(request.body, schema);

    if (!error) { return next(); }

    return Helper.joiError(response, error);
  }

  static validatePassword(req, res, next) {
    const { error } = Joi.validate(req.body.new_password, Joi.string().min(6).max(50));
    if (!error) { return next(); }
    return Helper.joiError(res, error);
  }

  static validateTrip(request, response, next) {
    const schema = Joi.object().keys({
      trip_name: Joi.string().min(3).max(60).required(),
      seating_capacity: Joi.number().integer().positive().min(10)
        .max(50)
        .required(),
      bus_license_number: Joi.string().regex(/[a-zA-Z0-9]/).required(),
      origin: Joi.string().min(3).max(30).required(),
      destination: Joi.string().min(3).max(30).required(),
      trip_date: Joi.date().iso().min(Helper.today()).required(),
      arrival_date: Joi.date().iso().min(Joi.ref('trip_date')).required(),
      time: Joi.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/).required(),
      fare: Joi.number().min(3).max(1000).positive()
        .precision(2)
        .required()
    });

    const body = {
      trip_name: request.body.trip_name,
      seating_capacity: request.body.seating_capacity,
      bus_license_number: request.body.bus_license_number,
      origin: request.body.origin,
      destination: request.body.destination,
      trip_date: request.body.trip_date,
      arrival_date: request.body.arrival_date,
      time: request.body.time,
      fare: parseFloat(request.body.fare)
    };

    const { error } = Joi.validate(body, schema);

    if (!error) { return next(); }
    return Helper.joiError(response, error);
  }

  static validateId(req, res, next) {
    const id = req.params.trip_id || req.params.booking_id;
    const {
      error
    } = Joi.validate(id, Joi.number().integer().positive().required());

    if (!error) {
      return next();
    }
    return Helper.error(res, BAD_REQUEST_CODE, BAD_REQUEST_MSG);
  }

  static async validateBooking(req, res, next) {
    const { trip_id, seat_number } = req.body;
    const schema = Joi.object().keys({
      trip_id: Joi.number().strict().min(1).max(10000)
        .required(),
      seat_number: Joi.number().strict().min(1).max(60)
        .required()
    });

    const { error } = Joi.validate(req.body, schema);

    if (error) { return Helper.joiError(res, error); }

    const data = [parseInt(trip_id, 10), 'cancelled'];
    const values = [parseInt(trip_id, 10), parseInt(seat_number, 10)];

    const sql = `CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      seat_number INTEGER NOT NULL,
      created_on timestamp without time zone DEFAULT NOW());`;
    await creator.createTable(sql);

    const isBooked = await BookingQueries.isBooked(values);
    if (isBooked.rowCount > 0) { return Helper.error(res, RESOURCE_CONFLICT, SEAT_ALREADY_TAKEN); }

    const isCancelled = await TripQueries.getAsSpecified(data);
    if (isCancelled.rowCount > 0) { return Helper.error(res, GONE, GONE_MSG); }

    const tripSeatingCapacity = await TripQueries.getOneById(parseInt(trip_id, 10));
    if (tripSeatingCapacity.error) { return Helper.error(res, NOT_FOUND_CODE, ID_NOT_FOUND); }

    const seating_capacity = parseInt(tripSeatingCapacity.rows[0].seating_capacity, 10);
    if (seating_capacity < parseInt(seat_number, 10)) {
      return Helper.error(res, UNPROCESSABLE_ENTITY, `Given Seat Number Is Higher Than The Expected Maximum ${seating_capacity}`);
    }

    return next();
  }
}
