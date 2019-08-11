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
  static signup(request, response, next) {
    const schema = Joi.object().keys({
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      first_name: Joi.string().min(3).max(25).required(),
      last_name: Joi.string().min(3).max(25).required(),
      password: Joi.string().min(6).max(50).required(),
      phone_number: Joi.number().positive().required(),
      city: Joi.string().min(5).max(30).required(),
      country: Joi.string().min(5).max(30).optional(),
      is_admin: Joi.boolean().strict().valid(true, false).required()
    });

    const { error } = Joi.validate(request.body, schema);

    if (!error) { return next(); }

    return Helper.joiError(response, error);
  }

  // static validatePassword(req, res, next) {
  //   const { error } = Joi.validate(req.body.new_password, Joi.string().min(6).max(50));
  //   if (!error) { return next(); }
  //   return Helper.joiError(res, error);
  // }

  // static validateTrip(request, response, next) {
  //   const schema = Joi.object().keys({
  //     trip_name: Joi.string().min(3).max(60).required(),
  //     seating_capacity: Joi.number().integer().positive().min(10)
  //       .max(50)
  //       .required(),
  //     bus_license_number: Joi.string().regex(/[a-zA-Z0-9]/).required(),
  //     origin: Joi.string().min(3).max(30).required(),
  //     destination: Joi.string().min(3).max(30).required(),
  //     trip_date: Joi.date().iso().min(Helper.today()).required(),
  //     arrival_date: Joi.date().iso().min(Joi.ref('trip_date')).required(),
  //     time: Joi.string().regex(/^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/).required(),
  //     fare: Joi.number().min(3).max(1000).positive()
  //       .precision(2)
  //       .required()
  //   });

  //   const body = {
  //     trip_name: request.body.trip_name,
  //     seating_capacity: request.body.seating_capacity,
  //     bus_license_number: request.body.bus_license_number,
  //     origin: request.body.origin,
  //     destination: request.body.destination,
  //     trip_date: request.body.trip_date,
  //     arrival_date: request.body.arrival_date,
  //     time: request.body.time,
  //     fare: parseFloat(request.body.fare)
  //   };

  //   const { error } = Joi.validate(body, schema);

  //   if (!error) { return next(); }
  //   return Helper.joiError(response, error);
  // }

  // static validateId(req, res, next) {
  //   const id = req.params.trip_id || req.params.booking_id;
  //   const {
  //     error
  //   } = Joi.validate(id, Joi.number().integer().positive().required());

  //   if (!error) {
  //     return next();
  //   }

  //   return Helper.error(res, BAD_REQUEST_CODE, BAD_REQUEST_MSG);
  // }

  // static validateBooking(req, res, next) {
  //   const bookTripID = req.body.trip_id;
  //   const bookSeatNumber = req.body.seat_number;
  //   const schema = Joi.object().keys({
  //     trip_id: Joi.number().strict().min(1).max(10000)
  //       .positive()
  //       .required(),
  //     seat_number: Joi.number().strict().min(1).max(60)
  //       .positive()
  //       .required()
  //   });

  //   const bookingHeaders = {
  //     trip_id: bookTripID,
  //     seat_number: bookSeatNumber
  //   };

  //   const { error } = Joi.validate(bookingHeaders, schema);

  //   if (error) { return Helper.joiError(res, error); }

  //   if (cache.length < 1) { return Helper.error(res, UNAUTHORIZED_CODE, NOT_LOGGED_IN); }

  //   const isBooked = dbBookings.find(booking => booking.trip_id === parseInt(bookTripID, 10)
  //     && booking.seat_number === bookSeatNumber);
  //   if (isBooked) { return Helper.error(res, RESOURCE_CONFLICT, SEAT_ALREADY_TAKEN); }

  //   let userEmail = '';
  //   cache.forEach((element) => { userEmail = element.email; });

  //   const hasBooked = dbBookings.find(booking => booking.email === userEmail
  //     && booking.trip_id === bookTripID);
  //   if (hasBooked) { return Helper.error(res, RESOURCE_CONFLICT, MAXIMUM_BOOKINGS); }

  //   const isCancelled = dbTrip.find(trip => trip.trip_id === parseInt(bookTripID, 10)
  //     && trip.status === 'cancelled');

  //   if (isCancelled) { return Helper.error(res, GONE, GONE_MSG); }

  //   const hasAtrip = dbTrip.find(atrip => atrip.trip_id === parseInt(bookTripID, 10));
  //   if (hasAtrip) {
  //     if (parseInt(hasAtrip.seatingCapacity, 10) < parseInt(bookSeatNumber, 10)) {
  //       return Helper.error(res, UNPROCESSABLE_ENTITY, UNPROCESSABLE_ENTITY_MSG);
  //     }
  //   }

  //   return next();
  // }
}
