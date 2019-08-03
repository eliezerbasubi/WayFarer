import Joi from 'joi';
import Helper from '../helpers/helper';
import {
  BAD_REQUEST_CODE, UNPROCESSABLE_ENTITY, RESOURCE_CONFLICT, UNAUTHORIZED_CODE, GONE
} from '../constants/responseCodes';
import { BAD_REQUEST_MSG, UNPROCESSABLE_ENTITY_MSG, GONE_MSG } from '../constants/responseMessages';
import { dbTrip } from '../models/trip';
import {
  MAXIMUM_BOOKINGS, SEAT_ALREADY_TAKEN, NOT_LOGGED_IN
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
      tripName: Joi.string().min(3).max(60).required(),
      seatingCapacity: Joi.number().integer().positive().min(10)
        .max(50)
        .required(),
      busLicenseNumber: Joi.string().regex(/[a-zA-Z0-9]/).required(),
      origin: Joi.string().min(3).max(30).required(),
      destination: Joi.string().min(3).max(30).required(),
      tripDate: Joi.date().iso().min(Helper.today()).required(),
      arrivalDate: Joi.date().iso().min(Joi.ref('tripDate')).required(),
      time: Joi.string().regex(/^([0-9]{2}):([0-9]{2})$/),
      fare: Joi.number().min(3).max(1000).positive()
        .precision(2)
        .required()
    });

    const body = {
      tripName: request.body.tripName,
      seatingCapacity: request.body.seatingCapacity,
      busLicenseNumber: request.body.busLicenseNumber,
      origin: request.body.origin,
      destination: request.body.destination,
      tripDate: request.body.tripDate,
      arrivalDate: request.body.arrivalDate,
      time: request.body.time,
      fare: request.body.fare
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

  static validateBooking(req, res, next) {
    const bookTripID = req.body.tripId;
    const bookSeatNumber = req.body.seatNumber;
    const schema = Joi.object().keys({
      tripId: Joi.number().min(1).max(10000).positive()
        .required(),
      seatNumber: Joi.number().min(1).max(60).positive()
        .required()
    });

    const bookingHeaders = {
      tripId: bookTripID,
      seatNumber: bookSeatNumber
    };

    const { error } = Joi.validate(bookingHeaders, schema);

    if (error) { return Helper.joiError(res, error); }

    if (cache.length < 1) { return Helper.error(res, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

    const isBooked = dbBookings.find(booking => booking.tripId === parseInt(bookTripID, 10)
      && booking.seatNumber === bookSeatNumber);
    if (isBooked) { return Helper.error(res, RESOURCE_CONFLICT, SEAT_ALREADY_TAKEN); }

    let userEmail = '';
    cache.forEach((element) => { userEmail = element.email; });

    const hasBooked = dbBookings.find(booking => booking.email === userEmail
      && booking.tripId === bookTripID);
    if (hasBooked) { return Helper.error(res, RESOURCE_CONFLICT, MAXIMUM_BOOKINGS); }

    const isCancelled = dbTrip.find(trip => trip.tripId === parseInt(bookTripID, 10)
      && trip.status === 'cancelled');

    if (isCancelled) { return Helper.error(res, GONE, GONE_MSG); }

    const hasAtrip = dbTrip.find(atrip => atrip.tripId === parseInt(bookTripID, 10));
    if (hasAtrip) {
      // eslint-disable-next-line radix
      if (parseInt(hasAtrip.seatingCapacity) < parseInt(bookSeatNumber)) {
        return Helper.error(res, UNPROCESSABLE_ENTITY, UNPROCESSABLE_ENTITY_MSG);
      }
    }

    return next();
  }
}
