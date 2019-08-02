import Joi from 'joi';
import Helper from '../helpers/helper';
import {
  BAD_REQUEST_CODE, UNPROCESSABLE_ENTITY, NOT_FOUND_CODE, RESOURCE_CONFLICT, UNAUTHORIZED_CODE
} from '../constants/responseCodes';
import { BAD_REQUEST_MSG, UNPROCESSABLE_ENTITY_MSG } from '../constants/responseMessages';
import { dbTrip } from '../models/trip';
import {
  TRIP_CANCELLED, MAXIMUM_BOOKINGS, SEAT_ALREADY_TAKEN, NOT_LOGGED_IN
} from '../constants/feedback';
import { dbBookings } from '../models/booking';
import { cache } from '../models/user';

export default class Validator {
  /**
   * This function validates user credentials while signing up.
   * @param {*} request -Request to be executed or performed
   * @param {*} response -Response to be returned
   * @param {*} next -Skip process if satifies.
   */
  static signup(request, response, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      firstName: Joi.string().min(3).max(25).required(),
      lastName: Joi.string().min(3).max(25).required(),
      password: Joi.string().min(6).max(50).required(),
      phoneNumber: Joi.number().positive().required(),
      city: Joi.string().min(5).max(30).required(),
      country: Joi.string().min(5).max(30).optional(),
      isAdmin: Joi.bool().valid(true, false).required()
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

  /**
   * This function validates trip inputs
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  static validateTrip(request, response, next) {
    const schema = Joi.object().keys({
      trip_id: Joi.number().integer().positive().max(10000)
        .required(),
      trip_name: Joi.string().min(3).max(60).required(),
      seating_capacity: Joi.number().integer().positive().min(10)
        .max(50)
        .required(),
      bus_license_number: Joi.string().regex(/[a-zA-Z0-9]/).required(),
      trip_origin: Joi.string().min(3).max(30).required(),
      destination: Joi.string().min(3).max(30).required(),
      trip_date: Joi.date().iso().min(Helper.today()).required(),
      arrival_date: Joi.date().iso().min(Joi.ref('trip_date')).required(),
      time: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
      fare: Joi.number().min(3).max(1000).positive()
        .precision(2)
        .required()
    });

    const headerData = {
      trip_id: request.headers.trip_id,
      trip_name: request.headers.trip_name,
      seating_capacity: request.headers.seating_capacity,
      bus_license_number: request.headers.bus_license_number,
      trip_origin: request.headers.trip_origin,
      destination: request.headers.destination,
      trip_date: request.headers.trip_date,
      arrival_date: request.headers.arrival_date,
      time: request.headers.time,
      fare: request.headers.fare
    };

    const { error } = Joi.validate(headerData, schema);

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

  static validateBooking(req, res, next) {
    const bookTripID = req.headers.trip_id;
    const bookSeatNumber = req.headers.seat_number;
    const schema = Joi.object().keys({
      trip_id: Joi.number().min(1).max(10000).positive()
        .required(),
      seat_number: Joi.number().min(1).max(60).positive()
        .required()
    });

    const bookingHeaders = {
      trip_id: bookTripID,
      seat_number: bookSeatNumber
    };

    const { error } = Joi.validate(bookingHeaders, schema);

    if (error) { return Helper.joiError(res, error); }

    if (cache.length < 1) { return Helper.error(res, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

    const isBooked = dbBookings.find(booking => booking.tripId === bookTripID
      && booking.seatNumber === bookSeatNumber);
    if (isBooked) { return Helper.error(res, RESOURCE_CONFLICT, SEAT_ALREADY_TAKEN); }

    let userEmail = '';
    cache.forEach((element) => { userEmail = element.email; });

    const hasBooked = dbBookings.find(booking => booking.email === userEmail
      && booking.tripId === bookTripID);
    if (hasBooked) { return Helper.error(res, RESOURCE_CONFLICT, MAXIMUM_BOOKINGS); }

    const isCancelled = dbTrip.find(trip => trip.tripId === bookTripID
      && trip.status === 'cancelled');

    if (isCancelled) { return Helper.error(res, NOT_FOUND_CODE, TRIP_CANCELLED); }
    const hasAtrip = dbTrip.find(atrip => atrip.tripId === bookTripID);
    if (hasAtrip) {
      // eslint-disable-next-line radix
      if (parseInt(hasAtrip.seatingCapacity) < parseInt(bookSeatNumber)) {
        return Helper.error(res, UNPROCESSABLE_ENTITY, UNPROCESSABLE_ENTITY_MSG);
      }
    }

    return next();
  }
}
