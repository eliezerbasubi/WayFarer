import Joi from 'joi';
import Helper from '../helpers/helper';

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
}
