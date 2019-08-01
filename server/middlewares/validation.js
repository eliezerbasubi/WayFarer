import Joi from 'joi';
import Helper from '../helpers/helper';

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
}
